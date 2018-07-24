/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { SearchApiActionFactory, SearchApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  SEARCH_CONSUMER_NEIGHBORS,
  SEARCH_CONSUMERS,
  searchConsumerNeighbors,
  searchConsumers
} from './SearchActionFactory';

const {
  searchEntityNeighbors,
  searchEntitySetData,
} = SearchApiActionFactory;

const {
  searchEntityNeighborsWorker,
  searchEntitySetDataWorker,
} = SearchApiSagas;

/*
 * searchConsumerNeighbors sagas
 */

function* searchConsumerNeighborsWatcher() :Generator<*, *, *> {

  yield takeEvery(SEARCH_CONSUMER_NEIGHBORS, searchConsumerNeighborsWorker);
}

function* searchConsumerNeighborsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(searchConsumerNeighbors.request(action.id, action.value));

    const response :Response = yield call(
      searchEntityNeighborsWorker,
      searchEntityNeighbors({
        entitySetId: action.value.entitySetId,
        entityId: action.value.entityId,
      })
    );

    if (response.error) {
      yield put(searchConsumerNeighbors.failure(action.id, response.error));
    }
    yield put(searchConsumerNeighbors.success(action.id, response.data));
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

    const response :Response = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId: action.value.entitySetId,
        searchOptions: {
          searchTerm: action.value.query,
          start: 0,
          maxHits: 100
        },
      })
    );

    if (response.error) {
      yield put(searchConsumers.failure(action.id, response.error));
    }
    yield put(searchConsumers.success(action.id, response.data));
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
