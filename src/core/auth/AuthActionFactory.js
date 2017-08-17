/*
 * @flow
 */

import * as AuthActionTypes from './AuthActionTypes';

export function authenticate() :Object {

  return {
    type: AuthActionTypes.AUTHENTICATE
  };
}

export function authenticated(authInfo :Object) :Object {

  return {
    type: AuthActionTypes.AUTHENTICATED,
    authInfo
  };
}

export function authError(error :any) :Object {

  return {
    type: AuthActionTypes.AUTH_ERROR,
    error
  };
}

export function configureLattice() :Object {

  return {
    type: AuthActionTypes.CONFIGURE_LATTICE
  };
}

export function loggedIn() :Object {

  return {
    type: AuthActionTypes.LOGGED_IN
  };
}

export function logout() :Object {

  return {
    type: AuthActionTypes.LOGOUT
  };
}
