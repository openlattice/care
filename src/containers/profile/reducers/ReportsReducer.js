// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getProfileReports } from '../actions/ReportActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  data: List()
});

const reportsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getProfileReports.case(action.type): {
      return getProfileReports.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('data', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default reportsReducer;
