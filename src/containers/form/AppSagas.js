/*
 * @flow
 */

import { put, take, takeEvery } from 'redux-saga/effects';

import { APP_NAMES } from '../../shared/Consts';

import {
  fetchApp,
  fetchAppConfigs,
  fetchAppTypes,
  fetchEntityDataModelProjection
} from '../../core/lattice/LatticeActionFactory';

import {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  loadApp,
  loadConfigurations
} from './AppActionFactory';

import type { SequenceAction } from '../../core/redux/RequestSequence';

/*
 * helper functions
 */

function matchFetchProjectionResponse(fetchProjectionAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchEntityDataModelProjection.SUCCESS && anAction.id === fetchProjectionAction.id)
      || (anAction.type === fetchEntityDataModelProjection.FAILURE && anAction.id === fetchProjectionAction.id);
  };
}

function matchFetchAppResponse(fetchAppAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchApp.SUCCESS && anAction.id === fetchAppAction.id)
      || (anAction.type === fetchApp.FAILURE && anAction.id === fetchAppAction.id);
  };
}

function matchFetchAppTypesResponse(fetchAppTypesAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchAppTypes.SUCCESS && anAction.id === fetchAppTypesAction.id)
      || (anAction.type === fetchAppTypes.FAILURE && anAction.id === fetchAppTypesAction.id);
  };
}

function matchFetchAppConfigsResponse(fetchAppConfigsAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchAppConfigs.SUCCESS && anAction.id === fetchAppConfigsAction.id)
      || (anAction.type === fetchAppConfigs.FAILURE && anAction.id === fetchAppConfigsAction.id);
  };
}

/*
 * sagas
 */

 export function* loadAppWorker() :Generator<*, *, *> {

   try {

     yield put(loadApp.request());

     let anyErrors :boolean = false;

     const fetchAppAction = fetchApp({ appName: APP_NAMES.APP });
     yield put(fetchAppAction);
     const fetchAppResponseAction = yield take(matchFetchAppResponse(fetchAppAction));

     const app = fetchAppResponseAction.data.app;
     yield put(loadConfigurations({ appId: app.id }));

     const fetchAppTypesAction = fetchAppTypes({ appTypeIds: app.appTypeIds });
     yield put(fetchAppTypesAction);
     const appTypesResponseAction = yield take(matchFetchAppTypesResponse(fetchAppTypesAction));

     const appTypes = Object.values(appTypesResponseAction.data.appTypes);
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

     // 2. get all EntitySet data models
     const fetchProjectionAction :SequenceAction = fetchEntityDataModelProjection({ projection });
     yield put(fetchProjectionAction);
     const fetchProjectionResponseAction = yield take(matchFetchProjectionResponse(fetchProjectionAction));

     const edm = fetchProjectionResponseAction.data.edm;
     yield put(loadApp.success({ app, appTypes, edm }));
   }
   catch (error) {
     yield put(loadApp.failure({ error }));
   }
   finally {
     yield put(loadApp.finally());
   }
 }

 export function* loadAppWatcher() :Generator<*, *, *> {

   yield takeEvery(LOAD_APP, loadAppWorker);
 }

 export function* loadAppConfigsWorker(action :SequenceAction) :Generator<*, *, *> {

   try {
     yield put(loadConfigurations.request());

     let anyErrors :boolean = false;

     const appId = action.data.appId;

     const fetchAppConfigsAction = fetchAppConfigs({ appId });
     yield put(fetchAppConfigsAction);
     const fetchAppConfigsResponseAction = yield take(matchFetchAppConfigsResponse(fetchAppConfigsAction));
     const configurations = fetchAppConfigsResponseAction.data.configurations;

     yield put(loadConfigurations.success({ configurations }));
   }
   catch (error) {
     yield put(loadConfigurations.failure({ error }));
   }
   finally {
     yield put(loadConfigurations.finally());
   }
 }

 export function* loadAppConfigsWatcher() :Generator<*, *, *> {

   yield takeEvery(LOAD_CONFIGURATIONS, loadAppConfigsWorker);
 }
