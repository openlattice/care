// @flow
import axios from 'axios';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import qs from 'query-string';
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn,
} from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_GEO_OPTIONS,
  GET_LB_LOCATIONS_NEIGHBORS,
  GET_LB_STAY_AWAY_PEOPLE,
  SEARCH_LB_LOCATIONS,
  getGeoOptions,
  getLBLocationsNeighbors,
  getLBStayAwayPeople,
  searchLBLocations,
} from './LongBeachLocationsActions';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../../utils/AppUtils';
import { getEKIDsFromEntryValues, mapFirstEntityDataFromNeighbors } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { getLBPeoplePhotos } from '../../people/LongBeachPeopleActions';
import { getLBPeoplePhotosWorker } from '../../people/LongBeachPeopleSagas';

declare var __MAPBOX_TOKEN__;

const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  FILED_FOR_FQN,
  STAY_AWAY_LOCATION_FQN,
  PEOPLE_FQN,
  SERVED_WITH_FQN,
  SERVICES_OF_PROCESS_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('LongBeachLocationsSagas');

const GEOCODING_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

function* getGeoOptionsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getGeoOptions.request(action.id));

    const { address, currentPosition } = action.value;

    const params :Object = {
      access_token: __MAPBOX_TOKEN__,
      autocomplete: true,
    };

    if (currentPosition && currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      params.proximity = `${longitude},${latitude}`;
    }

    const queryString = qs.stringify(params);

    const { data: suggestions } = yield call(axios, {
      method: 'get',
      url: `${GEOCODING_API}/${window.encodeURI(address)}.json?${queryString}`,
    });

    const formattedSuggestions = suggestions.features.map((sugg) => {
      // eslint-disable-next-line camelcase
      const { place_name, geometry } = sugg;
      const { coordinates } = geometry;
      const [lon, lat] = coordinates;
      return {
        ...sugg,
        label: place_name,
        value: `${lat},${lon}`,
        lon,
        lat
      };
    });

    yield put(getGeoOptions.success(action.id, fromJS(formattedSuggestions)));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getGeoOptions.failure(action.id, error));
  }
  finally {
    yield put(getGeoOptions.finally(action.id));
  }
}

function* getGeoOptionsWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_GEO_OPTIONS, getGeoOptionsWorker);
}

function* getLBStayAwayPeopleWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };
  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getLBStayAwayPeople.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      servedWithESID,
      serviceOfProcessESID
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      SERVED_WITH_FQN,
      SERVICES_OF_PROCESS_FQN
    ]);

    const peopleSearchParams = {
      entitySetId: serviceOfProcessESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [servedWithESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      }
    };

    const peopleResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(peopleSearchParams)
    );

    if (peopleResponse.error) throw peopleResponse.error;

    const people = mapFirstEntityDataFromNeighbors(fromJS(peopleResponse.data));
    const peopleEKIDs = getEKIDsFromEntryValues(people).toJS();

    response.data = {
      people
    };

    if (peopleEKIDs.length) {
      const profilePicturesResponse = yield call(
        getLBPeoplePhotosWorker,
        getLBPeoplePhotos(peopleEKIDs)
      );

      if (profilePicturesResponse.error) throw profilePicturesResponse.error;
      const { profilePictures } = profilePicturesResponse.data;

      response.data.profilePictures = profilePictures;
    }

    yield put(getLBStayAwayPeople.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBStayAwayPeople.request(action.id));
  }

  return response;
}

function* getLBStayAwayPeopleWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_LB_STAY_AWAY_PEOPLE, getLBStayAwayPeopleWorker);
}

function* getLBLocationsNeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getLBLocationsNeighbors.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      filedForESID,
      locationESID,
      serviceOfProcessESID
    ] = getESIDsFromApp(app, [
      FILED_FOR_FQN,
      STAY_AWAY_LOCATION_FQN,
      SERVICES_OF_PROCESS_FQN
    ]);

    const stayAwayParams = {
      entitySetId: locationESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [filedForESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [serviceOfProcessESID],
      }
    };

    const stayAwayResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(stayAwayParams)
    );

    if (stayAwayResponse.error) throw stayAwayResponse.error;

    const stayAway = mapFirstEntityDataFromNeighbors(fromJS(stayAwayResponse.data));
    const stayAwayEKIDs = getEKIDsFromEntryValues(stayAway).toJS();

    response.data = {
      stayAway
    };

    if (stayAwayEKIDs.length) {
      const peopleResponse = yield call(
        getLBStayAwayPeopleWorker,
        getLBStayAwayPeople(stayAwayEKIDs)
      );
      if (peopleResponse.error) throw peopleResponse.error;

      response.data = {
        ...response.data,
        ...peopleResponse.data
      };
    }

    yield put(getLBLocationsNeighbors.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBLocationsNeighbors.failure(action.id));
  }

  return response;
}

function* getLBLocationsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_LB_LOCATIONS_NEIGHBORS, getLBLocationsNeighborsWorker);
}

function* searchLBLocationsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {
    data: {}
  };

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    const optionValue :string = searchInputs.getIn(['selectedOption', 'value']);

    yield put(searchLBLocations.request(action.id, searchInputs));

    let latitude :string = searchInputs.getIn(['selectedOption', 'lat']);
    let longitude :string = searchInputs.getIn(['selectedOption', 'lon']);

    if (optionValue === 'Current Location') {
      const getUserLocation = () => new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const location = yield call(getUserLocation);
      if (location.error) throw location.error;

      const { latitude: currentLat, longitude: currentLon } = location.coords;
      latitude = currentLat;
      longitude = currentLon;
    }

    const app = yield select((state) => state.get('app', Map()));
    const locationESID = getESIDFromApp(app, STAY_AWAY_LOCATION_FQN);
    const locationCoordinatesPTID :UUID = yield select((state) => state
      .getIn(['edm', 'fqnToIdMap', FQN.LOCATION_COORDINATES_FQN]));

    const searchConstraints = {
      start,
      entitySetIds: [locationESID],
      maxHits,
      constraints: [{
        constraints: [{
          type: 'geoDistance',
          latitude,
          longitude,
          propertyTypeId: locationCoordinatesPTID,
          radius: 400,
          unit: 'yd'
        }]
      }],
    };

    const searchResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (searchResponse.error) throw searchResponse.error;

    const { hits, numHits } = searchResponse.data;
    const locationsEKIDs = hits.map((location) => getIn(location, [FQN.OPENLATTICE_ID_FQN, 0]));
    const locationsByEKID = Map(hits.map((entity) => [getIn(entity, [FQN.OPENLATTICE_ID_FQN, 0]), fromJS(entity)]));
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.stayAwayLocations = locationsByEKID;

    if (locationsEKIDs.length) {
      const neighborsResponse = yield call(
        getLBLocationsNeighborsWorker,
        getLBLocationsNeighbors(locationsEKIDs)
      );

      if (neighborsResponse.error) throw neighborsResponse.error;
      response.data = {
        ...response.data,
        ...neighborsResponse.data
      };
    }

    yield put(searchLBLocations.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchLBLocations.failure(action.id));
  }

  return response;
}

function* searchLBLocationsWatcher() :Generator<any, any, any> {
  yield takeEvery(SEARCH_LB_LOCATIONS, searchLBLocationsWorker);
}

export {
  getGeoOptionsWatcher,
  getGeoOptionsWorker,
  getLBLocationsNeighborsWatcher,
  getLBLocationsNeighborsWorker,
  getLBStayAwayPeopleWatcher,
  getLBStayAwayPeopleWorker,
  searchLBLocationsWatcher,
  searchLBLocationsWorker,
};
