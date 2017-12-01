/*
 * @flow
 */

import { newRequestSequence } from '../../core/redux/RequestSequence';
import type { RequestSequence } from '../../core/redux/RequestSequence';


const LOAD_APP :'LOAD_APP' = 'LOAD_APP';
const loadApp :RequestSequence = newRequestSequence(LOAD_APP);

const LOAD_CONFIGURATIONS :'LOAD_CONFIGURATIONS' = 'LOAD_CONFIGURATIONS';
const loadConfigurations :RequestSequence = newRequestSequence(LOAD_CONFIGURATIONS);

const SELECT_ORGANIZATION :'SELECT_ORGANIZATION' = 'SELECT_ORGANIZATION';
const selectOrganization :RequestSequence = newRequestSequence(SELECT_ORGANIZATION);

export {
  LOAD_APP,
  LOAD_CONFIGURATIONS,
  SELECT_ORGANIZATION,
  loadApp,
  loadConfigurations,
  selectOrganization
};
