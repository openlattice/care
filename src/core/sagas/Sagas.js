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

import * as AuthorizeSagas from './authorize/AuthorizeSagas';
import * as DataSagas from './data/DataSagas';

import * as AboutSagas from '../../containers/profile/edit/about/AboutSagas';
import * as AddressSagas from '../../containers/profile/edit/basicinformation/sagas/AddressSagas';
import * as AppSagas from '../../containers/app/AppSagas';
import * as AppearanceSagas from '../../containers/profile/edit/basicinformation/sagas/AppearanceSagas';
import * as BasicInformationSagas from '../../containers/profile/edit/basicinformation/sagas/BasicInformationSagas';
import * as ContactsSagas from '../../containers/profile/edit/contacts/ContactsSagas';
import * as DashboardSagas from '../../containers/dashboard/DashboardSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
import * as IssueSagas from '../../containers/issues/issue/IssueSagas';
import * as IssuesSagas from '../../containers/issues/IssuesSagas';
import * as LongBeachLocationsSagas from '../../longbeach/location/LongBeachLocationsSagas';
import * as LongBeachPeopleSagas from '../../longbeach/people/LongBeachPeopleSagas';
import * as LongBeachProfileSagas from '../../longbeach/profile/LongBeachProfileSagas';
import * as LongBeachProviderSagas from '../../longbeach/provider/LongBeachProviderSagas';
// eslint-disable-next-line max-len
import * as OfficerSafetyConcernsSagas from '../../containers/profile/edit/officersafety/sagas/OfficerSafetyConcernsSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as PhotosSagas from '../../containers/profile/edit/basicinformation/sagas/PhotosSagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';
import * as ReportsSagas from '../../containers/reports/ReportsSagas';
import * as ResponsePlanSagas from '../../containers/profile/edit/responseplan/ResponsePlanSagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as ScarsMarksTattoosSagas from '../../containers/profile/edit/basicinformation/sagas/ScarsMarksTattoosSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';
import * as StaffSagas from '../../containers/staff/StaffSagas';
import * as XStateCrisisReportSagas from '../../containers/reports/crisis/XStateCrisisReportSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // "lattice-auth" sagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // "lattice-sagas" sagas
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),
    fork(AppApiSagas.getAppWatcher),
    fork(DataApiSagas.deleteEntityDataWatcher),
    fork(DataApiSagas.getEntitySetDataWatcher),
    fork(DataApiSagas.updateEntityDataWatcher),
    fork(DataIntegrationApiSagas.createEntityAndAssociationDataWatcher),
    fork(EntityDataModelApiSagas.getAllPropertyTypesWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
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

    // AuthorizeSagas
    fork(AuthorizeSagas.getAuthorizationWatcher),

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
    fork(PeopleSagas.searchPeopleWatcher),
    fork(PeopleSagas.getPeoplePhotosWatcher),
    fork(PeopleSagas.getRecentIncidentsWatcher),

    // Profile Sagas
    fork(ProfileSagas.getPersonDataWatcher),
    fork(ProfileSagas.getPhysicalAppearanceWatcher),
    fork(ProfileSagas.getProfileReportsWatcher),
    fork(ProfileSagas.updateProfileAboutWatcher),

    // ReportsSagas
    fork(ReportsSagas.deleteReportWatcher),
    fork(ReportsSagas.getReportWatcher),
    fork(ReportsSagas.getReportsByDateRangeWatcher),
    fork(ReportsSagas.submitReportWatcher),
    fork(ReportsSagas.updateReportWatcher),

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

    fork(ScarsMarksTattoosSagas.getScarsMarksTattoosWatcher),
    fork(ScarsMarksTattoosSagas.submitScarsMarksTattoosWatcher),
    fork(ScarsMarksTattoosSagas.updateScarsMarksTattoosWatcher),

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

    // IssueSagas
    fork(IssueSagas.selectIssueWatcher),
    fork(IssueSagas.setIssueStatusWatcher),
    fork(IssueSagas.submitIssueWatcher),
    fork(IssueSagas.updateIssueWatcher),

    // IssuesSagas
    fork(IssuesSagas.getAllIssuesWatcher),
    fork(IssuesSagas.getMyOpenIssuesWatcher),
    fork(IssuesSagas.getReportedByMeWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumersWatcher),

    /* <===== BEGIN LONG BEACH HACK =====> */
    fork(LongBeachPeopleSagas.searchLBPeopleWatcher),
    fork(LongBeachPeopleSagas.getLBPeopleStayAwayWatcher),
    fork(LongBeachPeopleSagas.getLBStayAwayLocationsWatcher),
    fork(LongBeachPeopleSagas.getLBPeoplePhotosWatcher),

    fork(LongBeachLocationsSagas.getGeoOptionsWatcher),
    fork(LongBeachLocationsSagas.searchLBLocationsWatcher),

    fork(LongBeachProfileSagas.getLBProfileWatcher),
    fork(LongBeachProfileSagas.getLBProfileNeighborsWatcher),

    fork(LongBeachProviderSagas.getLBProvidersWatcher),
    /* <===== END LONG BEACH HACK =====> */

    fork(XStateCrisisReportSagas.submitCrisisReportWatcher),
  ]);
}
