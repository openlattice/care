import { Constants, Models } from 'lattice';

const { FQN } = Models;
const { OPENLATTICE_ID_FQN } = Constants;

export { OPENLATTICE_ID_FQN };

export const JSON_SCHEMA_FQN = FQN.of('ol.jsonschema');

export const AFFILIATION_FQN = FQN.of('bhr.affiliation');
/* involved in */
const ROLE_FQN = FQN.of('ol.role');
export { ROLE_FQN };

/* offense */
const NATURE_OF_CRISIS_FQN = FQN.of('ol.natureofcrisis');
export { NATURE_OF_CRISIS_FQN };

/* offense */
const DIVERSION_STATUS_FQN = FQN.of('ol.diversionstatus');
export { DIVERSION_STATUS_FQN };

/* symptom */
const DATE_LAST_REPORTED_FQN = FQN.of('ol.datelastreported');
export { DATE_LAST_REPORTED_FQN };

/* interacted with */
const CONTACT_DATE_TIME_FQN = FQN.of('ol.contactdatetime');
export { CONTACT_DATE_TIME_FQN };

/* substance */
const TEMPORAL_STATUS_FQN = FQN.of('ol.temporalstatus');
export { TEMPORAL_STATUS_FQN };

/* referral request */
const SERVICE_TYPE_FQN = FQN.of('ol.servicetype');
const SOURCE_FQN = FQN.of('ol.source');
export { SOURCE_FQN, SERVICE_TYPE_FQN };

/* encounter */
const SERVICE_SETTING_FQN = FQN.of('ol.servicesetting');
const CHECKED_IN_FQN = FQN.of('ol.checkedin');
export { CHECKED_IN_FQN, SERVICE_SETTING_FQN };

/* encounter details */
const LAW_ENFORCEMENT_INVOLVEMENT_FQN = FQN.of('ol.lawenforcementinvolvement');
const REASON_FQN = FQN.of('ol.reason');
const LEVEL_OF_CARE_FQN = FQN.of('ol.levelofcare');

export {
  LAW_ENFORCEMENT_INVOLVEMENT_FQN,
  LEVEL_OF_CARE_FQN,
  REASON_FQN,
};

/* invoice */
const LINE_ITEM_FQN = FQN.of('ol.lineitem');
export { LINE_ITEM_FQN };

const NUM_SOURCES_FOUND_IN_FQN = FQN.of('ol.numsourcesfoundin');
const NUM_REPORTS_FOUND_IN_FQN = FQN.of('ol.numreportsfoundin');
const NUMBER_OF_PEOPLE_FQN = FQN.of('ol.numberofpeople');
export {
  NUM_SOURCES_FOUND_IN_FQN,
  NUM_REPORTS_FOUND_IN_FQN,
  NUMBER_OF_PEOPLE_FQN,
};

/* disposition */
const CJ_DISPOSITION_FQN = FQN.of('criminaljustice.disposition');
export { CJ_DISPOSITION_FQN };

/* self harm */
const ACTION_FQN = FQN.of('ol.action');
export {
  ACTION_FQN
};

/* medication */
const TAKEN_AS_PRESCRIBED_FQN = FQN.of('ol.takenasprescribed');
export {
  TAKEN_AS_PRESCRIBED_FQN
};

/* call for service */
const HOW_REPORTED_FQN = FQN.of('ol.howreported');
export {
  HOW_REPORTED_FQN
};

/* incident */
const DATETIME_START_FQN = FQN.of('ol.datetimestart');
const DATETIME_END_FQN = FQN.of('ol.datetimeend');
const CRIMINALJUSTICE_CASE_NUMBER_FQN = FQN.of('criminaljustice.casenumber');
export {
  CRIMINALJUSTICE_CASE_NUMBER_FQN,
  DATETIME_END_FQN,
  DATETIME_START_FQN,
};

/* Person Details */
const SPECIAL_NEEDS_FQN = FQN.of('ol.specialneeds');
const VETERAN_STATUS_FQN = FQN.of('person.veteranstatus');

export {
  SPECIAL_NEEDS_FQN,
  VETERAN_STATUS_FQN,
};

/* <===== BEGIN LONG BEACH HACK =====> */
const NAME_FQN = FQN.of('ol.name');
const NUMBER_OF_SPACES_AVAILABLE_FQN = FQN.of('ol.numberofspacesavailable');
const NUMBER_OF_SPACES_TOTAL_FQN = FQN.of('ol.numberofspacestotal');
const HOURS_OF_OPERATION_FQN = FQN.of('ol.hoursofoperation');

const WARRANT_NUMBER_FQN = FQN.of('ol.warrantnumber');
const RECOGNIZED_START_DATE_FQN = FQN.of('ol.recognizedstartdate');
const RECOGNIZED_END_DATE_FQN = FQN.of('ol.recognizedenddate');
export {
  NAME_FQN,
  RECOGNIZED_START_DATE_FQN,
  RECOGNIZED_END_DATE_FQN,
  WARRANT_NUMBER_FQN,
  NUMBER_OF_SPACES_AVAILABLE_FQN,
  NUMBER_OF_SPACES_TOTAL_FQN,
  HOURS_OF_OPERATION_FQN,
};
/* <===== END LONG BEACH HACK =====> */

/* Issue */
const PRIORITY_FQN = FQN.of('ol.priority');
const STATUS_FQN = FQN.of('ol.status');
const ENTRY_UPDATED_FQN = FQN.of('general.entryupdated');

export {
  ENTRY_UPDATED_FQN,
  PRIORITY_FQN,
  STATUS_FQN
};

/* Is Emergency Contact For */
const RELATIONSHIP_FQN = FQN.of('ol.relationship');

export { RELATIONSHIP_FQN };

/* Contact Information */
const CONTACT_PHONE_NUMBER_FQN = FQN.of('contact.phonenumber');
const EXTENTION_FQN = FQN.of('ol.extension');
const GENERAL_NOTES_FQN = FQN.of('general.notes');
const PREFERRED_FQN = FQN.of('ol.preferred');

export {
  CONTACT_PHONE_NUMBER_FQN,
  EXTENTION_FQN,
  GENERAL_NOTES_FQN,
  PREFERRED_FQN,
};

/* Image Data */
const IMAGE_DATA_FQN = FQN.of('ol.imagedata');

export { IMAGE_DATA_FQN };

/* File Data */
const DATETIME_FQN = FQN.of('ol.datetime');
const FILE_DATA_FQN = FQN.of('ol.filedata');
const FILE_TAG_FQN = FQN.of('ol.label');
const FILE_TEXT_FQN = FQN.of('ol.text');

export {
  DATETIME_FQN,
  FILE_DATA_FQN,
  FILE_TAG_FQN,
  FILE_TEXT_FQN,
};

/*
 * Behavior
 */

const TRIGGER_FQN = FQN.of('ol.trigger');
const OBSERVED_BEHAVIOR_FQN = FQN.of('ol.observedbehavior');

export {
  OBSERVED_BEHAVIOR_FQN,
  TRIGGER_FQN,
};

/*
 * Location
 */

const LOCATION_ADDRESS_FQN = FQN.of('location.address');
const LOCATION_ADDRESS_LINE_2_FQN = FQN.of('location.addressline2');
const LOCATION_CITY_FQN = FQN.of('location.city');
const LOCATION_COORDINATES_FQN = FQN.of('ol.locationcoordinates');
const LOCATION_NAME_FQN = FQN.of('location.name');
const LOCATION_STATE_FQN = FQN.of('location.state');
const LOCATION_STREET_FQN = FQN.of('location.street');
const LOCATION_ZIP_FQN = FQN.of('location.zip');

export {
  LOCATION_ADDRESS_FQN,
  LOCATION_ADDRESS_LINE_2_FQN,
  LOCATION_CITY_FQN,
  LOCATION_COORDINATES_FQN,
  LOCATION_NAME_FQN,
  LOCATION_STATE_FQN,
  LOCATION_STREET_FQN,
  LOCATION_ZIP_FQN,
};

/*
 * Response Plan
 */

const CONTEXT_FQN = FQN.of('ol.context');
const NOTES_FQN = FQN.of('ol.notes');
export {
  CONTEXT_FQN,
  NOTES_FQN
};

/*
 * Interaction Strategy
 */

const DESCRIPTION_FQN = FQN.of('ol.description');
const INDEX_FQN = FQN.of('ol.index');
const TECHNIQUES_FQN = FQN.of('ol.techniques');
const TITLE_FQN = FQN.of('ol.title');
export {
  DESCRIPTION_FQN,
  INDEX_FQN,
  TECHNIQUES_FQN,
  TITLE_FQN,
};

/*
 * AppSettings
 */

const APP_DETAILS_FQN = FQN.of('ol.appdetails');
export {
  APP_DETAILS_FQN
};

/*
 * PhysicalAppearance
 */

const COMPLEXION_FQN = FQN.of('nc.complexion');
const HAIR_COLOR_FQN = FQN.of('ol.haircolor');
const FACIAL_HAIR_FQN = FQN.of('ol.facialhair');
const HEIGHT_FQN = FQN.of('ol.height');
const WEIGHT_FQN = FQN.of('ol.weight');
const BODY_DESCRIPTION_FQN = FQN.of('ol.bodydescription');
const EYE_COLOR_FQN = FQN.of('ol.eyecolor');
const GROOMING_FQN = FQN.of('ol.grooming');

export {
  COMPLEXION_FQN,
  HAIR_COLOR_FQN,
  FACIAL_HAIR_FQN,
  HEIGHT_FQN,
  WEIGHT_FQN,
  BODY_DESCRIPTION_FQN,
  EYE_COLOR_FQN,
  GROOMING_FQN
};

/*
 * ReportInfoView
 */

const CAD_NUMBER_FQN = FQN.of('bhr.cadNumber');
const COMPANION_OFFENSE_REPORT_FQN = FQN.of('bhr.companionOffenseReport');
const COMPLAINT_NUMBER_FQN = FQN.of('bhr.complaintNumber');
const DATE_TIME_OCCURRED_FQN = FQN.of('bhr.datetimeOccurred');
const DATE_TIME_REPORTED_FQN = FQN.of('bhr.datetimeReported');
const DISPATCH_REASON_FQN = FQN.of('bhr.dispatchReason');
const DISPATCH_REASON_OTHER_FQN = FQN.of('ol.reasonother');
const INCIDENT_FQN = FQN.of('bhr.incident');
const INCIDENT_OTHER_FQN = FQN.of('ol.incidenttypeother');
const LOCATION_OF_INCIDENT_FQN = FQN.of('bhr.locationOfIncident');
const ON_VIEW_FQN = FQN.of('bhr.onView');
const POST_OF_OCCURRENCE_FQN = FQN.of('bhr.postOfOccurrence');
const UNIT_FQN = FQN.of('bhr.unit');

export {
  CAD_NUMBER_FQN,
  COMPANION_OFFENSE_REPORT_FQN,
  COMPLAINT_NUMBER_FQN,
  DATE_TIME_OCCURRED_FQN,
  DATE_TIME_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  DISPATCH_REASON_OTHER_FQN,
  INCIDENT_FQN,
  INCIDENT_OTHER_FQN,
  LOCATION_OF_INCIDENT_FQN,
  ON_VIEW_FQN,
  POST_OF_OCCURRENCE_FQN,
  UNIT_FQN
};

/*
 * ConsumerInfoView
 */

const ADDRESS_FQN = FQN.of('bhr.address');
const PHONE_FQN = FQN.of('bhr.phone');
const MILITARY_STATUS_FQN = FQN.of('bhr.militaryStatus');
const GENDER_FQN = FQN.of('bhr.gender');
const RACE_FQN = FQN.of('bhr.race');
const AGE_FQN = FQN.of('bhr.age');
const DOB_FQN = FQN.of('bhr.dob');
const HOMELESS_FQN = FQN.of('bhr.homeless');
const HOMELESS_LOCATION_FQN = FQN.of('bhr.homelessLocation');
const DRUGS_ALCOHOL_FQN = FQN.of('bhr.drugsAlcohol');
const DRUG_TYPE_FQN = FQN.of('bhr.drugType');
const DRUG_TYPE_OTHER_FQN = FQN.of('ol.drugtypeother');
const PRESCRIBED_MEDICATION_FQN = FQN.of('bhr.prescribedMedication');
const TAKING_MEDICATION_FQN = FQN.of('bhr.takingMedication');
const PREV_PSYCH_ADMISSION_FQN = FQN.of('bhr.prevPsychAdmission');
const SELF_DIAGNOSIS_FQN = FQN.of('bhr.selfDiagnosis');
const SELF_DIAGNOSIS_OTHER_FQN = FQN.of('bhr.selfDiagnosisOther');
const ARMED_WITH_WEAPON_FQN = FQN.of('bhr.armedWithWeapon');
const ARMED_WEAPON_TYPE_FQN = FQN.of('bhr.armedWeaponType');
const ACCESS_TO_WEAPONS_FQN = FQN.of('bhr.accessToWeapons');
const ACCESSIBLE_WEAPON_TYPE_FQN = FQN.of('bhr.accessibleWeaponType');
const OBSERVED_BEHAVIORS_FQN = FQN.of('bhr.observedBehaviors');
const OBSERVED_BEHAVIORS_OTHER_FQN = FQN.of('bhr.observedBehaviorsOther');
const EMOTIONAL_STATE_FQN = FQN.of('bhr.emotionalState');
const EMOTIONAL_STATE_OTHER_FQN = FQN.of('bhr.emotionalStateOther');
const PHOTOS_TAKEN_OF_FQN = FQN.of('bhr.photosTakenOf');
const INJURIES_FQN = FQN.of('bhr.injuries');
const INJURIES_OTHER_FQN = FQN.of('bhr.injuriesOther');
const SUICIDAL_FQN = FQN.of('bhr.suicidal');
const SUICIDAL_ACTIONS_FQN = FQN.of('bhr.suicidalActions');
const SUICIDE_ATTEMPT_METHOD_FQN = FQN.of('bhr.suicideAttemptMethod');
const SUICIDE_ATTEMPT_METHOD_OTHER_FQN = FQN.of('bhr.suicideAttemptMethodOther');
const DIRECTED_AGAINST_FQN = FQN.of('ol.directedagainst');
const DIRECTED_AGAINST_OTHER_FQN = FQN.of('ol.directedagainstother');
const DIRECTED_AGAINST_RELATION_FQN = FQN.of('ol.directedrelation');
const HIST_DIRECTED_AGAINST_FQN = FQN.of('ol.historicaldirectedagainst');
const HIST_DIRECTED_AGAINST_OTHER_FQN = FQN.of('ol.historicaldirectedagainstother');
const HISTORY_OF_VIOLENCE_FQN = FQN.of('ol.historyofviolence');
const HISTORY_OF_VIOLENCE_TEXT_FQN = FQN.of('ol.historyofviolencetext');
const SCALE_1_TO_10_FQN = FQN.of('ol.scale1to10');

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
  DRUG_TYPE_OTHER_FQN,
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
  DIRECTED_AGAINST_RELATION_FQN,
  HIST_DIRECTED_AGAINST_FQN,
  HIST_DIRECTED_AGAINST_OTHER_FQN,
  HISTORY_OF_VIOLENCE_FQN,
  HISTORY_OF_VIOLENCE_TEXT_FQN,
  SCALE_1_TO_10_FQN
};

const PERSON_DOB_FQN = FQN.of('nc.PersonBirthDate');
const PERSON_ETHNICITY_FQN = FQN.of('nc.PersonEthnicity');
const PERSON_EYE_COLOR_FQN = FQN.of('nc.PersonEyeColorText');
const PERSON_FIRST_NAME_FQN = FQN.of('nc.PersonGivenName');
const PERSON_HAIR_COLOR_FQN = FQN.of('nc.PersonHairColorText');
const PERSON_HEIGHT_FQN = FQN.of('nc.PersonHeightMeasure');
const PERSON_ID_FQN = FQN.of('nc.SubjectIdentification');
const PERSON_LAST_NAME_FQN = FQN.of('nc.PersonSurName');
const PERSON_MIDDLE_NAME_FQN = FQN.of('nc.PersonMiddleName');
const PERSON_NICK_NAME_FQN = FQN.of('im.PersonNickName');
const PERSON_PICTURE_FQN = FQN.of('person.picture');
const PERSON_RACE_FQN = FQN.of('nc.PersonRace');
const PERSON_SEX_FQN = FQN.of('nc.PersonSex');
const PERSON_SSN_LAST_4_FQN = FQN.of('general.ssnlast4');
const PERSON_SUFFIX_FQN = FQN.of('nc.PersonSuffix');
const PERSON_WEIGHT_FQN = FQN.of('nc.PersonWeightMeasure');

export {
  PERSON_DOB_FQN,
  PERSON_ETHNICITY_FQN,
  PERSON_EYE_COLOR_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_HAIR_COLOR_FQN,
  PERSON_HEIGHT_FQN,
  PERSON_ID_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_PICTURE_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_SSN_LAST_4_FQN,
  PERSON_SUFFIX_FQN,
  PERSON_WEIGHT_FQN,
};

/*
 * ComplainantInfoView
 */

const COMPLAINANT_NAME_FQN = FQN.of('bhr.complainantName');
const COMPLAINANT_ADDRESS_FQN = FQN.of('bhr.complainantAddress');
const COMPLAINANT_RELATIONSHIP_FQN = FQN.of('bhr.complainantConsumerRelationship');
const COMPLAINANT_PHONE_FQN = FQN.of('bhr.complainantPhone');

export {
  COMPLAINANT_NAME_FQN,
  COMPLAINANT_ADDRESS_FQN,
  COMPLAINANT_RELATIONSHIP_FQN,
  COMPLAINANT_PHONE_FQN
};

/*
 * DispositionInfoView
 */

const DEESCALATION_SCALE_FQN = FQN.of('ol.deescalationscale');
const DEESCALATION_TECHNIQUES_FQN = FQN.of('bhr.deescalationTechniques');
const DEESCALATION_TECHNIQUES_OTHER_FQN = FQN.of('bhr.deescalationTechniquesOther');
const DISPOSITION_FQN = FQN.of('bhr.disposition');
const HOSPITAL_TRANSPORT_INDICATOR_FQN = FQN.of('bhr.hospitalTransport');
const HOSPITAL_FQN = FQN.of('bhr.hospital');
const HOSPITAL_NAME_FQN = FQN.of('health.hospitalname');
const INCIDENT_NARRATIVE_FQN = FQN.of('bhr.incidentNarrative');
const REFERRAL_DEST_FQN = FQN.of('housing.referraldestination');
const REFERRAL_PROVIDER_INDICATOR_FQN = FQN.of('ol.referralprovidedindicator');
const SPECIAL_RESOURCES_CALLED_FQN = FQN.of('bhr.specializedResourcesCalled');
const STABILIZED_INDICATOR_FQN = FQN.of('ol.stabilizedindicator');
const TRANSPORTING_AGENCY_FQN = FQN.of('place.TransportingAgency');
const VOLUNTARY_ACTION_INDICATOR_FQN = FQN.of('ol.voluntaryactionindicator');

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
  VOLUNTARY_ACTION_INDICATOR_FQN
};

/*
 * OfficerInfoView
 */

const OFFICER_NAME_FQN = FQN.of('bhr.officerName');
const OFFICER_SEQ_ID_FQN = FQN.of('bhr.officerSeqID');
const OFFICER_INJURIES_FQN = FQN.of('bhr.officerInjuries');
const OFFICER_CERTIFICATION_FQN = FQN.of('bhr.officerCertification');

export {
  OFFICER_NAME_FQN,
  OFFICER_SEQ_ID_FQN,
  OFFICER_INJURIES_FQN,
  OFFICER_CERTIFICATION_FQN
};

/*
 * Other
 */

const COMPLETED_DT_FQN = FQN.of('date.completeddatetime');
const DATE_TIME_FQN = FQN.of('general.datetime');
const GENERAL_STATUS_FQN = FQN.of('general.status');

export {
  COMPLETED_DT_FQN,
  DATE_TIME_FQN,
  GENERAL_STATUS_FQN
};

/*
 * Crisis Report Specific
 */

const BIOLOGICALLY_INDUCED_CAUSES_FQN = FQN.of('bhr.biologicallyinducedoptions');
const CHEMICALLY_INDUCED_CAUSES_FQN = FQN.of('bhr.chemicallyinducedoptions');
const DEMEANORS_FQN = FQN.of('ol.attitude');
const OTHER_DEMEANORS_FQN = FQN.of('ol.attitudeother');
const PERSON_ASSISTING_FQN = FQN.of('ol.persontoassist');
const OTHER_PERSON_ASSISTING_FQN = FQN.of('ol.persontoassistother');
const NARCAN_ADMINISTERED_FQN = FQN.of('ol.narcanadministered');
const HOUSING_SITUATION_FQN = FQN.of('housing.living_arrangements');
const ARREST_INDICATOR_FQN = FQN.of('ol.arrestedindicator');
const CRIMES_AGAINST_PERSON_FQN = FQN.of('ol.crimeagainstperson');
const FELONY_INDICATOR_FQN = FQN.of('ol.felony');
const ARRESTABLE_OFFENSE_FQN = FQN.of('ol.arrestableoffense');
const OL_ID_FQN = FQN.of('ol.id');
const STRING_ID_FQN = FQN.of('general.stringid');
const TYPE_FQN = FQN.of('ol.type');
const CATEGORY_FQN = FQN.of('ol.category');
const OTHER_TEXT_FQN = FQN.of('ol.othertext');
const ORGANIZATION_NAME_FQN = FQN.of('ol.organizationname');
const NO_ACTION_POSSIBLE_FQN = FQN.of('ol.noactionpossible');
const UNABLE_TO_CONTACT_FQN = FQN.of('ol.unabletocontact');
const RESOURCES_DECLINED_FQN = FQN.of('ol.offereddeclined');
const OTHER_NOTIFIED_FQN = FQN.of('ol.othernotified');
const OTHER_WEAPON_TYPE_FQN = FQN.of('ol.weapontypeother');
const THREATENED_INDICATOR_FQN = FQN.of('ol.threatened');
const PERSON_INJURED_FQN = FQN.of('ol.personinjured');
const OTHER_PERSON_INJURED_FQN = FQN.of('ol.otherpersoninjured');
const TRANSPORT_INDICATOR_FQN = FQN.of('ol.transportindicator');
const SUPERVISOR_FQN = FQN.of('bhr.supervisor');
const SUPERVISOR_ID_FQN = FQN.of('bhr.supervisorID');

export {
  BIOLOGICALLY_INDUCED_CAUSES_FQN,
  CHEMICALLY_INDUCED_CAUSES_FQN,
  DEMEANORS_FQN,
  OTHER_DEMEANORS_FQN,
  PERSON_ASSISTING_FQN,
  OTHER_PERSON_ASSISTING_FQN,
  NARCAN_ADMINISTERED_FQN,
  HOUSING_SITUATION_FQN,
  ARREST_INDICATOR_FQN,
  CRIMES_AGAINST_PERSON_FQN,
  NO_ACTION_POSSIBLE_FQN,
  FELONY_INDICATOR_FQN,
  ARRESTABLE_OFFENSE_FQN,
  OL_ID_FQN,
  STRING_ID_FQN,
  TYPE_FQN,
  CATEGORY_FQN,
  OTHER_TEXT_FQN,
  ORGANIZATION_NAME_FQN,
  UNABLE_TO_CONTACT_FQN,
  RESOURCES_DECLINED_FQN,
  OTHER_NOTIFIED_FQN,
  OTHER_WEAPON_TYPE_FQN,
  THREATENED_INDICATOR_FQN,
  PERSON_INJURED_FQN,
  OTHER_PERSON_INJURED_FQN,
  TRANSPORT_INDICATOR_FQN,
  SUPERVISOR_FQN,
  SUPERVISOR_ID_FQN
};
