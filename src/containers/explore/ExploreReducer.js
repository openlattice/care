/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_EXPLORE_RESULTS,
  exploreCitations,
  exploreContactInformation,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  exploreLocation,
  explorePeople,
  explorePhysicalAppearances,
  explorePoliceCAD,
  getIncludedPeople,
  getInvolvedPeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const {
  CITATION_FQN,
  CONTACT_INFORMATION_FQN,
  FILE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  INCIDENT_FQN,
  LOCATION_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
  POLICE_CAD_FQN,
} = APP_TYPES_FQNS;

const EXPLORE_EDGE_TO_PEOPLE_STATE = {
  fetchState: RequestStates.STANDBY,
  hits: List(),
  peopleByHitEKID: Map(),
  peopleByEKID: Map(),
  searchTerm: '',
  totalHits: 0,
};

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
  [CITATION_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [CONTACT_INFORMATION_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [FILE_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [IDENTIFYING_CHARACTERISTICS_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [INCIDENT_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [LOCATION_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [PHYSICAL_APPEARANCE_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
  [POLICE_CAD_FQN]: EXPLORE_EDGE_TO_PEOPLE_STATE,
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

    case explorePhysicalAppearances.case(action.type): {
      return explorePhysicalAppearances.reducer(state, action, {
        REQUEST: () => state
          .setIn([PHYSICAL_APPEARANCE_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([PHYSICAL_APPEARANCE_FQN], action.value),
        SUCCESS: () => state
          .setIn([PHYSICAL_APPEARANCE_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([PHYSICAL_APPEARANCE_FQN], action.value),
        FAILURE: () => state.setIn([PHYSICAL_APPEARANCE_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreLocation.case(action.type): {
      return exploreLocation.reducer(state, action, {
        REQUEST: () => state
          .setIn([LOCATION_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([LOCATION_FQN], action.value),
        SUCCESS: () => state
          .setIn([LOCATION_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([LOCATION_FQN], action.value),
        FAILURE: () => state.setIn([LOCATION_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreIdentifyingCharacteristics.case(action.type): {
      return exploreIdentifyingCharacteristics.reducer(state, action, {
        REQUEST: () => state
          .setIn([IDENTIFYING_CHARACTERISTICS_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([IDENTIFYING_CHARACTERISTICS_FQN], action.value),
        SUCCESS: () => state
          .setIn([IDENTIFYING_CHARACTERISTICS_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([IDENTIFYING_CHARACTERISTICS_FQN], action.value),
        FAILURE: () => state.setIn([IDENTIFYING_CHARACTERISTICS_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreContactInformation.case(action.type): {
      return exploreContactInformation.reducer(state, action, {
        REQUEST: () => state
          .setIn([CONTACT_INFORMATION_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([CONTACT_INFORMATION_FQN], action.value),
        SUCCESS: () => state
          .setIn([CONTACT_INFORMATION_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([CONTACT_INFORMATION_FQN], action.value),
        FAILURE: () => state.setIn([CONTACT_INFORMATION_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case explorePoliceCAD.case(action.type): {
      return explorePoliceCAD.reducer(state, action, {
        REQUEST: () => state
          .setIn([POLICE_CAD_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([POLICE_CAD_FQN], action.value),
        SUCCESS: () => state
          .setIn([POLICE_CAD_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([POLICE_CAD_FQN], action.value),
        FAILURE: () => state.setIn([POLICE_CAD_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreCitations.case(action.type): {
      return exploreCitations.reducer(state, action, {
        REQUEST: () => state
          .setIn([CITATION_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([CITATION_FQN], action.value),
        SUCCESS: () => state
          .setIn([CITATION_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([CITATION_FQN], action.value),
        FAILURE: () => state.setIn([CITATION_FQN, 'fetchState'], RequestStates.FAILURE)
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

    case CLEAR_EXPLORE_RESULTS: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }

}
