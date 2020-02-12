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

const GET_GEO_OPTIONS :string = 'GET_ENCAMPMENT_GEO_OPTIONS';
const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

const GET_ENCAMPMENT_LOCATIONS_NEIGHBORS :string = 'GET_ENCAMPMENT_LOCATIONS_NEIGHBORS';
const getEncampmentLocationsNeighbors :RequestSequence = newRequestSequence(GET_ENCAMPMENT_LOCATIONS_NEIGHBORS);

const GET_LB_STAY_AWAY_PEOPLE :string = 'GET_LB_STAY_AWAY_PEOPLE';
const getLBStayAwayPeople :RequestSequence = newRequestSequence(GET_LB_STAY_AWAY_PEOPLE);

const SUBMIT_ENCAMPMENT :'SUBMIT_ENCAMPMENT' = 'SUBMIT_ENCAMPMENT';
const submitEncampment :RequestSequence = newRequestSequence(SUBMIT_ENCAMPMENT);

const RESET_ENCAMPMENT :'RESET_ENCAMPMENT' = 'RESET_ENCAMPMENT';
const resetEncampment = () => ({
  type: RESET_ENCAMPMENT
});

const UPDATE_ENCAMPMENT :'UPDATE_ENCAMPMENT' = 'UPDATE_ENCAMPMENT';
const updateEncampment :RequestSequence = newRequestSequence(SUBMIT_ENCAMPMENT);

export {
  CLEAR_ENCAMPMENT_LOCATIONS,
  GET_ENCAMPMENT_LOCATIONS_NEIGHBORS,
  GET_GEO_OPTIONS,
  GET_LB_STAY_AWAY_PEOPLE,
  RESET_ENCAMPMENT,
  SEARCH_ENCAMPMENT_LOCATIONS,
  SUBMIT_ENCAMPMENT,
  UPDATE_ENCAMPMENT,
  clearEncampmentLocationResults,
  getEncampmentLocationsNeighbors,
  getGeoOptions,
  getLBStayAwayPeople,
  resetEncampment,
  searchEncampmentLocations,
  submitEncampment,
  updateEncampment,
};
