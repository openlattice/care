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
  getPhysicalAppearance,
} from './ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchAppearanceState: RequestStates.STANDBY,
  fetchPersonState: RequestStates.STANDBY,
  fetchReportsState: RequestStates.STANDBY,
  physicalAppearance: Map(),
  reports: List(),
  selectedPerson: Map(),
  updateAboutState: RequestStates.STANDBY,
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

    case getPhysicalAppearance.case(action.type): {
      return getPhysicalAppearance.reducer(state, action, {
        REQUEST: () => state.set('fetchAppearanceState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchAppearanceState', RequestStates.SUCCESS)
          .set('physicalAppearance', action.value),
        FAILURE: () => state.set('fetchAppearanceState', RequestStates.FAILURE),
      });
    }

    case updateProfileAbout.case(action.type): {
      return updateProfileAbout.reducer(state, action, {
        REQUEST: () => state.set('updateAboutState', RequestStates.PENDING),
        SUCCESS: () => {
          const { updatedPerson, updatedPhysicalAppearance } = action.value;
          return state
            .set('updateAboutState', RequestStates.SUCCESS)
            .set('selectedPerson', updatedPerson)
            .set('physicalAppearance', updatedPhysicalAppearance);
        },
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
