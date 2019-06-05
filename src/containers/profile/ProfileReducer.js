// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_PROFILE,
  SELECT_PERSON,
  getPersonData,
  getProfileReports,
  updateProfileAbout,
} from './ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchReportsState: RequestStates.STANDBY,
  fetchPersonState: RequestStates.STANDBY,
  updateAboutState: RequestStates.STANDBY,
  reports: List(),
  selectedPerson: Map(),
});

export default function profileReducer(state :Map = INITIAL_STATE, action :SequenceAction) {
  switch (action.type) {
    case getProfileReports.case(action.type): {
      return getProfileReports.reducer(state, action, {
        REQUEST: () => state.set('fetchReportsState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchReportsState', RequestStates.SUCCESS)
          .set('reports', action.value),
        FAILURE: () => state.set('fetchReportsState', RequestStates.FAILURE),
      });
    }

    case getPersonData.case(action.type): {
      return getPersonData.reducer(state, action, {
        REQUEST: () => state.set('fetchPersonState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchPersonState', RequestStates.SUCCESS)
          .set('selectedPerson', action.value),
        FAILURE: () => state.set('fetchPersonState', RequestStates.FAILURE),
      });
    }

    case updateProfileAbout.case(action.type): {
      return updateProfileAbout.reducer(state, action, {
        REQUEST: () => state.set('updateAboutState', RequestStates.PENDING),
        SUCCESS: () => state.set('updateAboutState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateAboutState', RequestStates.FAILURE),
      });
    }

    case SELECT_PERSON:
      return state.set('selectedPerson', fromJS(action.value));

    case CLEAR_PROFILE:
      return INITIAL_STATE;

    default:
      return state;
  }
}
