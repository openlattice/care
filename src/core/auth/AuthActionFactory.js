/*
 * @flow
 */

import * as AuthActionTypes from './AuthActionTypes';

export function authAttempt() :Object {

  return {
    type: AuthActionTypes.AUTH_ATTEMPT
  };
}

export function authSuccess(authToken :?string) :Object {

  return {
    type: AuthActionTypes.AUTH_SUCCESS,
    authToken
  };
}

export function authFailure(error :any) :Object {

  return {
    type: AuthActionTypes.AUTH_FAILURE,
    error
  };
}

export function authExpired() :Object {

  return {
    type: AuthActionTypes.AUTH_EXPIRED
  };
}

export function logout() :Object {

  return {
    type: AuthActionTypes.LOGOUT
  };
}
