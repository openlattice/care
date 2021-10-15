import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

const { REQUEST_STATE } = ReduxConstants;

const ADMIN_ROLE_ACL_KEY = 'adminRoleAclKey';
const APP = 'app';
const CRISIS_REPORT = 'crisisReport';
const EDM = 'edm';
const FORM_SCHEMAS = 'formSchemas';
const FQN_TO_ID_MAP = 'fqnToIdMap';
const ID = 'id';
const ORGANIZATIONS = 'organizations';
const PROPERTY_TYPES_BY_ID = 'propertyTypesById';
const SCHEMAS = 'schemas';
const SELECTED_ORGANIZATION_ID = 'selectedOrganizationId';
const SELECTED_ORG_ENTITY_SET_IDS = 'selectedOrgEntitySetIds';
const SETTINGS = 'settings';

export const RS_INITIAL_STATE = {
  [REQUEST_STATE]: RequestStates.STANDBY,
};

export {
  ADMIN_ROLE_ACL_KEY,
  APP,
  CRISIS_REPORT,
  EDM,
  FORM_SCHEMAS,
  FQN_TO_ID_MAP,
  ID,
  ORGANIZATIONS,
  PROPERTY_TYPES_BY_ID,
  REQUEST_STATE,
  SCHEMAS,
  SELECTED_ORGANIZATION_ID,
  SELECTED_ORG_ENTITY_SET_IDS,
  SETTINGS,
};
