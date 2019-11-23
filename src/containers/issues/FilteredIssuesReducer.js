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

import {
  selectIssue
} from './issue/IssueActions';
import { OPENLATTICE_ID_FQN } from '../../edm/DataModelFqns';

const INITIAL_STATE :Map = fromJS({
  data: List(),
  subjectsByEKID: Map(),
  subjectEKIDsByIssueEKID: Map(),
  fetchState: RequestStates.STANDBY,
});

const updateIssueRow = (state :Map, issueEKID :UUID, rowData :Map) => {
  const issueIndex = state
    .get('data')
    .findIndex((issueRow) => issueRow.get(OPENLATTICE_ID_FQN) === issueEKID);

  if (issueIndex > -1) {
    return state.mergeDeepIn(['data', issueIndex], rowData);
  }

  return state;
};

const FilteredIssues = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getReportedByMe.case(action.type): {
      return getReportedByMe.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case selectIssue.case(action.type): {
      return selectIssue.reducer(state, action, {
        SUCCESS: () => {
          const { data } = action.value;
          const issue :Map = data.get('issue');
          const issueEKID :UUID = issue.getIn([OPENLATTICE_ID_FQN, 0]);
          const issueRowData :Map = issue.map((details) => details.get(0));
          
          return updateIssueRow(state, issueEKID, issueRowData);
        },
      });
    }

    default:
      return state;
  }
};

export default FilteredIssues;
