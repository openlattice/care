/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import {
  AppApiSagas,
  DataApiSagas,
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
import * as ContactSagas from '../../containers/profile/edit/basicinformation/sagas/ContactSagas';
import * as CrisisReportSagas from '../../containers/reports/crisis/CrisisReportSagas';
import * as DashboardSagas from '../../containers/dashboard/DashboardSagas';
import * as DocumentsSagas from '../../containers/documents/DocumentsSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
import * as EmergencyContactsSagas from '../../containers/profile/edit/contacts/EmergencyContactsSagas';
import * as EncampmentSagas from '../../longbeach/location/encampment/EncampmentsSagas';
import * as ExploreSagas from '../../containers/explore/ExploreSagas';
import * as ExportSagas from '../../containers/reports/export/ExportSagas';
import * as FormSchemasSagas from '../../containers/reports/FormSchemasSagas';
import * as IssueSagas from '../../containers/issues/issue/IssueSagas';
import * as IssuesSagas from '../../containers/issues/IssuesSagas';
import * as LongBeachLocationsSagas from '../../longbeach/location/stayaway/LongBeachLocationsSagas';
import * as LongBeachPeopleSagas from '../../longbeach/people/LongBeachPeopleSagas';
import * as LongBeachProfileSagas from '../../longbeach/profile/LongBeachProfileSagas';
import * as LongBeachProviderSagas from '../../longbeach/provider/LongBeachProviderSagas';
// eslint-disable-next-line max-len
import * as OfficerSafetyConcernsSagas from '../../containers/profile/edit/officersafety/sagas/OfficerSafetyConcernsSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as PhotosSagas from '../../containers/profile/edit/basicinformation/sagas/PhotosSagas';
import * as ProfileDocumentsSagas from '../../containers/profile/edit/documents/ProfileDocumentsSagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';
import * as RecentInteractionSagas from '../../containers/reports/interaction/RecentInteractionSagas';
import * as ReportsSagas from '../../containers/reports/ReportsSagas';
import * as ResponsePlanSagas from '../../containers/profile/edit/responseplan/ResponsePlanSagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as ScarsMarksTattoosSagas from '../../containers/profile/edit/basicinformation/sagas/ScarsMarksTattoosSagas';
import * as SettingsSagas from '../../containers/settings/sagas';
import * as StaffSagas from '../../containers/staff/StaffSagas';
import * as SubscriptionSagas from '../../containers/subscriptions/SubscriptionSagas';
import * as SymptomsReportSagas from '../../containers/reports/symptoms/SymptomsReportSagas';
import * as VisibilitySagas from '../../containers/profile/edit/visibility/VisibilitySagas';

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
    fork(EntityDataModelApiSagas.getAllPropertyTypesWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.loadHospitalsWatcher),
    fork(AppSagas.switchOrganizationWatcher),

    fork(SettingsSagas.getAppSettingsWatcher),
    fork(SettingsSagas.updateAppSettingsWatcher),

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

    // Documents Sagas
    fork(DocumentsSagas.loadUsedTagsWatcher),
    fork(DocumentsSagas.uploadDocumentsWatcher),

    // Downloads Sagas
    fork(DownloadsSagas.downloadFormsWatcher),

    // People Sagas
    fork(PeopleSagas.searchPeopleWatcher),
    fork(PeopleSagas.getPeoplePhotosWatcher),
    fork(PeopleSagas.getRecentIncidentsWatcher),
    fork(PeopleSagas.submitNewPersonWatcher),

    // Profile Sagas
    fork(ProfileSagas.getPersonDataWatcher),
    fork(ProfileSagas.getPhysicalAppearanceWatcher),
    fork(ProfileSagas.getProfileCitationsWatcher),
    fork(ProfileSagas.getProfilePoliceCADWatcher),
    fork(ProfileSagas.getProfileReportsWatcher),
    fork(ProfileSagas.updateProfileAboutWatcher),

    // ReportsSagas
    fork(ReportsSagas.deleteReportWatcher),
    fork(ReportsSagas.getReportWatcher),
    fork(ReportsSagas.getReportsByDateRangeWatcher),
    fork(ReportsSagas.getReportsByDateRangeV2Watcher),
    fork(ReportsSagas.submitReportWatcher),
    fork(ReportsSagas.updateReportWatcher),
    fork(ReportsSagas.getIncidentReportsWatcher),
    fork(ReportsSagas.getProfileIncidentsWatcher),
    fork(ReportsSagas.getIncidentReportsSummaryWatcher),
    fork(ReportsSagas.getReportsBehaviorAndSafetyWatcher),
    fork(ReportsSagas.getReportersForReportsWatcher),

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

    fork(ContactSagas.getContactWatcher),
    fork(ContactSagas.submitContactWatcher),
    fork(ContactSagas.updateContactWatcher),

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

    fork(EmergencyContactsSagas.getEmergencyContactsWatcher),
    fork(EmergencyContactsSagas.submitEmergencyContactsWatcher),
    fork(EmergencyContactsSagas.updateEmergencyContactWatcher),
    fork(EmergencyContactsSagas.deleteEmergencyContactWatcher),

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

    fork(CrisisReportSagas.addOptionalCrisisReportContentWatcher),
    fork(CrisisReportSagas.deleteCrisisReportContentWatcher),
    fork(CrisisReportSagas.deleteCrisisReportWatcher),
    fork(CrisisReportSagas.getCrisisReportV2Watcher),
    fork(CrisisReportSagas.getCrisisReportWatcher),
    fork(CrisisReportSagas.getReportsNeighborsWatcher),
    fork(CrisisReportSagas.getReportsV2NeighborsWatcher),
    fork(CrisisReportSagas.getSubjectOfIncidentWatcher),
    fork(CrisisReportSagas.submitCrisisReportV2Watcher),
    fork(CrisisReportSagas.submitCrisisReportWatcher),
    fork(CrisisReportSagas.updateCrisisReportWatcher),

    fork(FormSchemasSagas.getFormSchemaWatcher),
    fork(FormSchemasSagas.submitFormSchemaWatcher),

    fork(EncampmentSagas.addPersonToEncampmentWatcher),
    fork(EncampmentSagas.getEncampmentOccupantsWatcher),
    fork(EncampmentSagas.getEncampmentPeopleOptionsWatcher),
    fork(EncampmentSagas.getGeoOptionsWatcher),
    fork(EncampmentSagas.removePersonFromEncampmentWatcher),
    fork(EncampmentSagas.searchEncampmentLocationsWatcher),
    fork(EncampmentSagas.submitEncampmentWatcher),

    fork(SymptomsReportSagas.getSymptomsReportWatcher),
    fork(SymptomsReportSagas.getAllSymptomsReportsWatcher),
    fork(SymptomsReportSagas.submitSymptomsReportWatcher),
    fork(SymptomsReportSagas.updateSymptomsReportWatcher),

    fork(RecentInteractionSagas.getRecentInteractionsWatcher),
    fork(RecentInteractionSagas.submitRecentInteractionWatcher),

    // SubscriptionSagas
    fork(SubscriptionSagas.getSubscriptionsWatcher),
    fork(SubscriptionSagas.createSubscriptionWatcher),
    fork(SubscriptionSagas.updateSubscriptionWatcher),
    fork(SubscriptionSagas.expireSubscriptionWatcher),

    // VisibilitySagas
    fork(VisibilitySagas.getProfileVisibilityWatcher),
    fork(VisibilitySagas.putProfileVisibilityWatcher),

    fork(ExploreSagas.exploreContactInformationWatcher),
    fork(ExploreSagas.exploreFileWatcher),
    fork(ExploreSagas.exploreIdentifyingCharacteristicsWatcher),
    fork(ExploreSagas.exploreIncidentsWatcher),
    fork(ExploreSagas.exploreLocationWatcher),
    fork(ExploreSagas.explorePeopleWatcher),
    fork(ExploreSagas.explorePhysicalAppearancesWatcher),
    fork(ExploreSagas.getIncludedPeopleWatcher),
    fork(ExploreSagas.getInvolvedPeopleWatcher),
    fork(ExploreSagas.getObservedInPeopleWatcher),
    fork(ExploreSagas.explorePoliceCADWatcher),
    fork(ExploreSagas.exploreCitationsWatcher),

    fork(ProfileDocumentsSagas.getProfileDocumentsWatcher),

    fork(ExportSagas.exportCrisisCSVByDateRangeWatcher),
    fork(ExportSagas.exportCrisisXMLWatcher),
    fork(ExportSagas.exportCrisisXMLByDateRangeWatcher),
  ]);
}
