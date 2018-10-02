/*
 * @flow
 */

import Lattice from 'lattice';
import LatticeAuth from 'lattice-auth';

// injected by Webpack.DefinePlugin
declare var __ENV_DEV__ :boolean;

const { AuthUtils } = LatticeAuth;

const ORGANIZATION_ID :string = 'organization_id';

/*
 * https://github.com/mixer/uuid-validate
 * https://github.com/chriso/validator.js
 *
 * this regular expression comes from isUUID() from the validator.js library. isUUID() defaults to checking "all"
 * versions, but that means we lose validation against a specific version. for example, the regular expression returns
 * true for '00000000-0000-0000-0000-000000000000', but this UUID is technically not valid.
 */
const BASE_UUID_PATTERN :RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

function isValidUuid(value :any) :boolean {

  return BASE_UUID_PATTERN.test(value);
}

function randomStringId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2) + (new Date()).getTime().toString(36);
}

function getLatticeConfigBaseUrl() :string {

  // TODO: this probably doesn't belong here, also hardcoded strings == not great
  let baseUrl = 'localhost';
  if (!__ENV_DEV__) {
    baseUrl = window.location.host.startsWith('staging') ? 'staging' : 'production';
  }
  return 'production';
}

function resetLatticeConfig() :void {

  Lattice.configure({
    authToken: AuthUtils.getAuthToken(),
    baseUrl: getLatticeConfigBaseUrl(),
  });
}

function getOrganizationId() :?string {

  const organizationId :?string = localStorage.getItem(ORGANIZATION_ID);
  if (typeof organizationId === 'string' && organizationId.trim().length) {
    return organizationId;
  }
  return null;
}

function storeOrganizationId(organizationId :?string) :void {

  if (!organizationId || !isValidUuid(organizationId)) {
    return;
  }
  localStorage.setItem(ORGANIZATION_ID, organizationId);
}

export {
  getLatticeConfigBaseUrl,
  getOrganizationId,
  isValidUuid,
  randomStringId,
  resetLatticeConfig,
  storeOrganizationId,
};
