// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_ISSUE :'SUBMIT_ISSUE' = 'SUBMIT_ISSUE';
const submitIssue :RequestSequence = newRequestSequence(SUBMIT_ISSUE);

const RESET_ISSUE_STATE :'RESET_ISSUE_STATE' = 'RESET_ISSUE_STATE';
const resetIssueState = () => ({
  type: RESET_ISSUE_STATE
});

export {
  RESET_ISSUE_STATE,
  SUBMIT_ISSUE,
  resetIssueState,
  submitIssue,
};
