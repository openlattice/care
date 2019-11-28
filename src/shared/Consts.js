import { Models } from 'lattice';

const { FullyQualifiedName } = Models;

export const APP_NAME = 'BehavioralHealthReport';

export const APP_TYPES_FQNS = {
  APPEARS_IN_FQN: new FullyQualifiedName('app.appearsin'),
  APP_SETTINGS_FQN: new FullyQualifiedName('app.settings'),
  ASSIGNED_TO_FQN: new FullyQualifiedName('app.assignedto'),
  BEHAVIORAL_HEALTH_REPORT_FQN: new FullyQualifiedName('app.bhr'),
  BEHAVIOR_FQN: new FullyQualifiedName('app.behavior'),
  CONTACTED_VIA_FQN: new FullyQualifiedName('app.contactedvia'),
  CONTACT_INFORMATION_FQN: new FullyQualifiedName('app.contactinformation'),
  EMERGENCY_CONTACT_FQN: new FullyQualifiedName('app.emergencycontact'),
  HAS_FQN: new FullyQualifiedName('app.has'),
  HAS_RELATIONSHIP_WITH_FQN: new FullyQualifiedName('app.hasrelationshipwith'),
  HOSPITALS_FQN: new FullyQualifiedName('app.hospitals'),
  IDENTIFYING_CHARACTERISTICS_FQN: new FullyQualifiedName('app.identifyingcharacteristics'),
  IMAGE_FQN: new FullyQualifiedName('app.image'),
  INTERACTION_STRATEGY_FQN: new FullyQualifiedName('app.interactionstrategy'),
  ISSUE_FQN: new FullyQualifiedName('app.issue'),
  IS_EMERGENCY_CONTACT_FOR_FQN: new FullyQualifiedName('app.isemergencycontactfor'),
  IS_PICTURE_OF_FQN: new FullyQualifiedName('app.ispictureof'),
  LOCATED_AT_FQN: new FullyQualifiedName('app.locatedat'),
  LOCATION_FQN: new FullyQualifiedName('app.location'),
  OBSERVED_IN_FQN: new FullyQualifiedName('app.observedin'),
  OFFICERS_FQN: new FullyQualifiedName('app.officers'),
  OFFICER_SAFETY_CONCERNS_FQN: new FullyQualifiedName('app.officersafetyconcerns'),
  PART_OF_FQN: new FullyQualifiedName('app.partof'),
  PEOPLE_FQN: new FullyQualifiedName('app.people'),
  PHYSICAL_APPEARANCE_FQN: new FullyQualifiedName('app.physicalappearance'),
  REPORTED_FQN: new FullyQualifiedName('app.reported'),
  RESPONSE_PLAN_FQN: new FullyQualifiedName('app.responseplan'),
  STAFF_FQN: new FullyQualifiedName('app.staff'),
  SUBJECT_OF_FQN: new FullyQualifiedName('app.subjectof'),
};

export const STRING_ID_FQN = 'general.stringid';

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

export const DATA_URL_PREFIX = 'data:image/png;base64,';

/* Dashboard Constants */

export const SUMMARY_STATS = {
  NUM_REPORTS: 'numReports',
  AVG_AGE: 'avgAge',
  NUM_HOMELESS: 'numHomeless',
  NUM_MALE: 'numMale',
  NUM_VETERANS: 'numVeterans',
  NUM_USING_SUBSTANCE: 'numUsingSubstance',
  NUM_USING_ALCOHOL: 'numUsingAlcohol',
  NUM_USING_DRUGS: 'numUsingDrugs'
};

export const DASHBOARD_COUNTS = {
  RACE: 'raceCounts',
  AGE: 'ageCounts',
  GENDER: 'genderCounts',
  REPORTS_BY_DATE: 'reportsByDate',
  REPORTS_BY_TIME: 'reportsByTime',
  REPORTS_BY_DAY_OF_WEEK: 'reportsByDayOfWeek',

  EMOTIONAL_STATE: 'emotionalStateCounts',
  BEHAVIORS: 'observedBehaviorsCounts',
  SELF_DIAGNOSIS: 'selfDiagnosisCounts',
  MEDICATION: 'medicationCounts',
  INJURIES: 'injuryCounts',
  ARMED: 'armedCounts',
  ARMED_WEAPON_TYPES: 'armedWeaponTypeCounts',
  WEAPON_ACCESS: 'weaponAccessCounts',
  ACCESS_WEAPON_TYPES: 'accessWeaponTypeCounts',
  SUICIDAL: 'suicidal',
  SUICIDAL_ACTIONS: 'suicidalalActions',
  SUICIDE_METHOD: 'suicideMethod',

  DISPOSITIONS: 'dispositions',
  DEESCALATION: 'deescalationTechniques',
  RESOURCES: 'resources',
  DISPOSITIONS_BY_DEESCALATION: 'dispositionsByDeescalationTechnique',
  CERTIFICATIONS: 'certificationCounts'
};
