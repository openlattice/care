/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_SEARCH_RESULTS :'CLEAR_SEARCH_RESULTS' = 'CLEAR_SEARCH_RESULTS';
const clearSearchResults = (value :boolean) => ({
  type: CLEAR_SEARCH_RESULTS,
  value,
});

const SEARCH_PEOPLE :'SEARCH_PEOPLE' = 'SEARCH_PEOPLE';
const searchPeople :RequestSequence = newRequestSequence(SEARCH_PEOPLE);

const GET_PEOPLE_PHOTOS :'GET_PEOPLE_PHOTOS' = 'GET_PEOPLE_PHOTOS';
const getPeoplePhotos :RequestSequence = newRequestSequence(GET_PEOPLE_PHOTOS);

const GET_RECENT_INCIDENTS :'GET_RECENT_INCIDENTS' = 'GET_RECENT_INCIDENTS';
const getRecentIncidents :RequestSequence = newRequestSequence(GET_RECENT_INCIDENTS);

const SUBMIT_NEW_PERSON :'SUBMIT_NEW_PERSON' = 'SUBMIT_NEW_PERSON';
const submitNewPerson :RequestSequence = newRequestSequence(SUBMIT_NEW_PERSON);

export {
  CLEAR_SEARCH_RESULTS,
  GET_PEOPLE_PHOTOS,
  GET_RECENT_INCIDENTS,
  SEARCH_PEOPLE,
  SUBMIT_NEW_PERSON,
  clearSearchResults,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
  submitNewPerson,
};
