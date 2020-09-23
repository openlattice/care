/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_EXPLORE_RESULTS :'CLEAR_EXPLORE_RESULTS' = 'CLEAR_EXPLORE_RESULTS';
const clearExploreResults = () => ({
  type: CLEAR_EXPLORE_RESULTS
});

const EXPLORE_PEOPLE :'EXPLORE_PEOPLE' = 'EXPLORE_PEOPLE';
const explorePeople :RequestSequence = newRequestSequence(EXPLORE_PEOPLE);

const EXPLORE_FILE :'EXPLORE_FILE' = 'EXPLORE_FILE';
const exploreFile :RequestSequence = newRequestSequence(EXPLORE_FILE);

const EXPLORE_INCIDENTS :'EXPLORE_INCIDENTS' = 'EXPLORE_INCIDENTS';
const exploreIncidents :RequestSequence = newRequestSequence(EXPLORE_INCIDENTS);

const GET_INVOLVED_PEOPLE :'GET_INVOLVED_PEOPLE' = 'GET_INVOLVED_PEOPLE';
const getInvolvedPeople :RequestSequence = newRequestSequence(GET_INVOLVED_PEOPLE);

const GET_INCLUDED_PEOPLE :'GET_INCLUDED_PEOPLE' = 'GET_INCLUDED_PEOPLE';
const getIncludedPeople :RequestSequence = newRequestSequence(GET_INCLUDED_PEOPLE);

export {
  CLEAR_EXPLORE_RESULTS,
  EXPLORE_FILE,
  EXPLORE_INCIDENTS,
  EXPLORE_PEOPLE,
  GET_INCLUDED_PEOPLE,
  GET_INVOLVED_PEOPLE,
  clearExploreResults,
  exploreFile,
  exploreIncidents,
  explorePeople,
  getIncludedPeople,
  getInvolvedPeople,
};
