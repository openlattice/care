/*
 * @flow
 */

import { DataApi, EntityDataModelApi, SyncApi } from 'lattice';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  ACQUIRE_SYNC_TICKET,
  CREATE_ENTITY_AND_ASSOCIATION_DATA,
  FETCH_CURRENT_SYNC_ID,
  FETCH_EDM_PROJECTION,
  FETCH_ENTITY_SET,
  FETCH_ENTITY_SET_ID,
  acquireSyncTicket,
  createEntityAndAssociationData,
  fetchCurrentSyncId,
  fetchEntityDataModelProjection,
  fetchEntitySet,
  fetchEntitySetId
} from './LatticeActionFactory';

import type { SequenceAction } from '../redux/RequestSequence';

/*
 * TODO: how do we define more specific types for these actions?
 * TODO: "import type" for lattice-js
 */

/*
 * DataApi
 */

export function* acquireSyncTicketWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(acquireSyncTicket.request());
    response = yield call(DataApi.acquireSyncTicket, action.data.entitySetId, action.data.syncId);
    yield put(acquireSyncTicket.success({ ticketId: response }));
  }
  catch (error) {
    response = new Error(); // !!! HACK !!! - quick fix
    yield put(acquireSyncTicket.failure({ error }));
  }
  finally {
    yield put(acquireSyncTicket.finally());
  }

  return response;
}

export function* acquireSyncTicketWatcher() :Generator<*, *, *> {

  yield takeEvery(ACQUIRE_SYNC_TICKET, acquireSyncTicketWorker);
}

export function* createEntityAndAssociationDataWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(createEntityAndAssociationData.request());
    response = yield call(DataApi.createEntityAndAssociationData, action.data);
    yield put(createEntityAndAssociationData.success());
  }
  catch (error) {
    response = new Error(); // !!! HACK !!! - quick fix
    yield put(createEntityAndAssociationData.failure({ error }));
  }
  finally {
    yield put(createEntityAndAssociationData.finally());
  }

  return response;
}

export function* createEntityAndAssociationDataWatcher() :Generator<*, *, *> {

  yield takeEvery(CREATE_ENTITY_AND_ASSOCIATION_DATA, createEntityAndAssociationDataWorker);
}

export function* fetchCurrentSyncIdWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchCurrentSyncId.request());
    response = yield call(SyncApi.getCurrentSyncId, action.data.entitySetId);
    yield put(fetchCurrentSyncId.success({ syncId: response }));
  }
  catch (error) {
    response = new Error(); // !!! HACK !!! - quick fix
    yield put(fetchCurrentSyncId.failure({ error, entitySetId: action.data.propertyTypeId }));
  }
  finally {
    yield put(fetchCurrentSyncId.finally());
  }

  return response;
}

export function* fetchCurrentSyncIdWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_CURRENT_SYNC_ID, fetchCurrentSyncIdWorker);
}

/*
 * EntityDataModelApi
 */

export function* fetchEntityDataModelProjectionWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchEntityDataModelProjection.request());
    response = yield call(EntityDataModelApi.getEntityDataModelProjection, action.data.projection);
    yield put(fetchEntityDataModelProjection.success({ edm: response }));
  }
  catch (error) {
    response = new Error(); // !!! HACK !!! - quick fix
    yield put(fetchEntityDataModelProjection.failure({ error, entitySetId: action.data.entitySetId }));
  }
  finally {
    yield put(fetchEntityDataModelProjection.finally());
  }

  return response;
}

export function* fetchEntityDataModelProjectionWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_EDM_PROJECTION, fetchEntityDataModelProjectionWorker);
}

export function* fetchEntitySetWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchEntitySet.request());
    response = yield call(EntityDataModelApi.getEntitySet, action.data.entitySetId);
    yield put(fetchEntitySet.success({ entitySet: response }));
  }
  catch (error) {
    response = new Error();
    yield put(fetchEntitySet.failure({ error, entitySetId: action.data.entitySetId }));
  }
  finally {
    yield put(fetchEntitySet.finally());
  }

  return response;
}

export function* fetchEntitySetWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_ENTITY_SET, fetchEntitySetWorker);
}

export function* fetchEntitySetIdWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchEntitySetId.request());
    response = yield call(EntityDataModelApi.getEntitySetId, action.data.entitySetName);
    yield put(fetchEntitySetId.success({ entitySetId: response }));
  }
  catch (error) {
    response = new Error();
    yield put(fetchEntitySetId.failure({ error, entitySetName: action.data.entitySetName }));
  }
  finally {
    yield put(fetchEntitySetId.finally());
  }

  return response;
}

export function* fetchEntitySetIdWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_ENTITY_SET_ID, fetchEntitySetIdWorker);
}
