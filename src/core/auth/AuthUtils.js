/*
 * @flow
 */

import decode from 'jwt-decode';
import moment from 'moment';

const AUTH0_ID_TOKEN :string = 'AUTH0_ID_TOKEN';

export function getAuthToken() :?string {

  const idToken :?string = localStorage.getItem(AUTH0_ID_TOKEN);

  if (!idToken || !idToken.length) {
    return null;
  }

  return idToken;
}

export function storeAuthToken(idToken :?string) :void {

  if (!idToken) {
    return;
  }

  // TODO: validation?
  localStorage.setItem(AUTH0_ID_TOKEN, idToken);
}

export function clearAuthToken() :void {

  localStorage.removeItem(AUTH0_ID_TOKEN);
}

export function isAuthTokenExpired(idToken :?string) :boolean {

  if (!idToken) {
    return true;
  }

  const idTokenDecoded = decode(idToken);

  // it looks like Auth0 JWT tokens store the expiration date as seconds since the Unix Epoch
  // https://auth0.com/docs/tokens/id-token#id-token-payload
  const expiration = moment.unix(idTokenDecoded.exp);
  return moment().isAfter(expiration);
}

export function isLoggedIn() :boolean {

  return !isAuthTokenExpired(getAuthToken());
}
