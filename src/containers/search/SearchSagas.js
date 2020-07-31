/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  SEARCH_CONSUMERS,
  searchConsumers,
} from './SearchActionFactory';

const {
  searchEntitySetData,
} = SearchApiActions;

const {
  searchEntitySetDataWorker,
} = SearchApiSagas;

const LOG = new Logger('SearchSagas');

/*
 * searchConsumers sagas
 */

function* searchConsumersWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(searchConsumers.request(action.id, action.value));

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId: action.value.entitySetId,
        searchOptions: {
          searchTerm: action.value.query,
          start: 0,
          maxHits: 10000,
        },
      })
    );

    if (response.error) {
      yield put(searchConsumers.failure(action.id, response.error));
    }
    else {
      yield put(searchConsumers.success(action.id, response.data));
    }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchConsumers.failure(action.id, error));
  }
  finally {
    yield put(searchConsumers.finally(action.id));
  }
}

function* searchConsumersWatcher() :Saga<*> {

  yield takeEvery(SEARCH_CONSUMERS, searchConsumersWorker);
}

export {
  searchConsumersWatcher,
  searchConsumersWorker,
};
