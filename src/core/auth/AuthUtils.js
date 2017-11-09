/*
 * @flow
 */

import decode from 'jwt-decode';
import moment from 'moment';

/*
 * https://auth0.com/docs/jwt
 * https://auth0.com/docs/tokens/id-token
 */

const ADMIN_ROLE :'admin' = 'admin';
const AUTH0_ID_TOKEN :'auth0_id_token' = 'auth0_id_token';
const AUTH0_USER_INFO :'auth0_user_info' = 'auth0_user_info';

type UserInfo = {
  id :string;
  email :string;
  picture :string;
  roles :string[];
};

export function getAuthToken() :?string {

  const idToken :?string = localStorage.getItem(AUTH0_ID_TOKEN);

  if (typeof idToken === 'string' && idToken.length) {
    return idToken;
  }

  return null;
}

export function storeAuthInfo(authInfo :?Object) :void {

  if (!authInfo || !authInfo.idToken) {
    return;
  }

  // TODO: id token validation
  localStorage.setItem(AUTH0_ID_TOKEN, authInfo.idToken);

  if (!authInfo.idTokenPayload) {
    return;
  }

  const userInfo :UserInfo = {
    id: authInfo.idTokenPayload.user_id,
    email: authInfo.idTokenPayload.email,
    picture: authInfo.idTokenPayload.picture,
    roles: authInfo.idTokenPayload.roles
  };

  localStorage.setItem(AUTH0_USER_INFO, JSON.stringify(userInfo));
}

export function clearAuthInfo() :void {

  localStorage.removeItem(AUTH0_ID_TOKEN);
  localStorage.removeItem(AUTH0_USER_INFO);
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

export function hasAuthTokenExpired(idTokenOrExpiration :?string | number) :boolean {

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

export function isAuthenticated() :boolean {

  return !hasAuthTokenExpired(getAuthTokenExpiration());
}

export function isAdmin() :boolean {

  const userInfoStr :?string = localStorage.getItem(AUTH0_USER_INFO);

  if (typeof userInfoStr !== 'string' || userInfoStr.length <= 0) {
    return false;
  }

  let hasAdminRole :boolean = false;

  const userInfo :UserInfo = JSON.parse(userInfoStr);
  if (userInfo && userInfo.roles && userInfo.roles.length > 0) {
    userInfo.roles.forEach((role :string) => {
      if (role === ADMIN_ROLE) {
        hasAdminRole = true;
      }
    });
  }

  return hasAdminRole;
}
