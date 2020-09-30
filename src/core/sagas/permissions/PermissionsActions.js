// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const REFRESH_PERMISSIONS :'REFRESH_PERMISSIONS' = 'REFRESH_PERMISSIONS';
const refreshPermissions :RequestSequence = newRequestSequence(REFRESH_PERMISSIONS);

export {
  REFRESH_PERMISSIONS,
  refreshPermissions,
};
