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

export {
  CLEAR_SEARCH_RESULTS,
  EDIT_PERSON,
  SEARCH_PEOPLE,
  clearSearchResults,
  editPerson,
  searchPeople,
};
