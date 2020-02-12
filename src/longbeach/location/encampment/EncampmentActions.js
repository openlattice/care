/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_ENCAMPMENT_LOCATIONS :'CLEAR_ENCAMPMENT_LOCATIONS' = 'CLEAR_ENCAMPMENT_LOCATIONS';
const clearEncampmentLocationResults = () => ({
  type: CLEAR_ENCAMPMENT_LOCATIONS
});

const SEARCH_ENCAMPMENT_LOCATIONS :string = 'SEARCH_ENCAMPMENT_LOCATIONS';
const searchEncampmentLocations :RequestSequence = newRequestSequence(SEARCH_ENCAMPMENT_LOCATIONS);

const GET_GEO_OPTIONS :string = 'GET_GEO_OPTIONS';
const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

const GET_ENCAMPMENT_LOCATIONS_NEIGHBORS :string = 'GET_ENCAMPMENT_LOCATIONS_NEIGHBORS';
const getEncampmentLocationsNeighbors :RequestSequence = newRequestSequence(GET_ENCAMPMENT_LOCATIONS_NEIGHBORS);

const GET_LB_STAY_AWAY_PEOPLE :string = 'GET_LB_STAY_AWAY_PEOPLE';
const getLBStayAwayPeople :RequestSequence = newRequestSequence(GET_LB_STAY_AWAY_PEOPLE);

export {
  CLEAR_ENCAMPMENT_LOCATIONS,
  GET_ENCAMPMENT_LOCATIONS_NEIGHBORS,
  GET_GEO_OPTIONS,
  GET_LB_STAY_AWAY_PEOPLE,
  SEARCH_ENCAMPMENT_LOCATIONS,
  clearEncampmentLocationResults,
  getEncampmentLocationsNeighbors,
  getGeoOptions,
  getLBStayAwayPeople,
  searchEncampmentLocations,
};
