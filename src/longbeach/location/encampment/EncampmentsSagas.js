// @flow
import axios from 'axios';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_ENCAMPMENT_LOCATIONS_NEIGHBORS,
  GET_GEO_OPTIONS,
  SEARCH_ENCAMPMENT_LOCATIONS,
  SUBMIT_ENCAMPMENT,
  getEncampmentLocationsNeighbors,
  getGeoOptions,
  searchEncampmentLocations,
  submitEncampment,
} from './EncampmentActions';

import Logger from '../../../utils/Logger';
import * as FQN from '../../../edm/DataModelFqns';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp, getESIDsFromApp } from '../../../utils/AppUtils';
import { mapFirstEntityDataFromNeighbors } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { isDefined } from '../../../utils/LangUtils';

const { executeSearch, searchEntityNeighborsWithFilter } = SearchApiActions;
const { executeSearchWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  LOCATED_AT_FQN,
  ENCAMPMENT_FQN,
  ENCAMPMENT_LOCATION_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('EncampmentsSagas');

const GEOCODER_URL_PREFIX = 'https://osm.openlattice.com/nominatim/search/';
const GEOCODER_URL_SUFFIX = '?format=json';

function* getGeoOptionsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getGeoOptions.request(action.id));

    const response = yield call(axios, {
      method: 'get',
      url: `${GEOCODER_URL_PREFIX}${window.encodeURI(action.value)}${GEOCODER_URL_SUFFIX}`
    });

    const formattedOptions = response.data.map((option) => {
      // eslint-disable-next-line camelcase
      const { display_name, lat, lon } = option;
      return {
        ...option,
        label: display_name,
        value: `${lat},${lon}`
      };
    });

    yield put(getGeoOptions.success(action.id, fromJS(formattedOptions)));
  }
  catch (error) {
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
    LOG.error(action.type, error);
    yield put(getEncampmentLocationsNeighbors.failure(action.id));
  }

  return response;
}

function* getEncampmentLocationsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_ENCAMPMENT_LOCATIONS_NEIGHBORS, getEncampmentLocationsNeighborsWorker);
}

function* searchEncampmentLocationsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {
    data: {}
  };

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    const latitude :string = searchInputs.getIn(['selectedOption', 'lat']);
    const longitude :string = searchInputs.getIn(['selectedOption', 'lon']);

    yield put(searchEncampmentLocations.request(action.id, searchInputs));

    const app = yield select((state) => state.get('app', Map()));
    const encampmentLocationESID = getESIDFromApp(app, ENCAMPMENT_LOCATION_FQN);
    const locationCoordinatesPTID :UUID = yield select((state) => state
      .getIn(['edm', 'fqnToIdMap', FQN.LOCATION_COORDINATES_FQN]));

    const searchOptions = {
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

    const { data, error } = yield call(
      executeSearchWorker,
      executeSearch({ searchOptions })
    );

    if (error) throw error;

    const { hits, numHits } = data;
    const locationsEKIDs = hits.map((location) => getIn(location, [FQN.OPENLATTICE_ID_FQN, 0]));
    const locationsByEKID = Map(hits.map((entity) => [getIn(entity, [FQN.OPENLATTICE_ID_FQN, 0]), fromJS(entity)]));
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
    LOG.error(action.type, error);
    yield put(searchEncampmentLocations.failure(action.id));
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

    yield put(submitEncampment.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitEncampment.failure(action.id));
  }
}

function* submitEncampmentWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ENCAMPMENT, submitEncampmentWorker);
}

export {
  getEncampmentLocationsNeighborsWatcher,
  getEncampmentLocationsNeighborsWorker,
  getGeoOptionsWatcher,
  getGeoOptionsWorker,
  searchEncampmentLocationsWatcher,
  searchEncampmentLocationsWorker,
  submitEncampmentWatcher,
  submitEncampmentWorker,
};
