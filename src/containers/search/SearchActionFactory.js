/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

/*
 * RequestSequences
 */

const SEARCH_CONSUMER_NEIGHBORS :'SEARCH_CONSUMER_NEIGHBORS' = 'SEARCH_CONSUMER_NEIGHBORS';
const searchConsumerNeighbors :RequestSequence = newRequestSequence(SEARCH_CONSUMER_NEIGHBORS);

const SEARCH_CONSUMERS :'SEARCH_CONSUMERS' = 'SEARCH_CONSUMERS';
const searchConsumers :RequestSequence = newRequestSequence(SEARCH_CONSUMERS);

/*
 * standard actions
 */

/* eslint-disable max-len */
const CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS :'CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS' = 'CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS';
/* eslint-enable */

function clearConsumerNeighborsSearchResults() :Object {

  return {
    type: CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS
  };
}

const CLEAR_CONSUMER_SEARCH_RESULTS :'CLEAR_CONSUMER_SEARCH_RESULTS' = 'CLEAR_CONSUMER_SEARCH_RESULTS';

function clearConsumerSearchResults() :Object {

  return {
    type: CLEAR_CONSUMER_SEARCH_RESULTS
  };
}

export {
  CLEAR_CONSUMER_NEIGHBORS_SEARCH_RESULTS,
  CLEAR_CONSUMER_SEARCH_RESULTS,
  SEARCH_CONSUMER_NEIGHBORS,
  SEARCH_CONSUMERS,
  clearConsumerNeighborsSearchResults,
  clearConsumerSearchResults,
  searchConsumerNeighbors,
  searchConsumers
};
