/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_EXPLORE_RESULTS,
  exploreFile,
  exploreIncidents,
  explorePeople,
  getIncludedPeople,
  getInvolvedPeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const {
  FILE_FQN,
  PEOPLE_FQN,
  INCIDENT_FQN
} = APP_TYPES_FQNS;

const INITIAL_STATE :Map = fromJS({
  [PEOPLE_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    profilePicsByEKID: Map(),
    recentIncidentsByEKID: Map({
      data: Map(),
      fetchState: RequestStates.STANDBY,
    }),
    searchTerm: '',
    totalHits: 0,
  },
  [FILE_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByFileEKID: Map(),
    peopleByEKID: Map(),
    searchTerm: '',
    totalHits: 0,
  },
  [INCIDENT_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByIncidentEKID: Map(),
    peopleByEKID: Map(),
    searchTerm: '',
    totalHits: 0,
  },
});

export default function exploreReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case explorePeople.case(action.type): {
      return explorePeople.reducer(state, action, {
        REQUEST: () => state
          .setIn([PEOPLE_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([PEOPLE_FQN], action.value),
        SUCCESS: () => state
          .setIn([PEOPLE_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([PEOPLE_FQN], action.value),
        FAILURE: () => state.setIn([PEOPLE_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreFile.case(action.type): {
      return exploreFile.reducer(state, action, {
        REQUEST: () => state
          .setIn([FILE_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([FILE_FQN], action.value),
        SUCCESS: () => state
          .setIn([FILE_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([FILE_FQN], action.value),
        FAILURE: () => state.setIn([FILE_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreIncidents.case(action.type): {
      return exploreIncidents.reducer(state, action, {
        REQUEST: () => state
          .setIn([INCIDENT_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([INCIDENT_FQN], action.value),
        SUCCESS: () => state
          .setIn([INCIDENT_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([INCIDENT_FQN], action.value),
        FAILURE: () => state.setIn([INCIDENT_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case getPeoplePhotos.case(action.type): {
      return getPeoplePhotos.reducer(state, action, {
        SUCCESS: () => state
          .setIn([PEOPLE_FQN, 'fetchState'], RequestStates.SUCCESS)
          .setIn([PEOPLE_FQN, 'profilePicsByEKID'], action.value),
        FAILURE: () => state.setIn([PEOPLE_FQN, 'fetchState'], RequestStates.FAILURE),
      });
    }

    case getRecentIncidents.case(action.type): {
      return getRecentIncidents.reducer(state, action, {
        REQUEST: () => state
          .setIn([PEOPLE_FQN, 'recentIncidentsByEKID', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn([PEOPLE_FQN, 'recentIncidentsByEKID', 'fetchState'], RequestStates.SUCCESS)
          .setIn([PEOPLE_FQN, 'recentIncidentsByEKID', 'data'], action.value),
        FAILURE: () => state
          .setIn([PEOPLE_FQN, 'recentIncidentsByEKID', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case getIncludedPeople.case(action.type): {
      return getIncludedPeople.reducer(state, action, {
        SUCCESS: () => state
          .mergeIn([FILE_FQN], action.value),
        FAILURE: () => state.setIn([PEOPLE_FQN, 'fetchState'], RequestStates.FAILURE),
      });
    }

    case getInvolvedPeople.case(action.type): {
      return getInvolvedPeople.reducer(state, action, {
        SUCCESS: () => state
          .mergeIn([INCIDENT_FQN], action.value),
        FAILURE: () => state.setIn([PEOPLE_FQN, 'fetchState'], RequestStates.FAILURE),
      });
    }

    case CLEAR_EXPLORE_RESULTS: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }

}
