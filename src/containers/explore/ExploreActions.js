/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_EXPLORE_RESULTS :'CLEAR_EXPLORE_RESULTS' = 'CLEAR_EXPLORE_RESULTS';
const clearExploreResults = (value :boolean = false) => ({
  type: CLEAR_EXPLORE_RESULTS,
  value,
});

const EXPLORE_PEOPLE :'EXPLORE_PEOPLE' = 'EXPLORE_PEOPLE';
const explorePeople :RequestSequence = newRequestSequence(EXPLORE_PEOPLE);

const EXPLORE_FILE :'EXPLORE_FILE' = 'EXPLORE_FILE';
const exploreFile :RequestSequence = newRequestSequence(EXPLORE_FILE);

export {
  CLEAR_EXPLORE_RESULTS,
  EXPLORE_FILE,
  EXPLORE_PEOPLE,
  clearExploreResults,
  exploreFile,
  explorePeople,
};
