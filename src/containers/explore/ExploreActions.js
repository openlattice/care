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

const EXPLORE_CONTACT_INFORMATION :'EXPLORE_CONTACT_INFORMATION' = 'EXPLORE_CONTACT_INFORMATION';
const exploreContactInformation :RequestSequence = newRequestSequence(EXPLORE_CONTACT_INFORMATION);

const EXPLORE_LOCATION :'EXPLORE_LOCATION' = 'EXPLORE_LOCATION';
const exploreLocation :RequestSequence = newRequestSequence(EXPLORE_LOCATION);

const EXPLORE_INCIDENTS :'EXPLORE_INCIDENTS' = 'EXPLORE_INCIDENTS';
const exploreIncidents :RequestSequence = newRequestSequence(EXPLORE_INCIDENTS);

const GET_INVOLVED_PEOPLE :'GET_INVOLVED_PEOPLE' = 'GET_INVOLVED_PEOPLE';
const getInvolvedPeople :RequestSequence = newRequestSequence(GET_INVOLVED_PEOPLE);

const GET_INCLUDED_PEOPLE :'GET_INCLUDED_PEOPLE' = 'GET_INCLUDED_PEOPLE';
const getIncludedPeople :RequestSequence = newRequestSequence(GET_INCLUDED_PEOPLE);

const EXPLORE_PHYSICAL_APPEARANCES :'EXPLORE_PHYSICAL_APPEARANCES' = 'EXPLORE_PHYSICAL_APPEARANCES';
const explorePhysicalAppearances :RequestSequence = newRequestSequence(EXPLORE_PHYSICAL_APPEARANCES);

const EXPLORE_POLICE_CAD :'EXPLORE_POLICE_CAD' = 'EXPLORE_POLICE_CAD';
const explorePoliceCAD :RequestSequence = newRequestSequence(EXPLORE_POLICE_CAD);

const EXPLORE_CITATIONS :'EXPLORE_CITATIONS' = 'EXPLORE_CITATIONS';
const exploreCitations :RequestSequence = newRequestSequence(EXPLORE_CITATIONS);

/* eslint-disable-next-line max-len */
const EXPLORE_IDENTIFYING_CHARACTERISTICS :'EXPLORE_IDENTIFYING_CHARACTERISTICS' = 'EXPLORE_IDENTIFYING_CHARACTERISTICS';
const exploreIdentifyingCharacteristics :RequestSequence = newRequestSequence(EXPLORE_IDENTIFYING_CHARACTERISTICS);

const GET_OBSERVED_IN_PEOPLE :'GET_OBSERVED_IN_PEOPLE' = 'GET_OBSERVED_IN_PEOPLE';
const getObservedInPeople :RequestSequence = newRequestSequence(GET_OBSERVED_IN_PEOPLE);

export {
  CLEAR_EXPLORE_RESULTS,
  EXPLORE_CITATIONS,
  EXPLORE_CONTACT_INFORMATION,
  EXPLORE_FILE,
  EXPLORE_IDENTIFYING_CHARACTERISTICS,
  EXPLORE_INCIDENTS,
  EXPLORE_LOCATION,
  EXPLORE_PEOPLE,
  EXPLORE_PHYSICAL_APPEARANCES,
  EXPLORE_POLICE_CAD,
  GET_INCLUDED_PEOPLE,
  GET_INVOLVED_PEOPLE,
  GET_OBSERVED_IN_PEOPLE,
  clearExploreResults,
  exploreCitations,
  exploreContactInformation,
  exploreFile,
  exploreIdentifyingCharacteristics,
  exploreIncidents,
  exploreLocation,
  explorePeople,
  explorePhysicalAppearances,
  explorePoliceCAD,
  getIncludedPeople,
  getInvolvedPeople,
  getObservedInPeople,
};
