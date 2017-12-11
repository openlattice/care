/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { SearchApiActionFactory } from 'lattice-sagas';
import { call, put, take, takeEvery } from 'redux-saga/effects';

import {
  SEARCH_CONSUMERS,
  searchConsumers
} from './SearchActionFactory';

const { searchEntitySetData } = SearchApiActionFactory;

/*
 * helper functions
 */

function matchSearchEntitySetDataResponse(action :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === searchEntitySetData.SUCCESS && anAction.id === action.id)
      || (anAction.type === searchEntitySetData.FAILURE && anAction.id === action.id);
  };
}

/*
 * sagas
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
  searchConsumersWatcher,
  searchConsumersWorker
};
