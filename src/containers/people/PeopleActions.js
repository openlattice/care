/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_SEARCH_RESULTS :string = 'CLEAR_SEARCH_RESULTS';
const clearSearchResults :RequestSequence = newRequestSequence(CLEAR_SEARCH_RESULTS);

const EDIT_PERSON :string = 'EDIT_PERSON';
const editPerson :RequestSequence = newRequestSequence(EDIT_PERSON);

const SEARCH_PEOPLE :string = 'SEARCH_PEOPLE';
const searchPeople :RequestSequence = newRequestSequence(SEARCH_PEOPLE);

const GET_PEOPLE_PHOTOS :string = 'GET_PEOPLE_PHOTOS';
const getPeoplePhotos :RequestSequence = newRequestSequence(GET_PEOPLE_PHOTOS);

export {
  CLEAR_SEARCH_RESULTS,
  EDIT_PERSON,
  GET_PEOPLE_PHOTOS,
  SEARCH_PEOPLE,
  clearSearchResults,
  editPerson,
  getPeoplePhotos,
  searchPeople,
};
