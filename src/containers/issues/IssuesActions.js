// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ALL_ISSUES :'GET_ALL_ISSUES' = 'GET_ALL_ISSUES';
const getAllIssues :RequestSequence = newRequestSequence(GET_ALL_ISSUES);

const GET_OWN_ISSUES :'GET_OWN_ISSUES' = 'GET_OWN_ISSUES';
const getOwnIssues :RequestSequence = newRequestSequence(GET_OWN_ISSUES);

const CLEAR_INBOX :'CLEAR_INBOX' = 'CLEAR_INBOX';
const clearInbox = () => ({
  type: CLEAR_INBOX
});

export {
  CLEAR_INBOX,
  GET_ALL_ISSUES,
  GET_OWN_ISSUES,
  clearInbox,
  getAllIssues,
  getOwnIssues,
};
