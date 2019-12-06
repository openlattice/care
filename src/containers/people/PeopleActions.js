/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_SEARCH_RESULTS :'CLEAR_SEARCH_RESULTS' = 'CLEAR_SEARCH_RESULTS';
const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS
});

const SEARCH_PEOPLE :string = 'SEARCH_PEOPLE';
const searchPeople :RequestSequence = newRequestSequence(SEARCH_PEOPLE);

const GET_PEOPLE_PHOTOS :string = 'GET_PEOPLE_PHOTOS';
const getPeoplePhotos :RequestSequence = newRequestSequence(GET_PEOPLE_PHOTOS);

export {
  CLEAR_SEARCH_RESULTS,
  GET_PEOPLE_PHOTOS,
  SEARCH_PEOPLE,
  clearSearchResults,
  getPeoplePhotos,
  searchPeople,
};
