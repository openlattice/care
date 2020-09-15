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
import { Constants } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import {
  AppApiActions,
  AppApiSagas,
  DataApiActions,
  DataApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
  SearchApiActions,
  SearchApiSagas,
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
import { APP_DETAILS_FQN } from '../../edm/DataModelFqns';
import { APP_NAME, APP_TYPES_FQNS } from '../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE, ERR_WORKER_SAGA } from '../../utils/Errors';
import { getCurrentUserStaffMemberData } from '../staff/StaffActions';
import { getCurrentUserStaffMemberDataWorker } from '../staff/StaffSagas';

const { OPENLATTICE_ID_FQN } = Constants;
const { isValidUUID } = ValidationUtils;
const { getApp, getAppConfigs } = AppApiActions;
const { getAppWorker, getAppConfigsWorker } = AppApiSagas;
const { getAllPropertyTypes } = EntityDataModelApiActions;
const { getAllPropertyTypesWorker } = EntityDataModelApiSagas;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

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

    const appSettingsESIDByOrgId = Map().withMutations((mutable) => {
      appConfigs.forEach((appConfig :Object) => {
        const { config } = appConfig;
        const { organization } :Object = appConfig;
        const orgId :string = organization.id;
        if (Object.keys(config).length) {
          const appSettingsConfig = config[APP_SETTINGS_FQN];
          mutable.set(orgId, appSettingsConfig.entitySetId);
        }
      });
    });

    const searchConstraints = (entitySetId :UUID) => ({
      entitySetIds: [entitySetId],
      constraints: [{
        constraints: [{
          searchTerm: '*'
        }],
      }],
      maxHits: 10000,
      start: 0,
    });

    const appSettingsRequests = appSettingsESIDByOrgId
      .valueSeq()
      .map((entitySetId) => (
        call(searchEntitySetDataWorker, searchEntitySetData(searchConstraints(entitySetId)))
      ));

    const orgIds = appSettingsESIDByOrgId.keySeq().toJS();
    const appSettingResponses = yield all(appSettingsRequests.toJS());

    const responseError = appSettingResponses.reduce(
      (error, result) => (error || result.error), undefined
    );
    if (responseError) throw responseError;

    const appSettingsByOrgId = Map().withMutations((mutable) => {
      appSettingResponses.map(({ data }) => fromJS(data.hits)).forEach((hit, i) => {

        const organizationId = orgIds[i];
        const settingsEntity = hit.first();
        if (settingsEntity) {
          const appDetails = settingsEntity.getIn([APP_DETAILS_FQN, 0]);
          const settingsEKID = settingsEntity.getIn([OPENLATTICE_ID_FQN, 0]);
          try {
            const parsedAppDetails = JSON.parse(appDetails);
            const parsedAppSettings = fromJS(parsedAppDetails)
              .set(OPENLATTICE_ID_FQN, settingsEKID);
            mutable.set(organizationId, parsedAppSettings);
          }
          catch (error) {
            LOG.error('could not parse app details');
            mutable.set(organizationId, settingsEntity.set(APP_DETAILS_FQN, Map()));
          }
        }
      });
    });

    workerResponse.data = {
      app,
      appConfigs,
      appSettingsByOrgId
    };

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
