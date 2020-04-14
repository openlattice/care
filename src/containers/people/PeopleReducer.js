/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { AccountUtils } from 'lattice-auth';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
  submitNewPerson
} from './PeopleActions';

import { loadApp } from '../app/AppActions';

const INITIAL_STATE :Map = fromJS({
  createdPerson: Map(),
  fetchState: RequestStates.STANDBY,
  hits: List(),
  profilePicsByEKID: Map(),
  recentIncidentsByEKID: Map({
    data: Map(),
    fetchState: RequestStates.STANDBY,
  }),
  searchInputs: Map({
    dob: undefined,
    firstName: '',
    lastName: '',
    ethnicity: undefined,
    race: undefined,
    sex: undefined,
  }),
  submitState: RequestStates.STANDBY,
  totalHits: 0,
});

export default function peopleReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        SUCCESS: () => {
          const organizationId = AccountUtils.retrieveOrganizationId();
          if (organizationId) {
            const { appSettingsByOrgId } = action.value;
            const appSettings = appSettingsByOrgId.get(organizationId, Map());
            const integratedRMS = appSettings.get('integratedRMS', false);
            return state.setIn(['searchInputs', 'includeRMS'], !integratedRMS);
          }
          return state.setIn(['searchInputs', 'includeRMS'], true);
        },
      });
    }

    case searchPeople.case(action.type): {
      return searchPeople.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .merge(action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getPeoplePhotos.case(action.type): {
      return getPeoplePhotos.reducer(state, action, {
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('profilePicsByEKID', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case submitNewPerson.case(action.type): {
      return submitNewPerson.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('createdPerson', action.value)
          .set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case getRecentIncidents.case(action.type): {
      return getRecentIncidents.reducer(state, action, {
        REQUEST: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['recentIncidentsByEKID', 'data'], action.value),
        FAILURE: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case CLEAR_SEARCH_RESULTS: {
      return INITIAL_STATE.setIn(['searchInputs', 'includeRMS'], action.value);
    }

    default:
      return state;
  }

}
