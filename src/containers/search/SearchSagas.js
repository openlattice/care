/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { SearchApiActionFactory } from 'lattice-sagas';
import { call, put, take, takeEvery } from 'redux-saga/effects';

import {
  SEARCH_CONSUMER_NEIGHBORS,
  SEARCH_CONSUMERS,
  searchConsumerNeighbors,
  searchConsumers
} from './SearchActionFactory';

const {
  searchEntityNeighbors,
  searchEntitySetData
} = SearchApiActionFactory;

/*
 * helper functions
 */

function matchSearchEntityNeighborsResponse(action :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === searchEntityNeighbors.SUCCESS && anAction.id === action.id)
      || (anAction.type === searchEntityNeighbors.FAILURE && anAction.id === action.id);
  };
}

function matchSearchEntitySetDataResponse(action :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === searchEntitySetData.SUCCESS && anAction.id === action.id)
      || (anAction.type === searchEntitySetData.FAILURE && anAction.id === action.id);
  };
}

/*
 * searchConsumerNeighbors sagas
 */

function* searchConsumerNeighborsWatcher() :Generator<*, *, *> {

  yield takeEvery(SEARCH_CONSUMER_NEIGHBORS, searchConsumerNeighborsWorker);
}

function* searchConsumerNeighborsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(searchConsumerNeighbors.request(action.id, action.value));

    const searchEntityNeighborsAction :SequenceAction = searchEntityNeighbors({
      entitySetId: action.value.entitySetId,
      entityId: action.value.entityId
    });

    yield put(searchEntityNeighborsAction);

    const searchEntityNeighborsResponseAction = yield take(
      matchSearchEntityNeighborsResponse(searchEntityNeighborsAction)
    );

    if (searchEntityNeighborsResponseAction.type === searchEntityNeighbors.SUCCESS) {
      yield put(searchConsumerNeighbors.success(action.id, searchEntityNeighborsResponseAction.value));
    }
    else {
      yield put(searchConsumerNeighbors.failure(action.id, searchEntityNeighborsResponseAction.value));
    }
  }
  catch (error) {
    yield put(searchConsumerNeighbors.failure(action.id, error));
  }
  finally {
    yield put(searchConsumerNeighbors.finally(action.id));
  }
}

/*
 * searchConsumers sagas
 */

function* searchConsumersWatcher() :Generator<*, *, *> {

  yield takeEvery(SEARCH_CONSUMERS, searchConsumersWorker);
}

function* searchConsumersWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(searchConsumers.request(action.id, action.value));

    // TODO: need paging
    const searchEntitySetDataAction :SequenceAction = searchEntitySetData({
      entitySetId: action.value.entitySetId,
      searchOptions: {
        searchTerm: action.value.query,
        start: 0,
        maxHits: 100
      }
    });
    yield put(searchEntitySetDataAction);

    const searchEntitySetDataResponseAction = yield take(matchSearchEntitySetDataResponse(searchEntitySetDataAction));
    if (searchEntitySetDataResponseAction.type === searchEntitySetData.SUCCESS) {
      yield put(searchConsumers.success(action.id, searchEntitySetDataResponseAction.value));
    }
    else {
      yield put(searchConsumers.failure(action.id, searchEntitySetDataResponseAction.value));
    }
  }
  catch (error) {
    yield put(searchConsumers.failure(action.id, error));
  }
  finally {
    yield put(searchConsumers.finally(action.id));
  }
}

export {
  searchConsumerNeighborsWatcher,
  searchConsumerNeighborsWorker,
  searchConsumersWatcher,
  searchConsumersWorker
};
