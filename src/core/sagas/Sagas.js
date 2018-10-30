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

import * as RoutingSagas from '../router/RoutingSagas';

import * as AppSagas from '../../containers/app/AppSagas';
import * as DashboardSagas from '../../containers/dashboard/DashboardSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
import * as FollowUpReportSagas from '../../containers/followup/FollowUpReportSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';
import * as ReportsSagas from '../../containers/reports/ReportsSagas';
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
    fork(DataApiSagas.clearEntityFromEntitySetWatcher),
    fork(DataApiSagas.getEntitySetDataWatcher),
    fork(DataApiSagas.updateEntityDataWatcher),
    fork(DataIntegrationApiSagas.createEntityAndAssociationDataWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(EntityDataModelApiSagas.getAllPropertyTypesWatcher),
    fork(SearchApiSagas.searchEntityNeighborsWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    // Dashboard Sagas
    fork(DashboardSagas.loadDashboardDataWatcher),

    // Downloads Sagas
    fork(DownloadsSagas.downloadFormsWatcher),

    // Follow-Up Report Sagas
    fork(FollowUpReportSagas.submitFollowUpReportWatcher),

    // People Sagas
    fork(PeopleSagas.editPersonWatcher),
    fork(PeopleSagas.searchPeopleWatcher),

    // Report Sagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.switchOrganizationWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumerNeighborsWatcher),
    fork(SearchSagas.searchConsumersWatcher),

    // ReportsSagas
    fork(ReportsSagas.deleteReportWatcher),
    fork(ReportsSagas.getReportNeighborsWatcher),
    fork(ReportsSagas.getReportsWatcher),
    fork(ReportsSagas.updateReportWatcher),
  ]);
}
