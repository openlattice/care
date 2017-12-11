/*
 * @flow
 */

import { fork } from 'redux-saga/effects';

import {
  AppApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas
} from 'lattice-sagas';

import * as AuthSagas from '../auth/AuthSagas';
import * as LatticeSagas from '../lattice/LatticeSagas';

import * as AppSagas from '../../containers/form/AppSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';

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
    fork(AppApiSagas.getAppWatcher),
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(LatticeSagas.acquireSyncTicketWatcher),
    fork(LatticeSagas.createEntityAndAssociationDataWatcher),
    fork(LatticeSagas.fetchCurrentSyncIdWatcher),
    fork(LatticeSagas.fetchEntitySetWatcher),
    fork(LatticeSagas.fetchEntitySetIdWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // Report Sagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadAppConfigsWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumersWatcher)
  ];
}
