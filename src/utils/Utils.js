/*
 * @flow
 */

import { ValidationUtils } from 'lattice-utils';

const ORGANIZATION_ID :string = 'organization_id';

const { isValidUUID } = ValidationUtils;

function storeOrganizationId(organizationId :?string) :void {

  if (!organizationId || !isValidUUID(organizationId)) {
    return;
  }
  localStorage.setItem(ORGANIZATION_ID, organizationId);
}

export {
  storeOrganizationId,
};
