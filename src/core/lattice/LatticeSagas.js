/*
 * @flow
 */

import { EntityDataModelApi } from 'lattice';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import {
  FETCH_EDM_PROJECTION,
  FETCH_ENTITY_SET,
  FETCH_ENTITY_SET_ID,
  FETCH_ENTITY_TYPE,
  FETCH_PROPERTY_TYPE,
  FETCH_PROPERTY_TYPES,
  fetchEntityDataModelProjection,
  fetchEntitySet,
  fetchEntitySetId,
  fetchEntityType,
  fetchPropertyType,
  fetchPropertyTypes
} from './LatticeActionFactory';

import type { SequenceAction } from '../redux/RequestSequence';

/*
 * TODO: how do we define more specific types for these actions?
 * TODO: "import type" for lattice-js
 */

export function* fetchEntityDataModelProjectionWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchEntityDataModelProjection.request());
    response = yield call(EntityDataModelApi.getEntityDataModelProjection, action.data.projection);
    yield put(fetchEntityDataModelProjection.success({ edm: response }));
  }
  catch (error) {
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

export function* fetchEntityTypeWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchEntityType.request());
    response = yield call(EntityDataModelApi.getEntityType, action.data.entityTypeId);
    yield put(fetchEntityType.success({ entityType: response }));
  }
  catch (error) {
    yield put(fetchEntityType.failure({ error, entityTypeId: action.data.entityTypeId }));
  }
  finally {
    yield put(fetchEntityType.finally());
  }

  return response;
}

export function* fetchEntityTypeWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_ENTITY_TYPE, fetchEntityTypeWorker);
}

export function* fetchPropertyTypeWorker(action :SequenceAction) :Generator<*, *, *> {

  let response :Object = {};

  try {
    yield put(fetchPropertyType.request());
    response = yield call(EntityDataModelApi.getPropertyType, action.data.propertyTypeId);
    yield put(fetchPropertyType.success({ propertyType: response }));
  }
  catch (error) {
    yield put(fetchPropertyType.failure({ error, propertyTypeId: action.data.propertyTypeId }));
  }
  finally {
    yield put(fetchPropertyType.finally());
  }

  return response;
}

export function* fetchPropertyTypeWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_PROPERTY_TYPE, fetchPropertyTypeWorker);
}

export function* fetchPropertyTypesWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(fetchPropertyTypes.request());
    const propertyTypeIds :string[] = action.data.propertyTypeIds;
    const response = yield all(
      propertyTypeIds.reduce((calls :Object, propertyTypeId :string) => {
        // TODO: is Object.assign() the right thing to use?
        return Object.assign(calls, {
          [propertyTypeId]: call(fetchPropertyTypeWorker, fetchPropertyType({ propertyTypeId }))
        });
      }, {})
    );
    yield put(fetchPropertyTypes.success({ propertyTypes: response }));
  }
  catch (error) {
    yield put(fetchPropertyTypes.failure({ error, propertyTypeId: action.data.propertyTypeId }));
  }
  finally {
    yield put(fetchPropertyTypes.finally());
  }
}

export function* fetchPropertyTypesWatcher() :Generator<*, *, *> {

  yield takeEvery(FETCH_PROPERTY_TYPES, fetchPropertyTypesWorker);
}
