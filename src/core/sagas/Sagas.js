/*
 * @flow
 */

import { fork } from 'redux-saga/effects';

import * as AuthSagas from '../auth/AuthSagas';

export default function* sagas() :Generator<> {

  yield [
    fork(AuthSagas.watchAuthenticated),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthTokenExpired),
    fork(AuthSagas.watchLogout)
  ];
}
