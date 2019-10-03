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

import * as AboutSagas from '../../containers/profile/edit/about/AboutSagas';
import * as AddressSagas from '../../containers/profile/edit/basicinformation/sagas/AddressSagas';
import * as AppearanceSagas from '../../containers/profile/edit/basicinformation/sagas/AppearanceSagas';
import * as AppSagas from '../../containers/app/AppSagas';
import * as BasicInformationSagas from '../../containers/profile/edit/basicinformation/sagas/BasicInformationSagas';
import * as DashboardSagas from '../../containers/dashboard/DashboardSagas';
import * as DataSagas from './data/DataSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
// eslint-disable-next-line max-len
import * as OfficerSafetyConcernsSagas from '../../containers/profile/edit/officersafety/sagas/OfficerSafetyConcernsSagas';
import * as ContactsSagas from '../../containers/profile/edit/contacts/ContactsSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as PhotosSagas from '../../containers/profile/edit/basicinformation/sagas/PhotosSagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';
import * as ReportsSagas from '../../containers/reports/ReportsSagas';
import * as ResponsePlanSagas from '../../containers/profile/edit/responseplan/ResponsePlanSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';
import * as StaffSagas from '../../containers/staff/StaffSagas';
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
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.switchOrganizationWatcher),

    // DataSagas
    fork(DataSagas.createOrReplaceAssociationWatcher),
    fork(DataSagas.deleteBulkEntitiesWatcher),
    fork(DataSagas.submitDataGraphWatcher),
    fork(DataSagas.submitPartialReplaceWatcher),

    // StaffSagas
    fork(StaffSagas.getCurrentUserStaffMemberDataWatcher),
    fork(StaffSagas.getResponsibleUserOptionsWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToPathWatcher),

    // Dashboard Sagas
    fork(DashboardSagas.loadDashboardDataWatcher),

    // Downloads Sagas
    fork(DownloadsSagas.downloadFormsWatcher),

    // People Sagas
    fork(PeopleSagas.editPersonWatcher),
    fork(PeopleSagas.searchPeopleWatcher),
    fork(PeopleSagas.getPeoplePhotosWatcher),

    // Profile Sagas
    fork(ProfileSagas.getPersonDataWatcher),
    fork(ProfileSagas.getPhysicalApperanceWatcher),
    fork(ProfileSagas.getProfileReportsWatcher),
    fork(ProfileSagas.updateProfileAboutWatcher),

    // ReportsSagas
    fork(ReportsSagas.deleteReportWatcher),
    fork(ReportsSagas.getReportsByDateRangeWatcher),
    fork(ReportsSagas.updateReportWatcher),
    fork(ReportsSagas.getReportWatcher),

    // ResponsePlanSagas
    fork(ResponsePlanSagas.deleteInteractionStrategiesWatcher),
    fork(ResponsePlanSagas.getResponsePlanWatcher),
    fork(ResponsePlanSagas.submitResponsePlanWatcher),
    fork(ResponsePlanSagas.updateResponsePlanWatcher),

    // BasicInformationSagas
    fork(BasicInformationSagas.getBasicInformationWatcher),
    fork(BasicInformationSagas.getBasicsWatcher),
    fork(BasicInformationSagas.updateBasicsWatcher),

    fork(AppearanceSagas.getAppearanceWatcher),
    fork(AppearanceSagas.submitAppearanceWatcher),
    fork(AppearanceSagas.updateAppearanceWatcher),

    fork(AddressSagas.getAddressWatcher),
    fork(AddressSagas.submitAddressWatcher),
    fork(AddressSagas.updateAddressWatcher),

    fork(PhotosSagas.getPhotosWatcher),
    fork(PhotosSagas.submitPhotosWatcher),
    fork(PhotosSagas.updatePhotoWatcher),

    // OfficerSafetyConcernsSagas
    fork(OfficerSafetyConcernsSagas.getOfficerSafetyWatcher),
    fork(OfficerSafetyConcernsSagas.getOfficerSafetyConcernsWatcher),
    fork(OfficerSafetyConcernsSagas.submitOfficerSafetyConcernsWatcher),
    fork(OfficerSafetyConcernsSagas.updateOfficerSafetyConcernsWatcher),
    fork(OfficerSafetyConcernsSagas.deleteOfficerSafetyConcernsWatcher),

    fork(ContactsSagas.getContactsWatcher),
    fork(ContactsSagas.submitContactsWatcher),
    fork(ContactsSagas.updateContactWatcher),
    fork(ContactsSagas.deleteContactWatcher),

    fork(AboutSagas.getAboutPlanWatcher),
    fork(AboutSagas.getResponsibleUserWatcher),
    fork(AboutSagas.submitAboutPlanWatcher),
    fork(AboutSagas.updateAboutPlanWatcher),

    // SearchSagas
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
