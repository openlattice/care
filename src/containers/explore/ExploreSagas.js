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
import { Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  EXPLORE_CONTACT_INFORMATION,
  EXPLORE_FILE,
  EXPLORE_IDENTIFYING_CHARACTERISTICS,
  EXPLORE_INCIDENTS,
  EXPLORE_LOCATION,
  EXPLORE_PEOPLE,
  EXPLORE_PHYSICAL_APPEARANCES,
  GET_INCLUDED_PEOPLE,
  GET_INVOLVED_PEOPLE,
  GET_OBSERVED_IN_PEOPLE,
  exploreContactInformation,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  exploreLocation,
  explorePeople,
  explorePhysicalAppearances,
  getIncludedPeople,
  getInvolvedPeople,
  getObservedInPeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../utils/AppUtils';
import {
  getEKIDsFromNeighborResponseData,
  getEntityKeyId,
  getNeighborDetailsFromNeighborResponseData
} from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const { isValidUUID } = ValidationUtils;

const {
  CONTACTED_VIA_FQN,
  CONTACT_INFORMATION_FQN,
  FILE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  INCIDENT_FQN,
  INCLUDES_FQN,
  INVOLVED_IN_FQN,
  LOCATED_AT_FQN,
  LOCATION_FQN,
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
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
    const peopleByHitEKID = peopleResponseData
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
      peopleByHitEKID,
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
    const incidentEKIDs = hits.map((hit) => hit.getIn([OPENLATTICE_ID_FQN, 0]));

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
    const peopleByHitEKID = peopleResponseData
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
      peopleByHitEKID,
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

export function* getObservedInPeopleWorker(action :SequenceAction) :Saga<Object> {
  const response = {};
  try {
    const {
      entityKeyIds,
      entitySetId,
    } = action.value;
    if (!List.isList(entityKeyIds) || !isValidUUID(entitySetId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getObservedInPeople.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      observedInESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      OBSERVED_IN_FQN,
    ]);

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({
        entitySetId,
        filter: {
          entityKeyIds: entityKeyIds.toJS(),
          edgeEntitySetIds: [observedInESID],
          destinationEntitySetIds: [peopleESID],
          sourceEntitySetIds: [],
        },
      })
    );
    if (peopleResponse.error) throw peopleResponse.error;

    const peopleResponseData = fromJS(peopleResponse.data);
    const peopleByHitEKID = getEKIDsFromNeighborResponseData(peopleResponseData);
    const peopleByEKID = getNeighborDetailsFromNeighborResponseData(peopleResponseData);

    response.data = {
      peopleByHitEKID,
      peopleByEKID,
    };

    yield put(getObservedInPeople.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getObservedInPeople.failure(action.id, error));
  }
  return response;
}

export function* getObservedInPeopleWatcher() :Saga<void> {
  yield takeLatest(GET_OBSERVED_IN_PEOPLE, getObservedInPeople);
}

export function* explorePhysicalAppearancesWorker(action :SequenceAction) :Saga<void> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(explorePhysicalAppearances.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const physicalAppearanceESID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetIds: [physicalAppearanceESID],
        maxHits,
        start,
        constraints: [{
          constraints: [{
            type: 'simple',
            searchTerm,
            fuzzy: false
          }],
        }],
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response?.data?.hits);

    let payload = { hits, totalHits: response?.data?.numHits };
    const physicalAppearanceEKIDs = hits.map((hit) => hit.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!physicalAppearanceEKIDs.isEmpty()) {
      const peopleResponse = yield call(getObservedInPeopleWorker, getObservedInPeople({
        entityKeyIds: physicalAppearanceEKIDs,
        entitySetId: physicalAppearanceESID
      }));
      if (peopleResponse.error) throw peopleResponse.error;
      payload = Object.assign(payload, peopleResponse.data);
    }

    yield put(explorePhysicalAppearances.success(action.id, payload));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(explorePhysicalAppearances.failure(action.id, error));
  }
}

export function* explorePhysicalAppearancesWatcher() :Saga<void> {
  yield takeEvery(EXPLORE_PHYSICAL_APPEARANCES, explorePhysicalAppearancesWorker);
}

export function* exploreIdentifyingCharacteristicsWorker(action :SequenceAction) :Saga<void> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(exploreIdentifyingCharacteristics.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const identifyingCharacteristicsESID = getESIDFromApp(app, IDENTIFYING_CHARACTERISTICS_FQN);

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetIds: [identifyingCharacteristicsESID],
        maxHits,
        start,
        constraints: [{
          constraints: [{
            type: 'simple',
            searchTerm,
            fuzzy: false
          }],
        }],
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response?.data?.hits);
    let payload = { hits, totalHits: response?.data?.numHits };
    const identifyingCharacteristicsEKIDs = hits.map((hit) => hit.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!identifyingCharacteristicsEKIDs.isEmpty()) {
      const peopleResponse = yield call(getObservedInPeopleWorker, getObservedInPeople({
        entityKeyIds: identifyingCharacteristicsEKIDs,
        entitySetId: identifyingCharacteristicsESID
      }));
      if (peopleResponse.error) throw peopleResponse.error;
      payload = Object.assign(payload, peopleResponse.data);
    }

    yield put(exploreIdentifyingCharacteristics.success(action.id, payload));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreIdentifyingCharacteristics.failure(action.id, error));
  }
}

export function* exploreIdentifyingCharacteristicsWatcher() :Saga<void> {
  yield takeEvery(EXPLORE_IDENTIFYING_CHARACTERISTICS, exploreIdentifyingCharacteristicsWorker);
}

export function* exploreContactInformationWorker(action :SequenceAction) :Saga<void> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(exploreContactInformation.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const contactInformationESID = getESIDFromApp(app, CONTACT_INFORMATION_FQN);

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetIds: [contactInformationESID],
        maxHits,
        start,
        constraints: [{
          constraints: [{
            type: 'simple',
            searchTerm,
            fuzzy: false
          }],
        }],
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response?.data?.hits);
    let payload = { hits, totalHits: response?.data?.numHits };
    const contactInformationEKIDs = hits.map((hit) => hit.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!contactInformationEKIDs.isEmpty()) {

      const [
        peopleESID,
        contactedViaESID
      ] = getESIDsFromApp(app, [
        PEOPLE_FQN,
        CONTACTED_VIA_FQN,
      ]);

      const peopleResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({
          entitySetId: contactInformationESID,
          filter: {
            entityKeyIds: contactInformationEKIDs.toJS(),
            edgeEntitySetIds: [contactedViaESID],
            destinationEntitySetIds: [],
            sourceEntitySetIds: [peopleESID],
          },
        })
      );

      if (peopleResponse.error) throw peopleResponse.error;
      const peopleResponseData = fromJS(peopleResponse.data);
      const peopleByHitEKID = getEKIDsFromNeighborResponseData(peopleResponseData);
      const peopleByEKID = getNeighborDetailsFromNeighborResponseData(peopleResponseData);
      payload = Object.assign(payload, {
        peopleByHitEKID,
        peopleByEKID,
      });
    }

    yield put(exploreContactInformation.success(action.id, payload));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreContactInformation.failure(action.id, error));
  }
}

export function* exploreContactInformationWatcher() :Saga<void> {
  yield takeEvery(EXPLORE_CONTACT_INFORMATION, exploreContactInformationWorker);
}

export function* exploreLocationWorker(action :SequenceAction) :Saga<void> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchTerm, start = 0, maxHits = 20 } = value;
    yield put(exploreLocation.request(action.id, value));

    const app = yield select((state) => state.get('app', Map()));

    const locationESID = getESIDFromApp(app, LOCATION_FQN);

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetIds: [locationESID],
        maxHits,
        start,
        constraints: [{
          constraints: [{
            type: 'simple',
            searchTerm,
            fuzzy: false
          }],
        }],
      })
    );

    if (response.error) throw response.error;

    const hits = fromJS(response?.data?.hits);
    let payload = { hits, totalHits: response?.data?.numHits };
    const locationEKIDs = hits.map((hit) => hit.getIn([OPENLATTICE_ID_FQN, 0]));

    if (!locationEKIDs.isEmpty()) {
      const [
        peopleESID,
        locatedAtESID
      ] = getESIDsFromApp(app, [
        PEOPLE_FQN,
        LOCATED_AT_FQN,
      ]);

      const peopleResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({
          entitySetId: locationESID,
          filter: {
            entityKeyIds: locationEKIDs.toJS(),
            edgeEntitySetIds: [locatedAtESID],
            destinationEntitySetIds: [],
            sourceEntitySetIds: [peopleESID],
          },
        })
      );

      if (peopleResponse.error) throw peopleResponse.error;
      const peopleResponseData = fromJS(peopleResponse.data);
      const peopleByHitEKID = getEKIDsFromNeighborResponseData(peopleResponseData);
      const peopleByEKID = getNeighborDetailsFromNeighborResponseData(peopleResponseData);
      payload = Object.assign(payload, {
        peopleByHitEKID,
        peopleByEKID,
      });
    }

    yield put(exploreLocation.success(action.id, payload));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(exploreLocation.failure(action.id, error));
  }
}

export function* exploreLocationWatcher() :Saga<void> {
  yield takeEvery(EXPLORE_LOCATION, exploreLocationWorker);
}
