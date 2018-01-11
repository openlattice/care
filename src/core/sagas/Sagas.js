/*
 * @flow
 */

import { AuthSagas } from 'lattice-auth';
import {
  AppApiSagas,
  DataApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas,
  SyncApiSagas
} from 'lattice-sagas';
import { fork } from 'redux-saga/effects';

import * as AppSagas from '../../containers/form/AppSagas';
import * as FollowUpReportSagas from '../../containers/followup/FollowUpReportSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';

export default function* sagas() :Generator<*, *, *> {

  yield [
    // AuthSagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // LatticeSagas
    fork(AppApiSagas.getAppWatcher),
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),
    fork(DataApiSagas.acquireSyncTicketWatcher),
    fork(DataApiSagas.createEntityAndAssociationDataWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(SearchApiSagas.searchEntityNeighborsWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),
    fork(SyncApiSagas.getCurrentSyncIdWatcher),

    // Follow-Up Report Sagas
    fork(FollowUpReportSagas.submitFollowUpReportWatcher),

    // Report Sagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadAppConfigsWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumerNeighborsWatcher),
    fork(SearchSagas.searchConsumersWatcher)
  ];
}
