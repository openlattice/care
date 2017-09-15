/*
 * @flow
 */

import decode from 'jwt-decode';
import moment from 'moment';

/*
 * https://auth0.com/docs/jwt
 * https://auth0.com/docs/tokens/id-token
 */

const AUTH0_ID_TOKEN :string = 'id_token';
const AUTH0_ID_TOKEN_EXP :string = 'id_token_exp';

export function getAuthToken() :?string {

  const idToken :?string = localStorage.getItem(AUTH0_ID_TOKEN);

  if (typeof idToken === 'string' && idToken.length) {
    return idToken;
  }

  return null;
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
  localStorage.removeItem(AUTH0_ID_TOKEN_EXP);
}


export function getAuthTokenExpiration(maybeIdToken :?string) :number {

  let idToken :?string = maybeIdToken;

  if (!idToken) {
    idToken = getAuthToken();
  }

  if (!idToken) {
    return -1;
  }

  try {
    // it looks like Auth0 JWT tokens set the expiration date as seconds since the Unix Epoch
    // https://auth0.com/docs/tokens/id-token#id-token-payload
    const idTokenDecoded :Object = decode(idToken);
    return moment.unix(idTokenDecoded.exp).valueOf();
  }
  catch (e) {
    return -1;
  }
}

export function hasAuthTokenExpired(idTokenOrExpiration :string | number) :boolean {

  if (!idTokenOrExpiration || idTokenOrExpiration === -1) {
    return true;
  }

  try {
    if (typeof idTokenOrExpiration === 'number' && isFinite(idTokenOrExpiration)) {
      // idTokenOrExpiration is the expiration
      return moment().isAfter(idTokenOrExpiration);
    }
    else if (typeof idTokenOrExpiration === 'string' && idTokenOrExpiration.length) {
      // idTokenOrExpiration is the id token
      const idTokenDecoded = decode(idTokenOrExpiration);
      const expiration = moment.unix(idTokenDecoded.exp);
      return moment().isAfter(expiration);
    }
    return true;
  }
  catch (e) {
    return true;
  }
}
