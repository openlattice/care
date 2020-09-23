/*
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  EXPLORE_FILE,
  EXPLORE_INCIDENTS,
  EXPLORE_PEOPLE,
  GET_INCLUDED_PEOPLE,
  GET_INVOLVED_PEOPLE,
  exploreFile,
  exploreIncidents,
  explorePeople,
  getIncludedPeople,
  getInvolvedPeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../utils/AppUtils';
import { getEntityKeyId } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const {
  FILE_FQN,
  INCIDENT_FQN,
  INCLUDES_FQN,
  INVOLVED_IN_FQN,
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

    const fileEKIDs = hits.map((file) => file.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!fileEKIDs.isEmpty()) {
      yield put(getIncludedPeople(fileEKIDs));
    }
    yield put(exploreFile.success(action.id, { hits, totalHits: response.data.numHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreFile.failure(action.id, error));
  }
}

export function* exploreFileWatcher() :Generator<*, *, *> {
  yield takeEvery(EXPLORE_FILE, exploreFileWorker);
}

export function* getIncludedPeopleWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const entityKeyIds = action.value;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getIncludedPeople.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const fileESID :UUID = getESIDFromApp(app, FILE_FQN);
    const includesESID :UUID = getESIDFromApp(app, INCLUDES_FQN);

    const peopleSearchParams = {
      entitySetId: fileESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [includesESID],
        destinationEntitySetIds: [peopleESID],
        sourceEntitySetIds: []
      }
    };

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParams)
    );
    if (peopleResponse.error) throw peopleResponse.error;

    const peopleResponseData = fromJS(peopleResponse.data);
    const peopleByFileEKID = peopleResponseData
      .map((neighbors) => neighbors.map((neighbor) => getEntityKeyId(neighbor.get('neighborDetails'))));

    const peopleByEKID = Map().withMutations((mutable) => {
      peopleResponseData.forEach((neighbors) => {
        neighbors.forEach((neighbor) => {
          const details = neighbor.get('neighborDetails');
          const entityKeyId = getEntityKeyId(details);
          mutable.set(entityKeyId, details);
        });
      });
    });

    response.data = {
      peopleByFileEKID,
      peopleByEKID,
    };

    yield put(getIncludedPeople.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getIncludedPeople.failure(action.id, error));
  }
  return response;
}

export function* getIncludedPeopleWatcher() :Saga<void> {
  yield takeLatest(GET_INCLUDED_PEOPLE, getIncludedPeopleWorker);
}

export function* exploreIncidentsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(exploreIncidents.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const incidentESID = getESIDFromApp(app, INCIDENT_FQN);

    const constraints = [{
      constraints: [{
        type: 'simple',
        searchTerm,
        fuzzy: false
      }],
    }];

    const searchConstraints = {
      entitySetIds: [incidentESID],
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
    const incidentEKIDs = hits.map((file) => file.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!incidentEKIDs.isEmpty()) {
      yield put(getInvolvedPeople(incidentEKIDs));
    }
    yield put(exploreIncidents.success(action.id, { hits, totalHits: response.data.numHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreIncidents.failure(action.id, error));
  }
}

export function* exploreIncidentsWatcher() :Generator<*, *, *> {
  yield takeEvery(EXPLORE_INCIDENTS, exploreIncidentsWorker);
}

export function* getInvolvedPeopleWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const entityKeyIds = action.value;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getInvolvedPeople.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      incidentESID,
      involvedInESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      INCIDENT_FQN,
      INVOLVED_IN_FQN,
    ]);

    const peopleSearchParam = {
      entitySetId: incidentESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [involvedInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      },
    };

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParam)
    );
    if (peopleResponse.error) throw peopleResponse.error;

    const peopleResponseData = fromJS(peopleResponse.data);
    const peopleByIncidentEKID = peopleResponseData
      .map((neighbors) => neighbors.map((neighbor) => getEntityKeyId(neighbor.get('neighborDetails'))));

    const peopleByEKID = Map().withMutations((mutable) => {
      peopleResponseData.forEach((neighbors) => {
        neighbors.forEach((neighbor) => {
          const details = neighbor.get('neighborDetails');
          const entityKeyId = getEntityKeyId(details);
          mutable.set(entityKeyId, details);
        });
      });
    });

    response.data = {
      peopleByIncidentEKID,
      peopleByEKID,
    };

    yield put(getInvolvedPeople.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getInvolvedPeople.failure(action.id, error));
  }
  return response;
}

export function* getInvolvedPeopleWatcher() :Saga<void> {
  yield takeLatest(GET_INVOLVED_PEOPLE, getInvolvedPeopleWorker);
}
