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

/* Disposition Constants */

export const DEESCALATION_TECHNIQUES = {
  VERBALIZATION: 'verbalization',
  HANDCUFFS: 'handcuffs',
  LEG_RESTRAINTS: 'legRestraints',
  TASER: 'taser',
  ARREST_CONTROL: 'arrestControl',
  N_A: 'n/a',
  OTHER: 'other'
};

export const DISPOSITIONS = {
  ARREST: 'arrest',
  EP: 'ep',
  VOLUNTARY_ER: 'voluntaryER',
  BCRI: 'bcri',
  INFO_AND_REFERRAL: 'infoAndReferral',
  LEAD: 'lead',
  CONTACTED_PROVIDER: 'contactedTreatementProvider',
  CRIMINAL_CITATION: 'criminalCitation',
  CIVIL_CITATION: 'civilCitation'
};

export const DISPOSITIONS_PORTLAND = {
  REFERRED_TO_BHU: 'referredToBHU',
  REFERRED_TO_CRISIS: 'referredToCrisis',
  ARREST: 'arrest',
  DIVERTED_FROM_ARREST: 'divertedFromArrest',
  RESISTED_SUPPORT: 'resistedOrRefusedSupports'
}

export const RESOURCES = {
  BCRI: 'bcri',
  CIT: 'citOfficer',
  CRT: 'crtUnit',
  ESU: 'esu',
  SWAT: 'swat',
  NEGOTIATION: 'negotiationTeam',
  HOMELESS_OUTREACH: 'homelessOutreach'
}

export const RESOURCES_PORTLAND = {
  BHU: 'BehavioralHealthUnit',
  CRISIS: 'CrisisTeam',
  VOLUNTARY: 'voluntaryTransport',
  INVOLUNTARY: 'involuntaryTransport'
}

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
  DISPOSITIONS: 'dispositions',
  DEESCALATION: 'deescalationTechniques',
  RESOURCES: 'resources',
  DISPOSITIONS_BY_DEESCALATION: 'dispositionsByDeescalationTechnique'
};
