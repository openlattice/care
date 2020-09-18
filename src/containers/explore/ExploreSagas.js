/*
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  EXPLORE_FILE,
  EXPLORE_PEOPLE,
  exploreFile,
  explorePeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp } from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const {
  FILE_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('ExploreSagas');

export function* explorePeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(explorePeople.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);

    const constraints = [{
      constraints: [{
        type: 'simple',
        searchTerm,
        fuzzy: false
      }],
    }];

    const searchConstraints = {
      entitySetIds: [peopleESID],
      maxHits,
      start,
      constraints,
    };

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (response.error) throw response.error;

    const hits = fromJS(response.data.hits);

    const peopleEKIDs = hits.map((person) => person.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(explorePeople.success(action.id, { hits, totalHits: response.data.numHits }));
    if (!peopleEKIDs.isEmpty()) {
      yield put(getPeoplePhotos(peopleEKIDs));
      yield put(getRecentIncidents(peopleEKIDs));
    }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(explorePeople.failure(action.id, error));
  }
}

export function* explorePeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(EXPLORE_PEOPLE, explorePeopleWorker);
}

export function* exploreFileWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(exploreFile.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const fileESID = getESIDFromApp(app, FILE_FQN);

    const constraints = [{
      constraints: [{
        type: 'simple',
        searchTerm,
        fuzzy: false
      }],
    }];

    const searchConstraints = {
      entitySetIds: [fileESID],
      maxHits,
      start,
      constraints,
    };

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (response.error) throw response.error;

    const hits = fromJS(response.data.hits);

    // const fileEKIDs = hits.map((file) => file.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(exploreFile.success(action.id, { hits, totalHits: response.data.numHits }));
    // if (!fileEKIDs.isEmpty()) {
    //   yield put(getPeoplePhotos(fileEKIDs));
    //   yield put(getRecentIncidents(fileEKIDs));
    // }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreFile.failure(action.id, error));
  }
}

export function* exploreFileWatcher() :Generator<*, *, *> {
  yield takeEvery(EXPLORE_FILE, exploreFileWorker);
}
