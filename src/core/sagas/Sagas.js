/*
 * @flow
 */

import { fork } from 'redux-saga/effects';

import * as AuthSagas from '../auth/AuthSagas';

export default function* sagas() :Generator<> {

  yield [
    fork(AuthSagas.watchAuthenticate),
    fork(AuthSagas.watchAuthenticated),
    fork(AuthSagas.watchAuthError),
    fork(AuthSagas.watchConfigureLattice),
    fork(AuthSagas.watchLogout)
  ];
}
