// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { RESET_ISSUE_STATE, submitIssue } from './IssueActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

const IssueReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case submitIssue.case(action.type): {
      return submitIssue.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state.set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case RESET_ISSUE_STATE: {
      return state
        .set('submitState', RequestStates.STANDBY)
        .set('updateState', RequestStates.STANDBY)
        .set('fetchState', RequestStates.STANDBY);
    }

    default:
      return state;
  }
};

export default IssueReducer;
