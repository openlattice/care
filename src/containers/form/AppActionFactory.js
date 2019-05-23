/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const LOAD_APP :'LOAD_APP' = 'LOAD_APP';
const loadApp :RequestSequence = newRequestSequence(LOAD_APP);

const LOAD_CONFIGURATIONS :'LOAD_CONFIGURATIONS' = 'LOAD_CONFIGURATIONS';
const loadConfigurations :RequestSequence = newRequestSequence(LOAD_CONFIGURATIONS);

const LOAD_HOSPITALS :'LOAD_HOSPITALS' = 'LOAD_HOSPITALS';
const loadHospitals :RequestSequence = newRequestSequence(LOAD_HOSPITALS);

const SELECT_ORGANIZATION :'SELECT_ORGANIZATION' = 'SELECT_ORGANIZATION';

function selectOrganization(orgId :string) :Object {

  return {
    orgId,
    type: SELECT_ORGANIZATION
  };
}

export {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  LOAD_HOSPITALS,
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations,
  loadHospitals,
  selectOrganization
};
