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
import { Types } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import {
  AppApiActions,
  AppApiSagas,
  DataApiActions,
  DataApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../utils/Logger';
import * as Routes from '../../core/router/Routes';
import { getCurrentUserStaffMemberDataWorker } from '../staff/StaffSagas';
import { getCurrentUserStaffMemberData } from '../staff/StaffActions';
import { APP_NAME, APP_TYPES_FQNS } from '../../shared/Consts';
import { ERR_WORKER_SAGA, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isBaltimoreOrg } from '../../utils/Whitelist';
import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  LOAD_HOSPITALS,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
  loadHospitals,
} from './AppActions';
import { isValidUuid } from '../../utils/Utils';

const { SecurableTypes } = Types;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { getEntityDataModelProjection, getAllPropertyTypes } = EntityDataModelApiActions;
const { getEntityDataModelProjectionWorker, getAllPropertyTypesWorker } = EntityDataModelApiSagas;
const { getApp, getAppConfigs, getAppTypes } = AppApiActions;
const { getAppWorker, getAppConfigsWorker, getAppTypesWorker } = AppApiSagas;

const { HOSPITALS_FQN } = APP_TYPES_FQNS;

const BALTIMORE_HOSPITALS_ES_ID :string = '1526c664-4868-468f-9255-307aed65a7ed';

const LOG = new Logger('AppSagas');

/*
 *
 * sagas
 *
 */

/*
 * loadApp()
 */

function* loadAppWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_APP, loadAppWorker);
}

function* loadAppWorker(action :SequenceAction) :Generator<*, *, *> {

  const workerResponse :Object = {};
  try {
    yield put(loadApp.request(action.id));

    /*
     * 1. load App
     */
    let response :any = yield call(getAppWorker, getApp(APP_NAME));
    if (response.error) throw response.error;

    /*
     * 2. load AppConfigs, AppTypes and CurrentUserStaff
     */

    const app = response.data;
    response = yield all([
      call(getAppConfigsWorker, getAppConfigs(app.id)),
      call(getAppTypesWorker, getAppTypes(app.appTypeIds)),
    ]);
    if (response[0].error) throw response[0].error;
    if (response[1].error) throw response[1].error;

    /*
     * 3. load EntityTypes and PropertyTypes
     */

    const appConfigs :Object[] = response[0].data;
    const appTypesMap :Object = response[1].data;
    const appTypes :Object[] = (Object.values(appTypesMap) :any);
    const projection :Object[] = appTypes.map((appType :Object) => ({
      id: appType.entityTypeId,
      include: [SecurableTypes.EntityType, SecurableTypes.PropertyTypeInEntitySet],
      type: SecurableTypes.EntityType,
    }));
    response = yield call(getEntityDataModelProjectionWorker, getEntityDataModelProjection(projection));
    if (response.error) throw response.error;

    const edm :Object = response.data;
    workerResponse.data = {
      app,
      appConfigs,
      appTypes,
      edm
    };

    yield put(loadApp.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error('caught exception in loadAppWorker()', error);
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

function* loadHospitalsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_HOSPITALS, loadHospitalsWorker);
}

function* loadHospitalsWorker(action :SequenceAction) :Generator<*, *, *> {
  const workerResponse = {};

  try {
    yield put(loadHospitals.request(action.id));

    const organizationId :UUID = yield select(state => state.getIn(['app', 'selectedOrganizationId']));
    let entitySetId :UUID = yield select(
      state => state.getIn(['app', HOSPITALS_FQN, 'entitySetsByOrganization', organizationId])
    );

    if (isBaltimoreOrg(organizationId)) {
      // use "Baltimore Police Department Hospitals" EntitySet
      entitySetId = BALTIMORE_HOSPITALS_ES_ID;
    }
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

function* switchOrganizationWatcher() :Generator<*, *, *> {

  yield takeEvery(SWITCH_ORGANIZATION, switchOrganizationWorker);
}

function* switchOrganizationWorker(action :Object) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isValidUuid(value)) throw ERR_ACTION_VALUE_TYPE;

    const currentOrgId = yield select(state => state.getIn(['app', 'selectedOrganizationId']));
    if (value !== currentOrgId) {
      AccountUtils.storeOrganizationId(value);
      yield put(push(Routes.HOME_PATH));
      yield call(initializeApplicationWorker, initializeApplication());
    }
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
  }
}

/*
 * initializeApplication()
 */

function* initializeApplicationWorker(action :SequenceAction) :Generator<*, *, *> {

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
    const hospitalRequest = yield call(loadHospitalsWorker, loadHospitals());

    const phaseTwoResponse = yield all([
      staffRequest,
      hospitalRequest
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

function* initializeApplicationWatcher() :Generator<*, *, *> {

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
