/*
 * @flow
 */

import { push } from 'react-router-redux';
import { call, put, take } from 'redux-saga/effects';

import * as RoutePaths from '../router/RoutePaths';
import * as Utils from '../../shared/Utils';

import * as AuthActionFactory from './AuthActionFactory';
import * as AuthActionTypes from './AuthActionTypes';
import * as AuthUtils from './AuthUtils';

export function* watchAuthenticated() :Generator<> {

  while (true) {
    const { authToken } = yield take(AuthActionTypes.AUTHENTICATED);
    yield call(AuthUtils.storeAuthToken, authToken);
    yield call(Utils.configureLattice, authToken);
    yield put(AuthActionFactory.authSuccess());
  }
}

export function* watchAuthFailure() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_FAILURE);
    yield put(AuthActionFactory.logout());
  }
}

export function* watchAuthTokenExpired() :Generator<> {

  while (true) {
    yield take(AuthActionTypes.AUTH_TOKEN_EXPIRED);
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
