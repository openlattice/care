import { Models } from 'lattice';

const { FullyQualifiedName } = Models;

export const APP_NAME = 'BehavioralHealthReport';

export const APP_TYPES_FQNS = {
  APP_SETTINGS_FQN: new FullyQualifiedName('app.settings'),
  APPEARS_IN_FQN: new FullyQualifiedName('app.appearsin'),
  BEHAVIORAL_HEALTH_REPORT_FQN: new FullyQualifiedName('app.bhr'),
  HAS_FQN: new FullyQualifiedName('app.has'),
  HOSPITALS_FQN: new FullyQualifiedName('app.hospitals'),
  INTERACTION_STRATEGY_FQN: new FullyQualifiedName('app.interactionstrategy'),
  OBSERVED_IN_FQN: new FullyQualifiedName('app.observedin'),
  PEOPLE_FQN: new FullyQualifiedName('app.people'),
  PHYSICAL_APPEARANCE_FQN: new FullyQualifiedName('app.physicalappearance'),
  REPORTED_FQN: new FullyQualifiedName('app.reported'),
  RESPONSE_PLAN_FQN: new FullyQualifiedName('app.responseplan'),
  STAFF_FQN: new FullyQualifiedName('app.staff'),
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
