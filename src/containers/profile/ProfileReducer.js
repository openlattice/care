// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getProfileReports, SELECT_PERSON } from './ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  reports: List(),
  selectedPerson: Map(),
});

export default function profileReducer(state :Map = INITIAL_STATE, action :SequenceAction) {
  switch (action.type) {
    case getProfileReports.case(action.type): {
      return getProfileReports.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state.set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case SELECT_PERSON:
      return state.set('selectedPerson', fromJS(action.value));

    default:
      return state;
  }
}
