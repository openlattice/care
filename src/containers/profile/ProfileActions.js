// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PROFILE_REPORTS :'GET_PROFILE_REPORTS' = 'GET_PROFILE_REPORTS';
const getProfileReports :RequestSequence = newRequestSequence(GET_PROFILE_REPORTS);

const SELECT_PERSON :'SELECT_PERSON' = 'SELECT_PERSON';
const selectPerson :RequestSequence = newRequestSequence(SELECT_PERSON);

const CLEAR_SELECTED_PERSON :'CLEAR_SELECTED_PERSON' = 'CLEAR_SELECTED_PERSON';
const clearSelectedPerson = () => ({
  type: CLEAR_SELECTED_PERSON
});

export {
  CLEAR_SELECTED_PERSON,
  GET_PROFILE_REPORTS,
  SELECT_PERSON,
  clearSelectedPerson,
  getProfileReports,
  selectPerson,
};
