/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import {
  AppApiSagas,
  DataApiSagas,
  DataIntegrationApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas,
} from 'lattice-sagas';

import * as RoutingSagas from '../router/RoutingSagas';

import * as AppSagas from '../../containers/app/AppSagas';
import * as DashboardSagas from '../../containers/dashboard/DashboardSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as ReportsSagas from '../../containers/reports/ReportsSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';
import * as SubmitSagas from '../../utils/submit/SubmitSagas';
import * as SubscribeSagas from '../../containers/subscribe/SubscribeSagas';

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
    fork(DataApiSagas.deleteEntityWatcher),
    fork(DataApiSagas.getEntitySetDataWatcher),
    fork(DataApiSagas.updateEntityDataWatcher),
    fork(DataIntegrationApiSagas.createEntityAndAssociationDataWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(EntityDataModelApiSagas.getAllPropertyTypesWatcher),
    fork(SearchApiSagas.searchEntityNeighborsWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // AppSagas
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.switchOrganizationWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),

    // Dashboard Sagas
    fork(DashboardSagas.loadDashboardDataWatcher),

    // Downloads Sagas
    fork(DownloadsSagas.downloadFormsWatcher),

    // People Sagas
    fork(PeopleSagas.editPersonWatcher),
    fork(PeopleSagas.searchPeopleWatcher),

    // ReportsSagas
    fork(ReportsSagas.deleteReportWatcher),
    fork(ReportsSagas.getReportNeighborsWatcher),
    fork(ReportsSagas.getReportsWatcher),
    fork(ReportsSagas.updateReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumerNeighborsWatcher),
    fork(SearchSagas.searchConsumersWatcher),

    // SubmitSagas
    fork(SubmitSagas.submitWatcher),

    // SubscribeSagas
    fork(SubscribeSagas.getSubscriptionsWatcher),
    fork(SubscribeSagas.createSubscriptionWatcher),
    fork(SubscribeSagas.updateSubscriptionWatcher),
    fork(SubscribeSagas.expireSubscriptionWatcher)
  ]);
}
