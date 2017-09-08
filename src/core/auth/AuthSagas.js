/*
 * @flow
 */

import { push } from 'react-router-redux';
import { call, put, take } from 'redux-saga/effects';

import * as RoutePaths from '../router/RoutePaths';
import * as Utils from '../../shared/Utils';

import * as Auth0 from './Auth0';
import * as AuthActionFactory from './AuthActionFactory';
import * as AuthActionTypes from './AuthActionTypes';
import * as AuthUtils from './AuthUtils';

export function* watchAuthAttempt() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_ATTEMPT);
    try {
      /*
       * our attempt to authenticate has succeeded. now, we need to store the Auth0 id token and configure lattice
       * before dispatching AUTH_SUCCESS in order to guarantee that AuthRoute will receive the correct props in the
       * next pass through its lifecycle.
       */
      const authToken :string = yield call(Auth0.authenticate);
      yield call(AuthUtils.storeAuthToken, authToken);
      yield call(Utils.configureLattice, authToken);
      yield put(AuthActionFactory.authSuccess());
    }
    catch (error) {
      // TODO: need better error handling depending on the error that comes through
      yield put(AuthActionFactory.authFailure(error));
      Auth0.getAuth0LockInstance().show();
    }
  }
}

export function* watchAuthSuccess() :Generator<> {

  while (true) {
    const { authToken } = yield take(AuthActionTypes.AUTH_SUCCESS);
    /*
     * AUTH_SUCCESS will be dispatched in one of two possible scenarios:
     *
     *   1. the user is not authenticated, which means the Auth0 id token either is not stored locally or is expired.
     *      in this scenario, AUTH_ATTEMPT *will* be dispatched, which means AuthUtils.storeAuthToken() and
     *      Utils.configureLattice() will have already been invoked, so we don't need to do anything else here.
     *
     *   2. the user is already authenticated, which means the Auth0 id token is already stored locally, which means
     *      we don't need to dispatch AUTH_ATTEMPT, which means AuthRoute is able to pass along the Auth0 id token
     *      via componentWillMount(). in this scenario, AUTH_ATTEMPT *will not* be dispatched, but we still need
     *      to invoke Utils.configureLattice().
     */
    if (authToken) {
      yield call(Utils.configureLattice, authToken);
    }
  }
}

export function* watchAuthExpired() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_EXPIRED);
    yield call(AuthUtils.clearAuthToken);
  }
}

export function* watchAuthFailure() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_FAILURE);
    yield call(AuthUtils.clearAuthToken);
  }
}

export function* watchLogout() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.LOGOUT);
    yield call(AuthUtils.clearAuthToken);
    yield put(push(RoutePaths.LOGIN));
  }
}
