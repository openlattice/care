// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ALL_ISSUES :'GET_ALL_ISSUES' = 'GET_ALL_ISSUES';
const getAllIssues :RequestSequence = newRequestSequence(GET_ALL_ISSUES);

const GET_OWN_ISSUES :'GET_OWN_ISSUES' = 'GET_OWN_ISSUES';
const getOwnIssues :RequestSequence = newRequestSequence(GET_OWN_ISSUES);

const CLEAR_ISSUES :'CLEAR_ISSUES' = 'CLEAR_ISSUES';
const clearIssues = () => ({
  type: CLEAR_ISSUES
});

export {
  CLEAR_ISSUES,
  GET_ALL_ISSUES,
  GET_OWN_ISSUES,
  clearIssues,
  getAllIssues,
  getOwnIssues,
};
