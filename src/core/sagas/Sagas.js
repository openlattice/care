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
import { fork } from 'redux-saga/effects';

import * as AppSagas from '../../containers/form/AppSagas';
import * as FollowUpReportSagas from '../../containers/followup/FollowUpReportSagas';
import * as ReportSagas from '../../containers/form/ReportSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';
import * as ConsumerSummarySagas from '../../containers/consumersummary/ConsumerSummarySagas';

export default function* sagas() :Generator<*, *, *> {

  yield [
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
    fork(AppSagas.loadAppConfigsWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.selectOrganizationWatcher),
    fork(ReportSagas.hardRestartWatcher),
    fork(ReportSagas.submitReportWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumerNeighborsWatcher),
    fork(SearchSagas.searchConsumersWatcher),

    // ConsumerSummarySagas
    fork(ConsumerSummarySagas.getBHRReportsWatcher),
    fork(ConsumerSummarySagas.getBHRReportDataWatcher)
  ];
}
