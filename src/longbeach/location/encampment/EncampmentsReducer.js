/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_ENCAMPMENT_LOCATIONS,
  RESET_ENCAMPMENT,
  getGeoOptions,
  searchEncampmentLocations,
  submitEncampment,
} from './EncampmentActions';

import { HOME_PATH } from '../../../core/router/Routes';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
  hits: List(),
  totalHits: 0,
  options: Map({
    fetchState: RequestStates.STANDBY,
    data: List()
  }),
  people: Map(),
  profilePictures: Map(),
  searchInputs: Map({
    address: '',
    currentLocation: false,
  }),
  encampments: Map(),
  encampmentLocations: Map(),
});

const encampmentsReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case searchEncampmentLocations.case(action.type): {
      return searchEncampmentLocations.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .set('searchInputs', action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getGeoOptions.case(action.type): {
      return getGeoOptions.reducer(state, action, {
        REQUEST: () => state.setIn(['options', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['options', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['options', 'data'], action.value),
        FAILURE: () => state.setIn(['options', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case submitEncampment.case(action.type): {
      return submitEncampment.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .mergeDeep(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case CLEAR_ENCAMPMENT_LOCATIONS: {
      return INITIAL_STATE;
    }

    case RESET_ENCAMPMENT: {
      return state.set('submitState', INITIAL_STATE.get('submitState'));
    }

    case LOCATION_CHANGE: {
      const {
        payload: {
          action: routingAction,
          location: {
            pathname
          } = {}
        } = {}
      } = action;

      // clear search results when pushing directly to /home
      if (pathname.startsWith(HOME_PATH) && routingAction === 'PUSH') {
        return INITIAL_STATE;
      }
      return state;
    }

    default:
      return state;
  }

};

export default encampmentsReducer;
