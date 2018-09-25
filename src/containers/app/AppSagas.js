/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { Types } from 'lattice';
import {
  AppApiActions,
  AppApiSagas,
  DataApiActions,
  DataApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
} from 'lattice-sagas';
import { push } from 'react-router-redux';
import {
  all,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import Logger from '../../utils/Logger';
import * as Routes from '../../core/router/Routes';
import { APP_NAME } from '../../shared/Consts';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../utils/Errors';
import { isBaltimoreOrg } from '../../utils/Whitelist';
import {
  LOAD_APP,
  LOAD_HOSPITALS,
  SWITCH_ORGANIZATION,
  loadApp,
  loadHospitals
} from './AppActions';

const { SecurableTypes } = Types;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { getEntityDataModelProjection } = EntityDataModelApiActions;
const { getEntityDataModelProjectionWorker } = EntityDataModelApiSagas;
const { getApp, getAppConfigs, getAppTypes } = AppApiActions;
const { getAppWorker, getAppConfigsWorker, getAppTypesWorker } = AppApiSagas;

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

  try {
    yield put(loadApp.request(action.id));

    /*
     * 1. load App
     */

    let response :any = {};
    response = yield call(getAppWorker, getApp(APP_NAME));
    if (response.error) throw response.error;

    /*
     * 2. load AppConfigs and AppTypes
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
    yield put(loadApp.success(action.id, {
      app,
      appConfigs,
      appTypes,
      edm
    }));
  }
  catch (error) {
    LOG.error('caught exception in loadAppWorker()', error);
    yield put(loadApp.failure(action.id, error));
  }
  finally {
    yield put(loadApp.finally(action.id));
  }
}

/*
 * loadHospitals()
 */

function* loadHospitalsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_HOSPITALS, loadHospitalsWorker);
}

function* loadHospitalsWorker(action :SequenceAction) :Generator<*, *, *> {

  const { id, value } = action;
  if (value === null || value === undefined) {
    yield put(loadHospitals.failure(id, ERR_ACTION_VALUE_NOT_DEFINED));
    return;
  }

  let entitySetId :string = value.entitySetId;
  const organizationId :string = value.organizationId;

  try {
    yield put(loadHospitals.request(action.id));
    if (isBaltimoreOrg(organizationId)) {
      // use "Baltimore Police Department Hospitals" EntitySet
      entitySetId = BALTIMORE_HOSPITALS_ES_ID;
    }
    const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId }));
    if (response.error) throw response.error;
    yield put(loadHospitals.success(action.id, response.data));
  }
  catch (error) {
    yield put(loadHospitals.failure(action.id, error));
  }
  finally {
    yield put(loadHospitals.finally(action.id));
  }
}

/*
 * switchOrganization()
 */

function* switchOrganizationWatcher() :Generator<*, *, *> {

  yield takeEvery(SWITCH_ORGANIZATION, switchOrganizationWorker);
}

function* switchOrganizationWorker() :Generator<*, *, *> {

  // not ideal since it resets clears form inputs, but none of that is being stored in redux at the moment anyway...
  // TODO: check action.orgId !== selectedOrganizationId
  yield put(push(Routes.HOME_PATH));
}

/*
 *
 * exports
 *
 */

export {
  loadAppWatcher,
  loadHospitalsWatcher,
  switchOrganizationWatcher,
};
