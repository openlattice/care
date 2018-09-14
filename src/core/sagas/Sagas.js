/*
 * @flow
 */

import { AuthSagas } from 'lattice-auth';
import {
  AppApiSagas,
  DataApiSagas,
  DataIntegrationApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas,
} from 'lattice-sagas';
import { all, fork } from 'redux-saga/effects';

import * as AppSagas from '../../containers/app/AppSagas';
import * as FollowUpReportSagas from '../../containers/followup/FollowUpReportSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // "lattice-auth" sagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // "lattice-sagas" sagas
    fork(AppApiSagas.getAppWatcher),
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),
    fork(DataApiSagas.getEntitySetDataWatcher),
    fork(DataIntegrationApiSagas.createEntityAndAssociationDataWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(SearchApiSagas.searchEntityNeighborsWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // Follow-Up Report Sagas
    fork(FollowUpReportSagas.submitFollowUpReportWatcher),

    // Report Sagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.switchOrganizationWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumerNeighborsWatcher),
    fork(SearchSagas.searchConsumersWatcher)
  ]);
}
