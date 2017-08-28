/*
 * @flow
 */

import * as AuthActionTypes from './AuthActionTypes';

export function authenticated(authToken :string) :Object {

  return {
    type: AuthActionTypes.AUTHENTICATED,
    authToken
  };
}

export function authSuccess() :Object {

  return {
    type: AuthActionTypes.AUTH_SUCCESS
  };
}

export function authFailure(error :any) :Object {

  return {
    type: AuthActionTypes.AUTH_FAILURE,
    error
  };
}

export function authTokenExpired() :Object {

  return {
    type: AuthActionTypes.AUTH_TOKEN_EXPIRED
  };
}

export function logout() :Object {

  return {
    type: AuthActionTypes.LOGOUT
  };
}
