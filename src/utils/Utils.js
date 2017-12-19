/*
 * @flow
 */

import Lattice from 'lattice';
import isUUID from 'validator/lib/isUUID';

// injected by Webpack.DefinePlugin
declare var __DEV__;

export function configureLattice(authToken :?string) :void {

  const host :string = window.location.host;
  const hostName :string = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
  const baseUrl :string = (__DEV__) ? 'http://localhost:8080' : `https://api.${hostName}`;

  Lattice.configure({ authToken, baseUrl });
}

export function isValidUuid(value :any) :boolean {

  return isUUID(value);
}

export function randomId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2);
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
