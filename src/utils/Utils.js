/*
 * @flow
 */

import Lattice from 'lattice';
import LatticeAuth from 'lattice-auth';
import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import parseInt from 'lodash/parseInt';
import validator from 'validator';

// injected by Webpack.DefinePlugin
declare var __ENV_DEV__ :boolean;

const { AuthUtils } = LatticeAuth;

export function isValidUuid(value :any) :boolean {

  return isString(value) && isUUID(value);
}

export function randomId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2);
}

export function randomStringId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2) + (new Date()).getTime().toString(36);
}

// TODO: get rid of react-bootstrap-time-picker
export function formatTimePickerSeconds(seconds :?number) :string {

  let hh = 0;
  let mm = 0;
  let ss = seconds || 0;

  while (ss >= 60) {
    mm += 1;
    ss -= 60;
  }

  while (mm >= 60) {
    hh += 1;
    mm -= 60;
  }

  let hhStr = hh.toString();
  hhStr = hhStr.length === 1 ? `0${hhStr}` : hhStr;

  let mmStr = mm.toString();
  mmStr = mmStr.length === 1 ? `0${mmStr}` : mmStr;

  let ssStr = ss.toString();
  ssStr = ssStr.length === 1 ? `0${ssStr}` : ssStr;

  return `${hhStr}:${mmStr}:${ssStr}`;
}

// TODO: get rid of react-bootstrap-date-picker
export function fixDatePickerIsoDateTime(value :?string) :string {

  if (value && validator.isISO8601(value)) {
    // DatePicker has weird behavior with timezones, so we have to fix the ISO date
    return value.replace(/T(.*)$/g, 'T00:00:00.000Z');
  }
  return '';
}

export function getCurrentPage() :number {

  const slashIndex :number = window.location.hash.lastIndexOf('/');
  const page = window.location.hash.substring(slashIndex + 1);
  return parseInt(page, 10);
}

export function getLatticeConfigBaseUrl() :string {

  // TODO: this probably doesn't belong here, also hardcoded strings == not great
  let baseUrl = 'localhost';
  if (!__ENV_DEV__) {
    baseUrl = window.location.host.startsWith('staging') ? 'staging' : 'production';
  }
  return baseUrl;
}

export function resetLatticeConfig() :void {

  Lattice.configure({
    authToken: AuthUtils.getAuthToken(),
    baseUrl: getLatticeConfigBaseUrl(),
  });
}
