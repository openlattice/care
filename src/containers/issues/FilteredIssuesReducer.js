// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  CLEAR_ISSUES,
  clearIssues,
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
} from './IssuesActions';

const INITIAL_STATE :Map = fromJS({
  data: List(),
  fetchState: RequestStates.STANDBY,
});

const FilteredIssues = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getReportedByMe.case(action.type): {
      return getReportedByMe.reducer(state, action, {
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

export default FilteredIssues;
