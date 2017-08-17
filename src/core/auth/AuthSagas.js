/*
 * @flow
 */

import { call, put, take } from 'redux-saga/effects';

import * as Utils from '../../shared/Utils';
import * as AuthActionFactory from './AuthActionFactory';
import * as AuthActionTypes from './AuthActionTypes';
import * as AuthUtils from './AuthUtils';

import { getAuth0LockInstance } from './Auth0';

export function* watchAuthenticate() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTHENTICATE);
    getAuth0LockInstance().show();
  }
}

export function* watchAuthenticated() :Generator<> {

  while (true) {

    const { authInfo } = yield take(AuthActionTypes.AUTHENTICATED);
    yield call(AuthUtils.storeAuthToken, authInfo.idToken);
    yield put(AuthActionFactory.configureLattice());
    yield put(AuthActionFactory.loggedIn());
    getAuth0LockInstance().hide();
  }
}

export function* watchAuthError() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_ERROR);
    yield put(AuthActionFactory.logout());
  }
}

export function* watchConfigureLattice() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.CONFIGURE_LATTICE);
    const authToken = yield call(AuthUtils.getAuthToken);
    yield call(Utils.configureLattice, authToken);
  }
}

export function* watchLogout() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.LOGOUT);
    yield call(AuthUtils.clearAuthToken);
  }
}
