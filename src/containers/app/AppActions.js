/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const LOAD_APP :'LOAD_APP' = 'LOAD_APP';
const loadApp :RequestSequence = newRequestSequence(LOAD_APP);

const LOAD_HOSPITALS :'LOAD_HOSPITALS' = 'LOAD_HOSPITALS';
const loadHospitals :RequestSequence = newRequestSequence(LOAD_HOSPITALS);

const SWITCH_ORGANIZATION :'SWITCH_ORGANIZATION' = 'SWITCH_ORGANIZATION';
const switchOrganization = (orgId :string) :Object => ({
  orgId,
  type: SWITCH_ORGANIZATION
});

export {
  LOAD_APP,
  LOAD_HOSPITALS,
  SWITCH_ORGANIZATION,
  loadApp,
  loadHospitals,
  switchOrganization
};
