// @flow

import { Map } from 'immutable';
import type { UUID } from 'lattice';

import { ADMIN_ROLE_ACL_KEY, APP, ORGANIZATIONS } from '../constants';

export default function selectAdminRolePrincipleId(organizationId :UUID) {

  return (state :Map) :UUID => state.getIn([APP, ORGANIZATIONS, organizationId, ADMIN_ROLE_ACL_KEY, 1]);
}
