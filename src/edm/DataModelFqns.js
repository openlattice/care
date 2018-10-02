/*
 * @flow
 */

import { Models } from 'lattice';

const { FullyQualifiedName } = Models;

/*
 * ReportInfoView
 */

const CAD_NUMBER_FQN = new FullyQualifiedName('bhr.cadNumber');
const COMPANION_OFFENSE_REPORT_FQN = new FullyQualifiedName('bhr.companionOffenseReport');
const COMPLAINT_NUMBER_FQN = new FullyQualifiedName('bhr.complaintNumber');
const DATE_TIME_OCCURRED_FQN = new FullyQualifiedName('bhr.datetimeOccurred');
const DATE_TIME_REPORTED_FQN = new FullyQualifiedName('bhr.datetimeReported');
const DISPATCH_REASON_FQN = new FullyQualifiedName('bhr.dispatchReason');
const INCIDENT_FQN = new FullyQualifiedName('bhr.incident');
const LOCATION_OF_INCIDENT_FQN = new FullyQualifiedName('bhr.locationOfIncident');
const ON_VIEW_FQN = new FullyQualifiedName('bhr.onView');
const POST_OF_OCCURRENCE_FQN = new FullyQualifiedName('bhr.postOfOccurrence');
const UNIT_FQN = new FullyQualifiedName('bhr.unit');

export {
  CAD_NUMBER_FQN,
  COMPANION_OFFENSE_REPORT_FQN,
  COMPLAINT_NUMBER_FQN,
  DATE_TIME_OCCURRED_FQN,
  DATE_TIME_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  INCIDENT_FQN,
  LOCATION_OF_INCIDENT_FQN,
  ON_VIEW_FQN,
  POST_OF_OCCURRENCE_FQN,
  UNIT_FQN,
};

/*
 * ConsumerInfoView
 */

const ADDRESS_FQN = new FullyQualifiedName('bhr.address');
const PHONE_FQN = new FullyQualifiedName('bhr.phone');
const MILITARY_STATUS_FQN = new FullyQualifiedName('bhr.militaryStatus');
const GENDER_FQN = new FullyQualifiedName('bhr.gender');
const RACE_FQN = new FullyQualifiedName('bhr.race');
const AGE_FQN = new FullyQualifiedName('bhr.age');
const DOB_FQN = new FullyQualifiedName('bhr.dob');
const HOMELESS_FQN = new FullyQualifiedName('bhr.homeless');
const HOMELESS_LOCATION_FQN = new FullyQualifiedName('bhr.homelessLocation');
const DRUGS_ALCOHOL_FQN = new FullyQualifiedName('bhr.drugsAlcohol');
const DRUG_TYPE_FQN = new FullyQualifiedName('bhr.drugType');
const PRESCRIBED_MEDICATION_FQN = new FullyQualifiedName('bhr.prescribedMedication');
const TAKING_MEDICATION_FQN = new FullyQualifiedName('bhr.takingMedication');
const PREV_PSYCH_ADMISSION_FQN = new FullyQualifiedName('bhr.prevPsychAdmission');
const SELF_DIAGNOSIS_FQN = new FullyQualifiedName('bhr.selfDiagnosis');
const SELF_DIAGNOSIS_OTHER_FQN = new FullyQualifiedName('bhr.selfDiagnosisOther');
const ARMED_WITH_WEAPON_FQN = new FullyQualifiedName('bhr.armedWithWeapon');
const ARMED_WEAPON_TYPE_FQN = new FullyQualifiedName('bhr.armedWeaponType');
const ACCESS_TO_WEAPONS_FQN = new FullyQualifiedName('bhr.accessToWeapons');
const ACCESSIBLE_WEAPON_TYPE_FQN = new FullyQualifiedName('bhr.accessibleWeaponType');
const OBSERVED_BEHAVIORS_FQN = new FullyQualifiedName('bhr.observedBehaviors');
const OBSERVED_BEHAVIORS_OTHER_FQN = new FullyQualifiedName('bhr.observedBehaviorsOther');
const EMOTIONAL_STATE_FQN = new FullyQualifiedName('bhr.emotionalState');
const EMOTIONAL_STATE_OTHER_FQN = new FullyQualifiedName('bhr.emotionalStateOther');
const PHOTOS_TAKEN_OF_FQN = new FullyQualifiedName('bhr.photosTakenOf');
const INJURIES_FQN = new FullyQualifiedName('bhr.injuries');
const INJURIES_OTHER_FQN = new FullyQualifiedName('bhr.injuriesOther');
const SUICIDAL_FQN = new FullyQualifiedName('bhr.suicidal');
const SUICIDAL_ACTIONS_FQN = new FullyQualifiedName('bhr.suicidalActions');
const SUICIDE_ATTEMPT_METHOD_FQN = new FullyQualifiedName('bhr.suicideAttemptMethod');
const SUICIDE_ATTEMPT_METHOD_OTHER_FQN = new FullyQualifiedName('bhr.suicideAttemptMethodOther');
const DIRECTED_AGAINST_FQN = new FullyQualifiedName('ol.directedagainst');
const DIRECTED_AGAINST_OTHER_FQN = new FullyQualifiedName('ol.directedagainstother');
const HIST_DIRECTED_AGAINST_FQN = new FullyQualifiedName('ol.historicaldirectedagainst');
const HIST_DIRECTED_AGAINST_OTHER_FQN = new FullyQualifiedName('ol.historicaldirectedagainstother');
const HISTORY_OF_VIOLENCE_FQN = new FullyQualifiedName('ol.historyofviolence');
const HISTORY_OF_VIOLENCE_TEXT_FQN = new FullyQualifiedName('ol.historyofviolencetext');
const SCALE_1_TO_10_FQN = new FullyQualifiedName('ol.scale1to10');

export {
  ADDRESS_FQN,
  PHONE_FQN,
  MILITARY_STATUS_FQN,
  GENDER_FQN,
  RACE_FQN,
  AGE_FQN,
  DOB_FQN,
  HOMELESS_FQN,
  HOMELESS_LOCATION_FQN,
  DRUGS_ALCOHOL_FQN,
  DRUG_TYPE_FQN,
  PRESCRIBED_MEDICATION_FQN,
  TAKING_MEDICATION_FQN,
  PREV_PSYCH_ADMISSION_FQN,
  SELF_DIAGNOSIS_FQN,
  SELF_DIAGNOSIS_OTHER_FQN,
  ARMED_WITH_WEAPON_FQN,
  ARMED_WEAPON_TYPE_FQN,
  ACCESS_TO_WEAPONS_FQN,
  ACCESSIBLE_WEAPON_TYPE_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OBSERVED_BEHAVIORS_OTHER_FQN,
  EMOTIONAL_STATE_FQN,
  EMOTIONAL_STATE_OTHER_FQN,
  PHOTOS_TAKEN_OF_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  SUICIDAL_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  DIRECTED_AGAINST_FQN,
  DIRECTED_AGAINST_OTHER_FQN,
  HIST_DIRECTED_AGAINST_FQN,
  HIST_DIRECTED_AGAINST_OTHER_FQN,
  HISTORY_OF_VIOLENCE_FQN,
  HISTORY_OF_VIOLENCE_TEXT_FQN,
  SCALE_1_TO_10_FQN,
};

const PERSON_DOB_FQN = new FullyQualifiedName('nc.PersonBirthDate');
const PERSON_LAST_NAME_FQN = new FullyQualifiedName('nc.PersonSurName');
const PERSON_FIRST_NAME_FQN = new FullyQualifiedName('nc.PersonGivenName');
const PERSON_MIDDLE_NAME_FQN = new FullyQualifiedName('nc.PersonMiddleName');
const PERSON_RACE_FQN = new FullyQualifiedName('nc.PersonRace');
const PERSON_SEX_FQN = new FullyQualifiedName('nc.PersonSex');
const PERSON_ID_FQN = new FullyQualifiedName('nc.SubjectIdentification');
const PERSON_PICTURE_FQN = new FullyQualifiedName('person.picture');

export {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
};

/*
 * ComplainantInfoView
 */

const COMPLAINANT_NAME_FQN = new FullyQualifiedName('bhr.complainantName');
const COMPLAINANT_ADDRESS_FQN = new FullyQualifiedName('bhr.complainantAddress');
const COMPLAINANT_RELATIONSHIP_FQN = new FullyQualifiedName('bhr.complainantConsumerRelationship');
const COMPLAINANT_PHONE_FQN = new FullyQualifiedName('bhr.complainantPhone');

export {
  COMPLAINANT_NAME_FQN,
  COMPLAINANT_ADDRESS_FQN,
  COMPLAINANT_RELATIONSHIP_FQN,
  COMPLAINANT_PHONE_FQN,
};

/*
 * DispositionInfoView
 */

const DEESCALATION_SCALE_FQN = new FullyQualifiedName('ol.deescalationscale');
const DEESCALATION_TECHNIQUES_FQN = new FullyQualifiedName('bhr.deescalationTechniques');
const DEESCALATION_TECHNIQUES_OTHER_FQN = new FullyQualifiedName('bhr.deescalationTechniquesOther');
const DISPOSITION_FQN = new FullyQualifiedName('bhr.disposition');
const HOSPITAL_TRANSPORT_INDICATOR_FQN = new FullyQualifiedName('ol.hospitaltransportindicator');
const HOSPITAL_FQN = new FullyQualifiedName('bhr.hospital');
const HOSPITAL_NAME_FQN = new FullyQualifiedName('health.hospitalname');
const INCIDENT_NARRATIVE_FQN = new FullyQualifiedName('bhr.incidentNarrative');
const REFERRAL_DEST_FQN = new FullyQualifiedName('housing.referraldestination');
const REFERRAL_PROVIDER_INDICATOR_FQN = new FullyQualifiedName('ol.referralprovidedindicator');
const SPECIAL_RESOURCES_CALLED_FQN = new FullyQualifiedName('bhr.specializedResourcesCalled');
const STABILIZED_INDICATOR_FQN = new FullyQualifiedName('ol.stabilizedindicator');
const TRANSPORTING_AGENCY_FQN = new FullyQualifiedName('place.TransportingAgency');
const VOLUNTARY_ACTION_INDICATOR_FQN = new FullyQualifiedName('ol.voluntaryactionindicator');

export {
  DEESCALATION_SCALE_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DEESCALATION_TECHNIQUES_OTHER_FQN,
  DISPOSITION_FQN,
  HOSPITAL_TRANSPORT_INDICATOR_FQN,
  HOSPITAL_FQN,
  HOSPITAL_NAME_FQN,
  INCIDENT_NARRATIVE_FQN,
  REFERRAL_DEST_FQN,
  REFERRAL_PROVIDER_INDICATOR_FQN,
  SPECIAL_RESOURCES_CALLED_FQN,
  STABILIZED_INDICATOR_FQN,
  TRANSPORTING_AGENCY_FQN,
  VOLUNTARY_ACTION_INDICATOR_FQN,
};

/*
 * OfficerInfoView
 */

const OFFICER_NAME_FQN = new FullyQualifiedName('bhr.officerName');
const OFFICER_SEQ_ID_FQN = new FullyQualifiedName('bhr.officerSeqID');
const OFFICER_INJURIES_FQN = new FullyQualifiedName('bhr.officerInjuries');
const OFFICER_CERTIFICATION_FQN = new FullyQualifiedName('bhr.officerCertification');

export {
  OFFICER_NAME_FQN,
  OFFICER_SEQ_ID_FQN,
  OFFICER_INJURIES_FQN,
  OFFICER_CERTIFICATION_FQN,
};
