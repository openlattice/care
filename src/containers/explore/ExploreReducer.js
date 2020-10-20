/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_EXPLORE_RESULTS,
  EXPLORE_IDENTIFYING_CHARACTERISTICS,
  exploreBehavior,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  explorePeople,
  explorePersonDetails,
  explorePhysicalAppearances,
  getIncludedPeople,
  getInvolvedPeople,
} from './ExploreActions';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getPeoplePhotos, getRecentIncidents } from '../people/PeopleActions';

const {
  FILE_FQN,
  PEOPLE_FQN,
  INCIDENT_FQN,
  PHYSICAL_APPEARANCE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN,
  PERSON_DETAILS_FQN,
  BEHAVIOR_FQN,
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
  [PHYSICAL_APPEARANCE_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByEdgeEKID: Map(),
    peopleByEKID: Map(),
    searchTerm: '',
    totalHits: 0,
  },
  [IDENTIFYING_CHARACTERISTICS_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByEdgeEKID: Map(),
    peopleByEKID: Map(),
    searchTerm: '',
    totalHits: 0,
  },
  [PERSON_DETAILS_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByEdgeEKID: Map(),
    peopleByEKID: Map(),
    searchTerm: '',
    totalHits: 0,
  },
  [BEHAVIOR_FQN]: {
    fetchState: RequestStates.STANDBY,
    hits: List(),
    peopleByEdgeEKID: Map(),
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

    case explorePersonDetails.case(action.type): {
      return explorePersonDetails.reducer(state, action, {
        REQUEST: () => state
          .setIn([PERSON_DETAILS_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([PERSON_DETAILS_FQN], action.value),
        SUCCESS: () => state
          .setIn([PERSON_DETAILS_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([PERSON_DETAILS_FQN], action.value),
        FAILURE: () => state.setIn([PERSON_DETAILS_FQN, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreIdentifyingCharacteristics.case(action.type): {
      return exploreIdentifyingCharacteristics.reducer(state, action, {
        REQUEST: () => state
          .setIn([EXPLORE_IDENTIFYING_CHARACTERISTICS, 'fetchState'], RequestStates.PENDING)
          .mergeIn([EXPLORE_IDENTIFYING_CHARACTERISTICS], action.value),
        SUCCESS: () => state
          .setIn([EXPLORE_IDENTIFYING_CHARACTERISTICS, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([EXPLORE_IDENTIFYING_CHARACTERISTICS], action.value),
        FAILURE: () => state.setIn([EXPLORE_IDENTIFYING_CHARACTERISTICS, 'fetchState'], RequestStates.FAILURE)
      });
    }

    case exploreBehavior.case(action.type): {
      return exploreBehavior.reducer(state, action, {
        REQUEST: () => state
          .setIn([BEHAVIOR_FQN, 'fetchState'], RequestStates.PENDING)
          .mergeIn([BEHAVIOR_FQN], action.value),
        SUCCESS: () => state
          .setIn([BEHAVIOR_FQN, 'fetchState'], RequestStates.SUCCESS)
          .mergeIn([BEHAVIOR_FQN], action.value),
        FAILURE: () => state.setIn([BEHAVIOR_FQN, 'fetchState'], RequestStates.FAILURE)
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
