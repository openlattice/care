import { Models } from 'lattice';

const { FullyQualifiedName } = Models;

export const APP_NAME = 'BehavioralHealthReport';

export const APP_TYPES_FQNS = {
  APPEARS_IN_FQN: new FullyQualifiedName('app.appearsin'),
  BEHAVIORAL_HEALTH_REPORT_FQN: new FullyQualifiedName('app.bhr'),
  FOLLOW_UP_REPORT_FQN: new FullyQualifiedName('app.followup'),
  HOSPITALS_FQN: new FullyQualifiedName('app.hospitals'),
  PEOPLE_FQN: new FullyQualifiedName('app.people')
};

export const PERSON = {
  LAST_NAME_FQN: 'nc.PersonSurName',
  FIRST_NAME_FQN: 'nc.PersonGivenName',
  MIDDLE_NAME_FQN: 'nc.PersonMiddleName',
  RACE_FQN: 'nc.PersonRace',
  SEX_FQN: 'nc.PersonSex',
  DOB_FQN: 'nc.PersonBirthDate',
  ID_FQN: 'nc.SubjectIdentification',
  AGE_FQN: 'person.age',
  PICTURE_FQN: 'person.picture'
};

export const CONSUMER_STATE = {
  AGE: 'age',
  LAST_NAME_FQN: 'lastName',
  FIRST_NAME_FQN: 'firstName',
  MIDDLE_NAME_FQN: 'middleName',
  RACE_FQN: 'race',
  SEX_FQN: 'gender',
  DOB_FQN: 'dob',
  ID_FQN: 'identification',
  PICTURE_FQN: 'picture'
};

export const REPORT_INFO = {
  DISPATCH_REASON_FQN: 'bhr.dispatchReason',
  COMPLAINT_NUMBER_FQN: 'bhr.complaintNumber',
  COMPANION_OFFENSE_REPORT_FQN: 'bhr.companionOffenseReport',
  INCIDENT_FQN: 'bhr.incident',
  LOCATION_OF_INCIDENT_FQN: 'bhr.locationOfIncident',
  UNIT_FQN: 'bhr.unit',
  POST_OF_OCCURRENCE_FQN: 'bhr.postOfOccurrence',
  CAD_NUMBER_FQN: 'bhr.cadNumber',
  ON_VIEW_FQN: 'bhr.onView',
  DATE_OCCURRED_FQN: 'bhr.dateOccurred',
  TIME_OCCURRED_FQN: 'bhr.timeOccurred',
  DATE_REPORTED_FQN: 'bhr.dateReported',
  TIME_REPORTED_FQN: 'bhr.timeReported'
};

export const CONSUMER_INFO = {
  ADDRESS_FQN: 'bhr.address',
  PHONE_FQN: 'bhr.phone',
  MILITARY_STATUS_FQN: 'bhr.militaryStatus',
  GENDER_FQN: 'bhr.gender',
  RACE_FQN: 'bhr.race',
  AGE_FQN: 'bhr.age',
  DOB_FQN: 'bhr.dob',
  HOMELESS_FQN: 'bhr.homeless',
  HOMELESS_LOCATION_FQN: 'bhr.homelessLocation',
  DRUGS_ALCOHOL_FQN: 'bhr.drugsAlcohol',
  DRUG_TYPE_FQN: 'bhr.drugType',
  PRESCRIBED_MEDICATION_FQN: 'bhr.prescribedMedication',
  TAKING_MEDICATION_FQN: 'bhr.takingMedication',
  PREV_PSYCH_ADMISSION_FQN: 'bhr.prevPsychAdmission',
  SELF_DIAGNOSIS_FQN: 'bhr.selfDiagnosis',
  SELF_DIAGNOSIS_OTHER_FQN: 'bhr.selfDiagnosisOther',
  ARMED_WITH_WEAPON_FQN: 'bhr.armedWithWeapon',
  ARMED_WEAPON_TYPE_FQN: 'bhr.armedWeaponType',
  ACCESS_TO_WEAPONS_FQN: 'bhr.accessToWeapons',
  ACCESSIBLE_WEAPON_TYPE_FQN: 'bhr.accessibleWeaponType',
  OBSERVED_BEHAVIORS_FQN: 'bhr.observedBehaviors',
  OBSERVED_BEHAVIORS_OTHER_FQN: 'bhr.observedBehaviorsOther',
  EMOTIONAL_STATE_FQN: 'bhr.emotionalState',
  EMOTIONAL_STATE_OTHER_FQN: 'bhr.emotionalStateOther',
  PHOTOS_TAKEN_OF_FQN: 'bhr.photosTakenOf',
  INJURIES_FQN: 'bhr.injuries',
  INJURIES_OTHER_FQN: 'bhr.injuriesOther',
  SUICIDAL_FQN: 'bhr.suicidal',
  SUICIDAL_ACTIONS_FQN: 'bhr.suicidalActions',
  SUICIDE_ATTEMPT_METHOD_FQN: 'bhr.suicideAttemptMethod',
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN: 'bhr.suicideAttemptMethodOther'
};

export const COMPLAINANT_INFO = {
  COMPLAINANT_NAME_FQN: 'bhr.complainantName',
  COMPLAINANT_ADDRESS_FQN: 'bhr.complainantAddress',
  COMPLAINANT_CONSUMER_RELATIONSHIP_FQN: 'bhr.complainantConsumerRelationship',
  COMPLAINANT_PHONE_FQN: 'bhr.complainantPhone'
};

export const DISPOSITION_INFO = {
  DISPOSITION_FQN: 'bhr.disposition',
  HOSPITAL_TRANSPORT_FQN: 'bhr.hospitalTransport',
  HOSPITAL_FQN: 'bhr.hospital',
  DEESCALATION_TECHNIQUES_FQN: 'bhr.deescalationTechniques',
  DEESCALATION_TECHNIQUES_OTHER_FQN: 'bhr.deescalationTechniquesOther',
  SPECIALIZED_RESOURCES_CALLED_FQN: 'bhr.specializedResourcesCalled',
  INCIDENT_NARRATIVE_FQN: 'bhr.incidentNarrative'
};

export const OFFICER_INFO = {
  OFFICER_NAME_FQN: 'bhr.officerName',
  OFFICER_SEQ_ID_FQN: 'bhr.officerSeqID',
  OFFICER_INJURIES_FQN: 'bhr.officerInjuries',
  OFFICER_CERTIFICATION_FQN: 'bhr.officerCertification'
};

export const STRING_ID_FQN = 'general.stringid';
export const NC_SUBJ_ID_FQN = 'nc.SubjectIdentification';
export const ENTITY_ID = 'openlattice.@id';

export const RACE = {
  americanIndian: 'American Indian or Alaska Native',
  asian: 'Asian',
  black: 'Black or African American',
  hispanic: 'Hispanic or Latino',
  nativeHawaiian: 'Native Hawaiian or Other Pacific Islander',
  white: 'White',
  other: 'Other'
};

export const FORM_PATHS = {
  CONSUMER_SEARCH: '/bhr/1',
  CONSUMER: '/bhr/2',
  REPORT: '/bhr/3',
  COMPLAINANT: '/bhr/4',
  DISPOSITION: '/bhr/5',
  OFFICER: '/bhr/6',
  REVIEW: '/bhr/7'
};

export const FORM_ERRORS = {
  INVALID_FORMAT: 'Some formats are invalid',
  IS_REQUIRED: 'Some required fields are empty'
};

export const STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

export const MAX_PAGE = 7;

export const INT_16_MAX_VALUE = 32767;
export const INT_16_MIN_VALUE = -32768;

export const DATA_URL_PREFIX = 'data:image/png;base64,';
