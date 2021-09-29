import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

const { REQUEST_STATE } = ReduxConstants;

const APP = 'app';
const CRISIS_REPORT = 'crisisReport';
const EDM = 'edm';
const FQN_TO_ID_MAP = 'fqnToIdMap';
const ID = 'id';
const PROPERTY_TYPES_BY_ID = 'propertyTypesById';
const SELECTED_ORG_ENTITY_SET_IDS = 'selectedOrgEntitySetIds';
const SETTINGS = 'settings';

export const RS_INITIAL_STATE = {
  [REQUEST_STATE]: RequestStates.STANDBY,
};

export {
  APP,
  CRISIS_REPORT,
  EDM,
  FQN_TO_ID_MAP,
  ID,
  PROPERTY_TYPES_BY_ID,
  REQUEST_STATE,
  SELECTED_ORG_ENTITY_SET_IDS,
  SETTINGS,
};
