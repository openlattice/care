/*
 * @flow
 */

import { fork } from 'redux-saga/effects';

import * as AuthSagas from '../auth/AuthSagas';
import * as LatticeSagas from '../lattice/LatticeSagas';

import * as EntitySetsSagas from '../../containers/form/EntitySetsSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';

export default function* sagas() :Generator<*, *, *> {

  yield [
    // AuthSagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogin),
    fork(AuthSagas.watchLogout),

    // LatticeSagas
    fork(LatticeSagas.acquireSyncTicketWatcher),
    fork(LatticeSagas.createEntityAndAssociationDataWatcher),
    fork(LatticeSagas.fetchCurrentSyncIdWatcher),
    fork(LatticeSagas.fetchEntityDataModelProjectionWatcher),
    fork(LatticeSagas.fetchEntitySetWatcher),
    fork(LatticeSagas.fetchEntitySetIdWatcher),
    fork(LatticeSagas.fetchEntityTypeWatcher),
    fork(LatticeSagas.fetchPropertyTypeWatcher),
    fork(LatticeSagas.fetchPropertyTypesWatcher),

    // Report Sagas
    fork(EntitySetsSagas.loadDataModelWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher)
  ];
}
