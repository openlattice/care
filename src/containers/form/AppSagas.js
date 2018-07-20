/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import {
  AppApiActionFactory,
  AppApiSagas,
  DataApiActionFactory,
  DataApiSagas,
  EntityDataModelApiActionFactory,
  EntityDataModelApiSagas,
} from 'lattice-sagas';

import { push } from 'react-router-redux';
import { call, put, takeEvery } from 'redux-saga/effects';

import { APP_NAME } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';
import * as Routes from '../../core/router/Routes';

import {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  LOAD_HOSPITALS,
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations,
  loadHospitals
} from './AppActionFactory';

const { getEntitySetData } = DataApiActionFactory;
const { getEntitySetDataWorker } = DataApiSagas;
const { getEntityDataModelProjection } = EntityDataModelApiActionFactory;
const { getEntityDataModelProjectionWorker } = EntityDataModelApiSagas;
const { getApp, getAppConfigs, getAppTypes } = AppApiActionFactory;
const { getAppWorker, getAppConfigsWorker, getAppTypesWorker } = AppApiSagas;

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

    const getAppResponse = yield call(getAppWorker, getApp(APP_NAME));
    const app = getAppResponse.data;
    yield put(loadConfigurations(app.id));

    const getAppTypesResponse = yield call(getAppTypesWorker, getAppTypes(app.appTypeIds));
    const appTypes = Object.values(getAppTypesResponse.data);
    const projection = appTypes.map(appType => ({
      id: appType.entityTypeId,
      include: [
        'EntityType',
        'PropertyTypeInEntitySet'
      ],
      type: 'EntityType'
    }));

    const edmResponse = yield call(
      getEntityDataModelProjectionWorker,
      getEntityDataModelProjection(projection)
    );
    const edm = edmResponse.data;
    yield put(loadApp.success(action.id, { app, appTypes, edm }));
  }
  catch (error) {
    yield put(loadApp.failure(action.id, error));
  }
  finally {
    yield put(loadApp.finally(action.id));
  }
}

/*
 * loadConfigurations()
 */

function* loadAppConfigsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_CONFIGURATIONS, loadAppConfigsWorker);
}

function* loadAppConfigsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadConfigurations.request(action.id));
    const response = yield call(getAppConfigsWorker, getAppConfigs(action.value));
    yield put(loadConfigurations.success(action.id, response.data));
  }
  catch (error) {
    yield put(loadConfigurations.failure(action.id, error));
  }
  finally {
    yield put(loadConfigurations.finally(action.id));
  }
}

/*
 * loadHospitals()
 */

function* loadHospitalsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_HOSPITALS, loadHospitalsWorker);
}

function* loadHospitalsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadHospitals.request(action.id));

    const entitySetId :string = (action.value :any);
    if (!entitySetId || !isValidUuid(entitySetId)) {
      throw new Error(`hospitals EntitySet id is not a valid UUID: ${entitySetId}`);
    }

    const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId }));
    if (response.error) {
      throw new Error(response.error);
    }
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
 * selectOrganization()
 */

function* selectOrganizationWatcher() :Generator<*, *, *> {

  yield takeEvery(SELECT_ORGANIZATION, selectOrganizationWorker);
}

function* selectOrganizationWorker() :Generator<*, *, *> {

  // not ideal since it resets clears form inputs, but none of that is being stored in redux at the moment anyway...
  yield put(push(Routes.HOME));
}

/*
 *
 * exports
 *
 */

export {
  loadAppWatcher,
  loadAppConfigsWatcher,
  loadHospitalsWatcher,
  selectOrganizationWatcher
};
