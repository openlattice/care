/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_PERSON :string = 'ADD_PERSON';
const addPerson :RequestSequence = newRequestSequence(ADD_PERSON);

const LOAD_USED_TAGS :string = 'LOAD_USED_TAGS';
const loadUsedTags :RequestSequence = newRequestSequence(LOAD_USED_TAGS);

const REMOVE_PERSON :string = 'REMOVE_PERSON';
const removePerson :RequestSequence = newRequestSequence(REMOVE_PERSON);

const SEARCH_PEOPLE_FOR_DOCUMENTS :string = 'SEARCH_PEOPLE_FOR_DOCUMENTS';
const searchPeopleForDocuments :RequestSequence = newRequestSequence(SEARCH_PEOPLE_FOR_DOCUMENTS);

const UPLOAD_DOCUMENTS :string = 'UPLOAD_DOCUMENTS';
const uploadDocuments :RequestSequence = newRequestSequence(UPLOAD_DOCUMENTS);

export {
  ADD_PERSON,
  LOAD_USED_TAGS,
  REMOVE_PERSON,
  SEARCH_PEOPLE_FOR_DOCUMENTS,
  UPLOAD_DOCUMENTS,
  addPerson,
  loadUsedTags,
  removePerson,
  searchPeopleForDocuments,
  uploadDocuments
};
