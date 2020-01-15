/*
 * @flow
 */

import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_LB_PEOPLE_PHOTOS,
  GET_LB_PEOPLE_STAY_AWAY,
  GET_LB_STAY_AWAY_LOCATIONS,
  SEARCH_LB_PEOPLE,
  getLBPeoplePhotos,
  getLBPeopleStayAway,
  getLBStayAwayLocations,
  searchLBPeople,
} from './LongBeachPeopleActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const {
  FILED_FOR_FQN,
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  LOCATION_FQN,
  PEOPLE_FQN,
  SERVED_WITH_FQN,
  SERVICE_OF_PROCESS_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const LOG = new Logger('PeopleSagas');

export function* getLBPeoplePhotosWorker(action :SequenceAction) :Generator<*, *, *> {
  const response :Object = {};
  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getLBPeoplePhotos.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const imageESID :UUID = getESIDFromApp(app, IMAGE_FQN);
    const isPictureOfESID :UUID = getESIDFromApp(app, IS_PICTURE_OF_FQN);

    const imageSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [isPictureOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [imageESID]
      }
    };

    const imageResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(imageSearchParams)
    );

    const profilePictures = fromJS(imageResponse.data)
      .map((entity) => entity.first().get('neighborDetails'));

    response.data = {
      profilePictures
    };

    yield put(getLBPeoplePhotos.success(action.id, profilePictures));
  }
  catch (error) {
    response.error = error;
    yield put(getLBPeoplePhotos.failure(action.id, error));
  }

  return response;
}

export function* getLBPeoplePhotosWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_LB_PEOPLE_PHOTOS, getLBPeoplePhotosWorker);
}

export function* getLBStayAwayLocationsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getLBStayAwayLocations.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      filedForESID,
      locationESID,
      serviceOfProcessESID
    ] = getESIDsFromApp(app, [
      FILED_FOR_FQN,
      LOCATION_FQN,
      SERVICE_OF_PROCESS_FQN
    ]);

    const locationSearchParams = {
      entitySetId: serviceOfProcessESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [filedForESID],
        destinationEntitySetIds: [locationESID],
        sourceEntitySetIds: [],
      }
    };

    const locationResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(locationSearchParams)
    );

    if (locationResponse.error) throw locationResponse.error;

    const locationData = fromJS(locationResponse.data)
      .map((entityNeighbors) => {
        const stayAwayOrder = entityNeighbors
          .map((neighbor) => neighbor.get('neighborDetails'))
          .first();
        return stayAwayOrder;
      });

    response.data = locationData;

    yield put(getLBStayAwayLocations.success(action.id, locationData));
  }
  catch (error) {
    response.error = error;
    yield put(getLBStayAwayLocations.failure(action.id, error));
  }

  return response;
}

export function* getLBStayAwayLocationsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_LB_STAY_AWAY_LOCATIONS, getLBStayAwayLocationsWorker);
}

export function* getLBPeopleStayAwayWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getLBPeopleStayAway.request(action.id, entityKeyIds));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      servedWithESID,
      serviceOfProcessESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      SERVED_WITH_FQN,
      SERVICE_OF_PROCESS_FQN
    ]);

    const stayAwaySearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [servedWithESID],
        destinationEntitySetIds: [serviceOfProcessESID],
        sourceEntitySetIds: [],
      }
    };

    const stayAwayResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(stayAwaySearchParams)
    );

    if (stayAwayResponse.error) throw stayAwayResponse.error;
    const stayAwayEKIDs = [];
    const stayAway = fromJS(stayAwayResponse.data)
      .map((entityNeighbors) => {
        const stayAwayOrder = entityNeighbors
          .map((neighbor) => neighbor.get('neighborDetails'))
          .first();
        stayAwayEKIDs.push(stayAwayOrder.getIn([OPENLATTICE_ID_FQN, 0]));
        return stayAwayOrder;
      });

    response.data = {
      stayAway
    };

    if (stayAwayEKIDs.length) {
      const { data, error } = yield call(
        getLBStayAwayLocationsWorker,
        getLBStayAwayLocations(stayAwayEKIDs)
      );

      if (error) throw error;
      response.data.stayAwayLocations = data;
    }

    yield put(getLBPeopleStayAway.success(action.id, response.data));
  }
  catch (error) {
    response.error = error;
    yield put(getLBPeopleStayAway.failure(action.id, error));
  }

  return response;
}

export function* getLBPeopleStayAwayWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_LB_PEOPLE_STAY_AWAY, getLBPeopleStayAwayWorker);
}

export function* searchLBPeopleWorker(action :SequenceAction) :Generator<*, *, *> {
  const response :Object = {
    data: {}
  };

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    yield put(searchLBPeople.request(action.id, { searchInputs }));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string) => {
      searchFields.push({
        searchTerm,
        property,
        exact: true
      });
    };

    const firstName :string = searchInputs.get('firstName', '').trim();
    const lastName :string = searchInputs.get('lastName', '').trim();
    const dob :string = searchInputs.get('dob');

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID);
    }
    const dobDT = DateTime.fromISO(dob);
    if (dobDT.isValid) {
      updateSearchField(dobDT.toISODate(), dobPTID);
    }

    const searchOptions = {
      searchFields,
      start,
      maxHits
    };

    const entitySetId = getESIDFromApp(app, PEOPLE_FQN);

    const { data, error } = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId,
        searchOptions
      })
    );

    if (error) throw error;

    const { hits, numHits } = data;
    response.data.hits = fromJS(hits);
    response.data.totalHits = numHits;

    const peopleEKIDs = hits.map((person) => getIn(person, [OPENLATTICE_ID_FQN, 0]));

    if (peopleEKIDs.length) {
      const profilePicturesRequest = call(
        getLBPeoplePhotosWorker,
        getLBPeoplePhotos(peopleEKIDs)
      );
      const stayAwayRequest = call(
        getLBPeopleStayAwayWorker,
        getLBPeopleStayAway(peopleEKIDs)
      );

      const neighborsResponse = yield all([
        profilePicturesRequest,
        stayAwayRequest
      ]);

      const neighborsError = neighborsResponse.reduce((acc, neighborResponse) => {
        if (neighborResponse.error) {
          acc.push(neighborResponse.error);
        }
        return acc;
      }, []);

      if (neighborsError.length) throw neighborsError;

      const [profilePicturesResponse, stayAwayResponse] = neighborsResponse;

      response.data = {
        ...response.data,
        ...stayAwayResponse.data,
        ...profilePicturesResponse.data
      };
    }

    yield put(searchLBPeople.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchLBPeople.failure(action.id, error));
  }

  return response;
}

export function* searchLBPeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(SEARCH_LB_PEOPLE, searchLBPeopleWorker);
}
