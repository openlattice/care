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
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  getIn
} from 'immutable';
import { Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  ADD_PERSON_TO_ENCAMPMENT,
  GET_ENCAMPMENT_LOCATIONS_NEIGHBORS,
  GET_ENCAMPMENT_OCCUPANTS,
  GET_ENCAMPMENT_PEOPLE_OPTIONS,
  GET_GEO_OPTIONS,
  REMOVE_PERSON_FROM_ENCAMPMENT,
  SEARCH_ENCAMPMENT_LOCATIONS,
  SUBMIT_ENCAMPMENT,
  addPersonToEncampment,
  getEncampmentLocationsNeighbors,
  getEncampmentOccupants,
  getEncampmentPeopleOptions,
  getGeoOptions,
  removePersonFromEncampment,
  searchEncampmentLocations,
  submitEncampment,
} from './EncampmentActions';

import * as FQN from '../../../edm/DataModelFqns';
import { submitDataGraph } from '../../../core/sagas/data/DataActions';
import { submitDataGraphWorker } from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../../utils/AppUtils';
import { getEntityKeyId, indexSubmittedDataGraph, mapFirstEntityDataFromNeighbors } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';

const { isDefined } = LangUtils;
const { isValidUUID } = ValidationUtils;

const {
  createAssociations,
  deleteEntityData,
} = DataApiActions;
const {
  createAssociationsWorker,
  deleteEntityDataWorker,
} = DataApiSagas;

declare var __MAPBOX_TOKEN__;

const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const { DeleteTypes } = Types;

const {
  ENCAMPMENT_FQN,
  ENCAMPMENT_LOCATION_FQN,
  LIVES_AT_FQN,
  LOCATED_AT_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('EncampmentsSagas');

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

function* getEncampmentLocationsNeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getEncampmentLocationsNeighbors.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      encampmentsESID,
      locatedAtESID,
      encampmentLocationsESID,
    ] = getESIDsFromApp(app, [
      ENCAMPMENT_FQN,
      LOCATED_AT_FQN,
      ENCAMPMENT_LOCATION_FQN,
    ]);

    const encampmentsParams = {
      entitySetId: encampmentLocationsESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [locatedAtESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [encampmentsESID],
      }
    };

    const encampmentsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(encampmentsParams)
    );

    if (encampmentsResponse.error) throw encampmentsResponse.error;

    const encampments = mapFirstEntityDataFromNeighbors(fromJS(encampmentsResponse.data));

    response.data = {
      encampments
    };

    yield put(getEncampmentLocationsNeighbors.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.id, error);
    response.error = error;
    yield put(getEncampmentLocationsNeighbors.failure(action.id));
  }
  finally {
    yield put(getEncampmentLocationsNeighbors.finally(action.id));
  }

  return response;
}

function* getEncampmentLocationsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_ENCAMPMENT_LOCATIONS_NEIGHBORS, getEncampmentLocationsNeighborsWorker);
}

function* searchEncampmentLocationsWorker(action :SequenceAction) :Generator<any, any, any> {

  let response;

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    const optionValue :string = searchInputs.getIn(['selectedOption', 'value']);

    yield put(searchEncampmentLocations.request(action.id, searchInputs));

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
    const encampmentLocationESID = getESIDFromApp(app, ENCAMPMENT_LOCATION_FQN);
    const locationCoordinatesPTID :UUID = yield select((state) => state
      .getIn(['edm', 'fqnToIdMap', FQN.LOCATION_COORDINATES_FQN]));

    const searchConstraints = {
      start,
      entitySetIds: [encampmentLocationESID],
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
      }]
    };

    const searchResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );

    if (searchResponse.error) throw searchResponse.error;

    const { hits, numHits } = searchResponse.data;
    const locationsEKIDs = hits.map((location) => getIn(location, [FQN.OPENLATTICE_ID_FQN, 0]));
    const locationsByEKID = Map(hits.map((entity) => [getIn(entity, [FQN.OPENLATTICE_ID_FQN, 0]), fromJS(entity)]));

    response = { data: {} };
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.encampmentLocations = locationsByEKID;

    if (locationsEKIDs.length) {
      const neighborsResponse = yield call(
        getEncampmentLocationsNeighborsWorker,
        getEncampmentLocationsNeighbors(locationsEKIDs)
      );

      if (neighborsResponse.error) throw neighborsResponse.error;
      response.data = {
        ...response.data,
        ...neighborsResponse.data
      };
    }

    yield put(searchEncampmentLocations.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.id, error);
    response = { error };
    yield put(searchEncampmentLocations.failure(action.id));
  }
  finally {
    yield put(searchEncampmentLocations.finally(action.id));
  }

  return response;
}

function* searchEncampmentLocationsWatcher() :Generator<any, any, any> {
  yield takeEvery(SEARCH_ENCAMPMENT_LOCATIONS, searchEncampmentLocationsWorker);
}

function* submitEncampmentWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_TYPE;
    yield put(submitEncampment.request(action.id));

    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const app :Map = yield select((state) => state.get('app', Map()));
    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const [encampmentsESID, encampmentsLocationESID] = getESIDsFromApp(app, [
      ENCAMPMENT_FQN,
      ENCAMPMENT_LOCATION_FQN
    ]);

    const indexedDataGraph = indexSubmittedDataGraph(value, response, propertyTypesById);
    const encampment = getIn(indexedDataGraph, ['entities', encampmentsESID, 0]);
    const encampmentLocation = getIn(indexedDataGraph, ['entities', encampmentsLocationESID, 0]);
    const encampmentLocationEKID = getEntityKeyId(encampmentLocation);

    const encampments = Map([
      [encampmentLocationEKID, fromJS(encampment)]
    ]);

    const encampmentLocations = Map([
      [encampmentLocationEKID, fromJS(encampmentLocation)]
    ]);

    const result = Map({
      hits: List([encampmentLocationEKID]),
      encampments,
      encampmentLocations
    });
    yield put(submitEncampment.success(action.id, result));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitEncampment.failure(action.id));
  }
  finally {
    yield put(submitEncampment.finally(action.id));
  }
}

function* submitEncampmentWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ENCAMPMENT, submitEncampmentWorker);
}

function* getEncampmentPeopleOptionsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};

  try {
    yield put(getEncampmentPeopleOptions.request(action.id));

    const { value = '' } = action;
    const [first = '', last = ''] = value.split(' ');

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string, metaphone :boolean = false) => {
      searchFields.push({
        searchTerm: metaphone ? searchTerm : `${searchTerm}*`,
        property,
        exact: true
      });
    };

    const firstName :string = first.trim();
    const lastName :string = last.trim();

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID, false);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID, false);
    }

    const searchConstraints = {
      entitySetIds: [peopleESID],
      maxHits: 10000,
      start: 0,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields,
        }]
      }],
    };

    const searchResponse :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints)
    );
    if (searchResponse.error) throw searchResponse.error;

    const options = searchResponse.data.hits.map((person) => {
      const personEKID = getEntityKeyId(person);
      const fName = getIn(person, [FQN.PERSON_FIRST_NAME_FQN, 0]);
      const lName = getIn(person, [FQN.PERSON_LAST_NAME_FQN, 0]);
      return {
        label: `${fName} ${lName}`,
        value: personEKID,
        person
      };
    });

    const result = fromJS(options);

    response.data = result;
    yield put(getEncampmentPeopleOptions.success(action.id, result));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getEncampmentPeopleOptions.failure(action.id, error));
  }
  finally {
    yield put(getEncampmentPeopleOptions.finally(action.id));
  }

  return response;
}

function* getEncampmentPeopleOptionsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ENCAMPMENT_PEOPLE_OPTIONS, getEncampmentPeopleOptionsWorker);
}

function* addPersonToEncampmentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(addPersonToEncampment.request(action.id));
    const { person, encampment } = action.value;

    const personEKID = getEntityKeyId(person);

    const app :Map = yield select((state) => state.get('app', Map()));
    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const datetimePTID :UUID = edm.getIn(['fqnToIdMap', FQN.COMPLETED_DT_FQN]);
    const [
      peopleESID,
      livesAtESID,
      encampmentESID,
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      LIVES_AT_FQN,
      ENCAMPMENT_FQN,
    ]);

    const associations = {
      [livesAtESID]: [{
        dst: {
          entityKeyId: encampment,
          entitySetId: encampmentESID,
        },
        src: {
          entityKeyId: personEKID,
          entitySetId: peopleESID,
        },
        data: {
          [datetimePTID]: [DateTime.local().toISO()]
        }
      }]
    };

    const livesAtRequest = yield call(
      createAssociationsWorker,
      createAssociations(associations)
    );

    if (livesAtRequest.error) throw livesAtRequest.error;

    const { data } = livesAtRequest;
    const livesAtEKID = getIn(data, [livesAtESID, 0]);

    const result = fromJS({
      livesAt: [livesAtEKID],
      people: {
        [livesAtEKID]: person
      }
    });

    yield put(addPersonToEncampment.success(action.id, result));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(addPersonToEncampment.failure(action.id, error));
  }
  finally {
    yield put(addPersonToEncampment.finally(action.id));
  }
  return response;
}

function* addPersonToEncampmentWatcher() :Generator<any, any, any> {
  yield takeEvery(ADD_PERSON_TO_ENCAMPMENT, addPersonToEncampmentWorker);
}

function* getEncampmentOccupantsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: encampmentEKID } = action;
    if (!isValidUUID(encampmentEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getEncampmentOccupants.request(action.id));
    // get people that liveat encampment
    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      peopleESID,
      livesAtESID,
      encampmentESID,
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      LIVES_AT_FQN,
      ENCAMPMENT_FQN,
    ]);

    const occupantsParams = {
      entitySetId: encampmentESID,
      filter: {
        entityKeyIds: [encampmentEKID],
        edgeEntitySetIds: [livesAtESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [peopleESID],
      }
    };

    const occupantsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(occupantsParams)
    );

    if (occupantsResponse.error) throw occupantsResponse.error;

    const occupantsData = fromJS(occupantsResponse.data)
      .get(encampmentEKID);

    const livesAt = occupantsData.map((neighbor) => neighbor.getIn(['associationDetails', FQN.OPENLATTICE_ID_FQN, 0]));

    const people = Map().withMutations((mutable) => {
      occupantsData.forEach((neighbor) => {
        const livesAtEKID = neighbor.getIn(['associationDetails', FQN.OPENLATTICE_ID_FQN, 0]);
        const details = neighbor.get('neighborDetails');
        mutable.set(livesAtEKID, details);
      });
    });

    yield put(getEncampmentOccupants.success(action.id, Map({
      livesAt,
      people
    })));
  }
  catch (error) {
    LOG.error(action.id, error);
    response.error = error;
    yield put(getEncampmentOccupants.failure(action.id, error));
  }
  finally {
    yield put(getEncampmentOccupants.finally(action.id));
  }
  return response;
}

function* getEncampmentOccupantsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ENCAMPMENT_OCCUPANTS, getEncampmentOccupantsWorker);
}

function* removePersonFromEncampmentWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: livesAtEKID } = action;
    yield put(removePersonFromEncampment.request(action.id, livesAtEKID));

    const app :Map = yield select((state) => state.get('app', Map()));
    const livesAtESID = getESIDFromApp(app, LIVES_AT_FQN);

    const deleteResponse = yield call(
      deleteEntityDataWorker,
      deleteEntityData({
        entityKeyIds: [livesAtEKID],
        entitySetId: livesAtESID,
        deleteType: DeleteTypes.SOFT
      })
    );

    if (deleteResponse.error) throw deleteResponse.error;

    yield put(removePersonFromEncampment.success(action.id));
  }
  catch (error) {
    LOG.error(action.id, error);
    response.error = error;
    yield put(removePersonFromEncampment.failure(action.id, error));
  }
  finally {
    yield put(removePersonFromEncampment.finally(action.id));
  }
  return response;
}

function* removePersonFromEncampmentWatcher() :Generator<any, any, any> {
  yield takeEvery(REMOVE_PERSON_FROM_ENCAMPMENT, removePersonFromEncampmentWorker);
}

export {
  addPersonToEncampmentWorker,
  addPersonToEncampmentWatcher,
  getEncampmentLocationsNeighborsWatcher,
  getEncampmentLocationsNeighborsWorker,
  getEncampmentPeopleOptionsWatcher,
  getEncampmentPeopleOptionsWorker,
  getGeoOptionsWatcher,
  getGeoOptionsWorker,
  searchEncampmentLocationsWatcher,
  searchEncampmentLocationsWorker,
  submitEncampmentWatcher,
  submitEncampmentWorker,
  getEncampmentOccupantsWorker,
  getEncampmentOccupantsWatcher,
  removePersonFromEncampmentWorker,
  removePersonFromEncampmentWatcher,
};
