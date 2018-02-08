/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import {
  AppApiActionFactory,
  DataApiActionFactory,
  EntityDataModelApiActionFactory,
  SyncApiActionFactory
} from 'lattice-sagas';

import { put, take, takeEvery } from 'redux-saga/effects';

import { APP_NAME } from '../../shared/Consts';
import { isValidUuid } from '../../utils/Utils';

import {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  LOAD_HOSPITALS,
  loadApp,
  loadConfigurations,
  loadHospitals
} from './AppActionFactory';

const { getEntitySetData } = DataApiActionFactory;
const { getCurrentSyncId } = SyncApiActionFactory;
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

function takeReqSeqSuccessFailure(reqseq :RequestSequence, seqAction :SequenceAction) {
  return take(
    (anAction :Object) => {
      return (anAction.type === reqseq.SUCCESS && anAction.id === seqAction.id)
        || (anAction.type === reqseq.FAILURE && anAction.id === seqAction.id);
    }
  );
}

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

    const getAppAction = getApp(APP_NAME);
    yield put(getAppAction);
    const getAppResponseAction = yield take(matchGetAppResponse(getAppAction));

    const app = getAppResponseAction.value;
    yield put(loadConfigurations(app.id));

    const getAppTypesAction = getAppTypes(app.appTypeIds);
    yield put(getAppTypesAction);
    const appTypesResponseAction = yield take(matchGetAppTypesResponse(getAppTypesAction));

    const appTypes = Object.values(appTypesResponseAction.value);
    const projection = appTypes.map((appType) => {
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

/*
 * loadConfigurations()
 */

function* loadAppConfigsWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_CONFIGURATIONS, loadAppConfigsWorker);
}

function* loadAppConfigsWorker(action :SequenceAction) :Generator<*, *, *> {

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

    /*
     * 1. get sync id for the hospitals EntitySet for the selected organization
     */

    let syncId :string = '';
    const getSyncIdAction :SequenceAction = getCurrentSyncId(entitySetId);
    yield put(getSyncIdAction);
    const getSyncIdResponseAction = yield takeReqSeqSuccessFailure(getCurrentSyncId, getSyncIdAction);
    if (getSyncIdResponseAction.type === getCurrentSyncId.SUCCESS && getSyncIdResponseAction.value) {
      syncId = getSyncIdResponseAction.value;
    }
    else {
      throw new Error(getSyncIdResponseAction.value);
    }

    /*
     * 2. get the actual data in the hospitals EntitySet
     */

    let data :Object[];
    const getDataAction :SequenceAction = getEntitySetData({ entitySetId, syncId });
    yield put(getDataAction);
    const getDataResponseAction = yield takeReqSeqSuccessFailure(getEntitySetData, getDataAction);
    if (getDataResponseAction.type === getEntitySetData.SUCCESS && getDataResponseAction.value) {
      data = getDataResponseAction.value;
    }
    else {
      throw new Error(getDataResponseAction.value);
    }

    yield put(loadHospitals.success(action.id, data));
  }
  catch (error) {
    yield put(loadHospitals.failure(action.id, error));
  }
  finally {
    yield put(loadHospitals.finally(action.id));
  }
}

/*
 *
 * exports
 *
 */

export {
  loadAppWatcher,
  loadAppConfigsWatcher,
  loadHospitalsWatcher
};
