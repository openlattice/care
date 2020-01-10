/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_LB_PEOPLE :'CLEAR_LB_PEOPLE' = 'CLEAR_LB_PEOPLE';
const clearLBPeopleResults = () => ({
  type: CLEAR_LB_PEOPLE
});

const SEARCH_LB_PEOPLE :string = 'SEARCH_LB_PEOPLE';
const searchLBPeople :RequestSequence = newRequestSequence(SEARCH_LB_PEOPLE);

const GET_LB_PEOPLE_PHOTOS :string = 'GET_LB_PEOPLE_PHOTOS';
const getLBPeoplePhotos :RequestSequence = newRequestSequence(GET_LB_PEOPLE_PHOTOS);

export {
  CLEAR_LB_PEOPLE,
  GET_LB_PEOPLE_PHOTOS,
  SEARCH_LB_PEOPLE,
  clearLBPeopleResults,
  getLBPeoplePhotos,
  searchLBPeople,
};
