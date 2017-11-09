/*
 * @flow
 */

const AUTH_ATTEMPT :'AUTH_ATTEMPT' = 'AUTH_ATTEMPT';
const AUTH_SUCCESS :'AUTH_SUCCESS' = 'AUTH_SUCCESS';
const AUTH_FAILURE :'AUTH_FAILURE' = 'AUTH_FAILURE';
const AUTH_EXPIRED :'AUTH_EXPIRED' = 'AUTH_EXPIRED';

function authAttempt() :Object {

  return {
    type: AUTH_ATTEMPT
  };
}

function authExpired() :Object {

  return {
    type: AUTH_EXPIRED
  };
}

function authFailure(error :any) :Object {

  return {
    error,
    type: AUTH_FAILURE
  };
}

function authSuccess(authToken :?string) :Object {

  return {
    authToken,
    type: AUTH_SUCCESS
  };
}

const LOGIN :'LOGIN' = 'LOGIN';
const LOGOUT :'LOGOUT' = 'LOGOUT';

function login() :Object {

  return {
    type: LOGIN
  };
}

function logout() :Object {

  return {
    type: LOGOUT
  };
}

export {
  AUTH_ATTEMPT,
  AUTH_EXPIRED,
  AUTH_FAILURE,
  AUTH_SUCCESS,
  LOGIN,
  LOGOUT
};

export {
  authAttempt,
  authExpired,
  authFailure,
  authSuccess,
  login,
  logout
};
