/*
 * @flow
 */

import { AppApiSagas, EntityDataModelApiSagas } from 'lattice-sagas';
import { fork } from 'redux-saga/effects';

import * as AuthSagas from '../auth/AuthSagas';
import * as LatticeSagas from '../lattice/LatticeSagas';

import * as AppSagas from '../../containers/form/AppSagas';
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
    fork(LatticeSagas.fetchEntitySetWatcher),
    fork(LatticeSagas.fetchEntitySetIdWatcher),

    // Report Sagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadAppConfigsWatcher),
    fork(EntitySetsSagas.loadDataModelWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // AppApi Sagas
    fork(AppApiSagas.getAppWatcher),
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),

    // EntityDataModelApiSagas
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher)
  ];
}
