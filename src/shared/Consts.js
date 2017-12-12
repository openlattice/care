export const APP_NAMES = {
  APP: 'bhr',
  FORM: 'app.bhr',
  PEOPLE: 'app.people',
  APPEARS_IN: 'app.appearsin'
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
  LAST_NAME_FQN: 'lastName',
  FIRST_NAME_FQN: 'firstName',
  MIDDLE_NAME_FQN: 'middleName',
  RACE_FQN: 'race',
  SEX_FQN: 'gender',
  DOB_FQN: 'dob',
  ID_FQN: 'identification',
  PICTURE_FQN: 'picture'
};

export const STRING_ID_FQN = 'general.stringid';
export const NC_SUBJ_ID_FQN = 'nc.SubjectIdentification';

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
