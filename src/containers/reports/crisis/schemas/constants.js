const BEHAVIORS = [
  'Belligerent',
  'Bizzare, unusual behavior',
  'Disorientation',
  'Disorganized speech',
  'Disorderly',
  'Delusions',
  'Hallucinations',
  'Depressed',
  'Mania',
  'Neglect of self care',
  'Out of touch with reality',
  'Paranoid',
  'Suicide behaviors',
];

const NATURE_OF_CRISIS = [
  'Acute stress',
  'Cognitive issues',
  'Developmental disorder',
  'Substance use disorder',
  'Psychotic disorder',
  'Mental health issues',
  'Suicide attempt',
  'Self-harm',
  'Homicidal thoughts',
  'Unknown',
];

const DRUGS_ALCOHOL = [
  'Alcohol',
  'Cocaine',
  'Opioids',
  'Prescription',
  'Unknown',
];

const YES = 'Yes';
const NO = 'No';
const UNKNOWN = 'Unknown';
const NA = 'N/A';


const YES_NO_UNKNOWN = [
  YES,
  NO,
  UNKNOWN,
];

const YES_NO_NA = [
  YES,
  NO,
  NA
];

const HOUSING = [
  'Permanent Residence',
  'Stable Housing',
  'Service Provider',
  'Temporary',
  'Assisted Care',
  'Homeless Shelter',
  'Unsheltered Homeless',
  'Friend or Family',
  'Group Home',
  'Unknown'
];

const RESIDES_WITH = [
  'Caregiver',
  'Children',
  'Dependent',
  'Parent',
  'Family',
  'Spouse or Partner',
  'Roommate',
  'Friend(s)',
  'Unknown'
];

const EMPLOYMENT = [
  'Full-time',
  'Part-time',
  'Retired',
  'Student',
  'Extralegal',
  'Receives Benefits',
  'Unemployed',
  'Unknown',
];

const KNOWN_CLIENT = [
  'DCF',
  'DDS',
  'DMH',
  'Unknown'
];

const WEAPON_TYPE = [
  'Gun',
  'Knife',
];

const VIOLENCE_TARGET = [
  'Bystander',
  'Co-worker',
  'Family Member',
  'Frequent Contact',
  'Friend',
  'Neighbor',
  'Officer',
];

const SELF_INJURY = [
  'Suicide Attempt',
  'Suicidal Ideation',
  'Self-harm',
  'Self-harm attempt'
];

const INSURANCE = [
  'Medicare',
  'Medicaid',
  'Private',
  'Veterans Affairs',
  'Unknown'
];

const TECHNIQUES = [
  'Verbal',
  'Handcuffs',
  'Force'
];

const DISPOSITION = [
  'Inpatient',
  'Day Treatment',
  'Detox',
  'New Outpatient',
  'PsychoPharm Referral',
  'CCS',
  'ESP / Mobile',
  'CBAT',
  'Refer to Current Providers',
];

const PURPOSE_OF_JDP = [
  'Agency Assistance',
  'CCIT Case Conference',
  'Community Outreach',
  'Death Notification',
  'Family Support',
  'Psych Eval',
  'Return Visit',
  'Safety Check',
  'Victim Assitance'
];

const BILLED_SERVICES = [
  'Community Evaluation',
  'ER Evaluation',
];

export {
  BEHAVIORS,
  BILLED_SERVICES,
  DISPOSITION,
  DRUGS_ALCOHOL,
  EMPLOYMENT,
  HOUSING,
  INSURANCE,
  KNOWN_CLIENT,
  NATURE_OF_CRISIS,
  PURPOSE_OF_JDP,
  RESIDES_WITH,
  SELF_INJURY,
  TECHNIQUES,
  VIOLENCE_TARGET,
  WEAPON_TYPE,
  YES_NO_NA,
  YES_NO_UNKNOWN,
};
