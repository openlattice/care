/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_LB_LOCATIONS :'CLEAR_LB_LOCATIONS' = 'CLEAR_LB_LOCATIONS';
const clearLBLocationResults = () => ({
  type: CLEAR_LB_LOCATIONS
});

const SEARCH_LB_LOCATIONS :string = 'SEARCH_LB_LOCATIONS';
const searchLBLocations :RequestSequence = newRequestSequence(SEARCH_LB_LOCATIONS);

export {
  CLEAR_LB_LOCATIONS,
  SEARCH_LB_LOCATIONS,
  clearLBLocationResults,
  searchLBLocations,
};
