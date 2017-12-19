/*
 * @flow
 */

import {
  AppApiActionFactory,
  EntityDataModelApiActionFactory
} from 'lattice-sagas';

import { put, take, takeEvery } from 'redux-saga/effects';

import { APP_NAME } from '../../shared/Consts';

import {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  loadApp,
  loadConfigurations
} from './AppActionFactory';

const {
  getApp,
  getAppConfigs,
  getAppTypes
} = AppApiActionFactory;

const { getEntityDataModelProjection } = EntityDataModelApiActionFactory;

/*
 * helper functions
 */

function matchGetProjectionResponse(getProjectionAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === getEntityDataModelProjection.SUCCESS && anAction.id === getProjectionAction.id)
      || (anAction.type === getEntityDataModelProjection.FAILURE && anAction.id === getProjectionAction.id);
  };
}

function matchGetAppResponse(getAppAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === getApp.SUCCESS && anAction.id === getAppAction.id)
      || (anAction.type === getApp.FAILURE && anAction.id === getAppAction.id);
  };
}

function matchGetAppTypesResponse(getAppTypesAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === getAppTypes.SUCCESS && anAction.id === getAppTypesAction.id)
      || (anAction.type === getAppTypes.FAILURE && anAction.id === getAppTypesAction.id);
  };
}

function matchGetAppConfigsResponse(getAppConfigsAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === getAppConfigs.SUCCESS && anAction.id === getAppConfigsAction.id)
      || (anAction.type === getAppConfigs.FAILURE && anAction.id === getAppConfigsAction.id);
  };
}

/*
 * sagas
 */

export function* loadAppWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadApp.request(action.id));

    const getAppAction = getApp(APP_NAME);
    yield put(getAppAction);
    const getAppResponseAction = yield take(matchGetAppResponse(getAppAction));

    const app = getAppResponseAction.value;
    yield put(loadConfigurations(app.id));

    const getAppTypesAction = getAppTypes(app.appTypeIds);
    yield put(getAppTypesAction);
    const appTypesResponseAction = yield take(matchGetAppTypesResponse(getAppTypesAction));

    const appTypes = Object.values(appTypesResponseAction.value);
    const projection :Object[] = appTypes.map((appType :Object) => {
      return {
        id: appType.entityTypeId,
        include: [
          'EntityType',
          'PropertyTypeInEntitySet'
        ],
        type: 'EntityType'
      };
    });

    const getProjectionAction :SequenceAction = getEntityDataModelProjection(projection);
    yield put(getProjectionAction);
    const getProjectionResponseAction = yield take(matchGetProjectionResponse(getProjectionAction));

    const edm = getProjectionResponseAction.value;
    yield put(loadApp.success(action.id, { app, appTypes, edm }));
  }
  catch (error) {
    yield put(loadApp.failure(action.id, error));
  }
  finally {
    yield put(loadApp.finally(action.id));
  }
}

export function* loadAppWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_APP, loadAppWorker);
}

export function* loadAppConfigsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(loadConfigurations.request(action.id));

    const appId = action.value;

    const getAppConfigsAction = getAppConfigs(appId);
    yield put(getAppConfigsAction);
    const getAppConfigsResponseAction = yield take(matchGetAppConfigsResponse(getAppConfigsAction));
    const configurations = getAppConfigsResponseAction.value;

    yield put(loadConfigurations.success(action.id, configurations));
  }
  catch (error) {
    yield put(loadConfigurations.failure(action.id, error));
  }
  finally {
    yield put(loadConfigurations.finally(action.id));
  }
}

export function* loadAppConfigsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_CONFIGURATIONS, loadAppConfigsWorker);
}
