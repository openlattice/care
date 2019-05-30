// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PERSON_DATA :'GET_PERSON_DATA' = 'GET_PERSON_DATA';
const getPersonData :RequestSequence = newRequestSequence(GET_PERSON_DATA);

const GET_PROFILE_REPORTS :'GET_PROFILE_REPORTS' = 'GET_PROFILE_REPORTS';
const getProfileReports :RequestSequence = newRequestSequence(GET_PROFILE_REPORTS);

const SELECT_PERSON :'SELECT_PERSON' = 'SELECT_PERSON';
const selectPerson :RequestSequence = newRequestSequence(SELECT_PERSON);

const CLEAR_PROFILE :'CLEAR_PROFILE' = 'CLEAR_PROFILE';
const clearProfile = () => ({
  type: CLEAR_PROFILE
});

export {
  CLEAR_PROFILE,
  GET_PERSON_DATA,
  GET_PROFILE_REPORTS,
  SELECT_PERSON,
  clearProfile,
  getPersonData,
  getProfileReports,
  selectPerson,
};
