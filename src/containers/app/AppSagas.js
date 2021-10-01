/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import {
  all,
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import { Map, fromJS } from 'immutable';
import { AccountUtils } from 'lattice-auth';
import {
  AppApiActions,
  AppApiSagas,
  DataApiActions,
  DataApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
} from 'lattice-sagas';
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  LOAD_HOSPITALS,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
  loadHospitals,
} from './AppActions';

import * as Routes from '../../core/router/Routes';
import { APP_NAME, APP_TYPES_FQNS } from '../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE, ERR_WORKER_SAGA } from '../../utils/Errors';
import { getAppSettings } from '../settings/actions';
import { getAppSettingsWorker } from '../settings/sagas';
import { getCurrentUserStaffMemberData } from '../staff/StaffActions';
import { getCurrentUserStaffMemberDataWorker } from '../staff/StaffSagas';

const { isValidUUID } = ValidationUtils;
const { getApp, getAppConfigs } = AppApiActions;
const { getAppWorker, getAppConfigsWorker } = AppApiSagas;
const { getAllPropertyTypes } = EntityDataModelApiActions;
const { getAllPropertyTypesWorker } = EntityDataModelApiSagas;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;

const { HOSPITALS_FQN, APP_SETTINGS_FQN } = APP_TYPES_FQNS;

const LOG = new Logger('AppSagas');

/*
 *
 * sagas
 *
 */

/*
 * loadApp()
 */

function* loadAppWatcher() :Saga<*> {

  yield takeEvery(LOAD_APP, loadAppWorker);
}

function* loadAppWorker(action :SequenceAction) :Saga<*> {

  const workerResponse :Object = {};
  try {
    yield put(loadApp.request(action.id));

    /*
     * 1. load App
     */
    const response :any = yield call(getAppWorker, getApp(APP_NAME));
    if (response.error) throw response.error;

    /*
     * 2. load AppConfigs, AppTypes and CurrentUserStaff
     */

    const app = response.data;
    const appConfigsResponse = yield call(getAppConfigsWorker, getAppConfigs(app.id));
    if (appConfigsResponse.error) throw appConfigsResponse.error;

    /*
     * 3. load EntityTypes and PropertyTypes
     */

    const appConfigs :Object[] = appConfigsResponse.data;

    let selectedOrganizationId :string = '';
    const storedOrganizationId :?string = AccountUtils.retrieveOrganizationId();
    const hasConfig = !!appConfigs.find((config) => config?.organization?.id === storedOrganizationId);
    if (storedOrganizationId && hasConfig) {
      selectedOrganizationId = storedOrganizationId;
    }
    else {
      selectedOrganizationId = appConfigs[0].organization.id;
    }

    const appSettingsESIDByOrgId = Map().withMutations((mutable) => {
      appConfigs.forEach((appConfig :Object) => {
        const { config, organization } = appConfig;
        const orgId :string = organization.id;
        if (Object.keys(config).length) {
          const appSettingsConfig = config[APP_SETTINGS_FQN];
          mutable.set(orgId, appSettingsConfig.entitySetId);
        }
      });
    });

    const appSettingsESID = appSettingsESIDByOrgId.get(selectedOrganizationId);
    const appSettingsResponse = yield call(getAppSettingsWorker, getAppSettings(appSettingsESID));
    if (appSettingsResponse.error) throw appSettingsResponse.error;

    const organizations = {};
    let selectedOrgEntitySetIds = {};
    appConfigs.forEach((appConfig :Object) => {

      const { config, organization } :Object = appConfig;
      const orgId :string = organization.id;
      organizations[orgId] = organization;
      if (orgId === selectedOrganizationId) {
        selectedOrgEntitySetIds = Object.fromEntries(Object.entries(config)
        // $FlowFixMe object incompatible with mixed
          .map(([appTypeFQN, appType]) => [appTypeFQN, appType.entitySetId]));
      }
    });

    workerResponse.data = fromJS({
      app,
      organizations,
      selectedOrgEntitySetIds,
      selectedOrganizationId,
    });

    yield put(loadApp.success(action.id, workerResponse.data));

  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse.error = error;
    yield put(loadApp.failure(action.id, error));
  }
  finally {
    yield put(loadApp.finally(action.id));
  }

  return workerResponse;
}

/*
 * loadHospitals()
 */

function* loadHospitalsWatcher() :Saga<*> {

  yield takeEvery(LOAD_HOSPITALS, loadHospitalsWorker);
}

function* loadHospitalsWorker(action :SequenceAction) :Saga<*> {
  const workerResponse = {};

  try {
    yield put(loadHospitals.request(action.id));

    const organizationId :UUID = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    const entitySetId :UUID = yield select(
      (state) => state.getIn(['app', HOSPITALS_FQN, 'entitySetsByOrganization', organizationId])
    );

    const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId }));
    if (response.error) throw response.error;
    workerResponse.data = response.data;

    yield put(loadHospitals.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    workerResponse.error = error;
    yield put(loadHospitals.failure(action.id, error));
  }
  finally {
    yield put(loadHospitals.finally(action.id));
  }

  return workerResponse;
}

/*
 * switchOrganization()
 */

function* switchOrganizationWatcher() :Saga<*> {

  yield takeEvery(SWITCH_ORGANIZATION, switchOrganizationWorker);
}

function* switchOrganizationWorker(action :Object) :Saga<*> {

  try {
    const { value } = action;
    if (!isValidUUID(value)) throw ERR_ACTION_VALUE_TYPE;

    const currentOrgId = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    if (value !== currentOrgId) {
      AccountUtils.storeOrganizationId(value);
      yield put(push(Routes.HOME_PATH));
      yield put(initializeApplication());
    }
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
  }
}

/*
 * initializeApplication()
 */

function* initializeApplicationWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(initializeApplication.request(action.id));

    // Load app and property types
    const phaseOneResponse = yield all([
      call(loadAppWorker, loadApp()),
      call(getAllPropertyTypesWorker, getAllPropertyTypes())
    ]);

    const phaseOneErrors = phaseOneResponse.reduce((acc, response) => {
      if (response.error) {
        acc.push(response.error);
      }
      return acc;
    }, []);

    if (phaseOneErrors.length) throw phaseOneErrors;

    // The following requests require the completion of phase one requests
    // Get/create current user staff entity
    const staffRequest = yield call(
      getCurrentUserStaffMemberDataWorker,
      getCurrentUserStaffMemberData({ createIfNotExists: true })
    );

    // Get hospitals if necessary
    // const hospitalRequest = yield call(loadHospitalsWorker, loadHospitals());

    const phaseTwoResponse = yield all([
      staffRequest,
      // hospitalRequest
    ]);

    const phaseTwo = phaseTwoResponse.reduce((acc, response) => {
      if (response.error) {
        acc.push(response.error);
      }
      return acc;
    }, []);

    if (phaseTwo.length) throw phaseTwo;

    yield put(initializeApplication.success(action.id));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(initializeApplication.failure(action.id, error));
  }
  finally {
    yield put(initializeApplication.finally(action.id));
  }
}

function* initializeApplicationWatcher() :Saga<*> {

  yield takeEvery(INITIALIZE_APPLICATION, initializeApplicationWorker);
}

/*
 *
 * exports
 *
 */

export {
  initializeApplicationWatcher,
  loadAppWatcher,
  loadHospitalsWatcher,
  switchOrganizationWatcher,
};
