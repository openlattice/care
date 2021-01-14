import { APP_TYPES_FQNS as APP } from '../../../../shared/Consts';

const CRISIS_REPORT = 'Crisis Report';
const CRISIS_REPORT_CLINICIAN = 'Crisis Report (Clinician)';
const FOLLOW_UP_REPORT = 'Follow-up Report';

const REPORT_TYPE_OPTIONS = [
  {
    label: CRISIS_REPORT,
    value: APP.CRISIS_REPORT_FQN,
  },
  {
    label: CRISIS_REPORT_CLINICIAN,
    value: APP.CRISIS_REPORT_CLINICIAN_FQN,
  },
  {
    label: FOLLOW_UP_REPORT,
    value: APP.FOLLOW_UP_REPORT_FQN
  },
];

const BEHAVIORS = [
  'Belligerent',
  'Bizzare',
  'Delusions',
  'Depressed',
  'Disorderly',
  'Disorganized speech',
  'Disorientation',
  'Distant',
  'Hallucinations',
  'Mania',
  'Neglect of self care',
  'Out of touch with reality',
  'Paranoid',
  'Suicide behaviors',
];

const COMPLETED_BY = [
  'CIT Officer',
  'MHFA Officer',
  'JDP Clinician',
  'Forensic peer',
  'ESP/Crisis Team',
];

const DISCRETIONARY_ARREST = [
  'Meets criteria for discretionary arrest',
  'Does not meet criteria for discretionary arrest',
];

const NATURE_OF_CALL = [
  'Accident',
  'Criminal',
  'Domestic',
  'Follow Up',
  'General Disturbance',
  'Psych Situation',
  'Suicide Attempt',
  'Wellness',
];

const NATURE_OF_CRISIS = [
  'Acute stress',
  'Co-Occuring MH and SA',
  'Cognitive issues',
  'Developmental disorder',
  'Substance use disorder',
  'Psychotic disorder',
  'Mental health issues',
  'Mood disorder',
  'Unknown',
];

const EMS = 'EMS';
const FIRE = 'Fire';
const EMS_FIRE = `${EMS} and ${FIRE}`;

const ASSISTANCE_ON_SCENE = [
  EMS,
  FIRE,
  'Case Manager',
  'Service Provider',
  'Family',
  'Friend',
  'Neighbor',
  'Spouse or Partner',
];

const PAST = 'past';
const CURRENT = 'current';

const DRUGS_ALCOHOL = [
  'Alcohol',
  'Cocaine',
  'Opioids',
  'Prescription',
  'Unknown',
];

const NA = 'N/A';
const NO = 'No';
const NONE = 'None';
const OTHER = 'Other';
const UNKNOWN = 'Unknown';
const YES = 'Yes';

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

const YES_NO = [YES, NO];

const SELECT_ALL_THAT_APPLY = 'Select all that apply';
const SELECT_ONLY_ONE = 'Select only one';

const HOUSING = [
  'Permanent Residence',
  'Stable Housing',
  'Service Provider',
  'Temporary',
  'Assisted Care',
  'Homeless Shelter',
  'Unsheltered Homeless',
  'Family',
  'Friend',
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
  'MBHP',
  'Medicare',
  'Medicaid',
  'Private',
  'Veterans Affairs',
  'Unknown',
];

const TECHNIQUES = [
  'Verbal',
  'Handcuffs',
  'Force'
];

const CLINICIAN_DISPOSITION = [
  'CBAT',
  'CCS',
  'Day Treatment',
  'De-escalated on Scene',
  'Detox',
  'ESP / Mobile',
  'Medical Hospital',
  'New Outpatient',
  'Section 12',
  'Section 18',
  'Section 35',
  'Voluntary ER Eval',
];

const DISPOSITION = [
  'Arrestable offense',
  'Community Impact Referral',
  'Courtesy Transport',
  'Medical Hospital',
  'Notified Someone',
  'Resolved on scene',
  'Section 12',
  'Section 18',
  'Section 35',
];

const PRIOR_ARREST_HISTORY = [
  '0',
  '1',
  '2 - 5',
  '6+'
];

const CURRENT_PROVIDERS = 'Current Providers';
const CLINICIAN_REFERRALS = [
  CURRENT_PROVIDERS,
  'PsychoPharm',
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

const FOLLOW_UP_NATURE = [
  'Follow-up',
  'Wellness',
  '1st Call',
  '2nd Call',
  'Outreach Visit',
  'Outreach Letter',
];

const POINT_OF_INTERVENTION = [
  'Non-criminal',
  'Pre-arrest',
  'Post-arrest',
  'Re-entry',
];

const ASSESSMENT_LOCATION = [
  'Community/Street',
  'Court',
  'Crisis Office',
  'Hospital',
  'Incarceration facility',
  'Police Lock-up',
  'Police Station',
  'Residence',
  'School',
];

const REFERRAL_SOURCES = [
  'Community Treatment Provider',
  'Court Clinic',
  'Court Personnel',
  'Law Enforcement',
  'Private Citizen',
  'School',
  'State Agency',
];

const NO_RESPONSE = [
  '1st Attempt',
  '2nd Attempt',
  'Visit',
  'Other',
];

const FOLLOW_UP_DISPOSITON = [
  'CIT Officer Assessment',
  'Community Outreach',
  'Detox',
  'ESP/Mobile Crisis Eval',
  'Family Support',
  'Inpatient',
  'JDP Co-response',
  'LGH',
  'LGH-Saints',
  'Lahey',
  'MHFA Officer Assessment',
  'Outpatient',
  'Section 12',
  'Section 18',
  'Section 35',
];

const PRIMARY = 'Primary';
const SECONDARY = 'Secondary';

export {
  ASSESSMENT_LOCATION,
  ASSISTANCE_ON_SCENE,
  BEHAVIORS,
  BILLED_SERVICES,
  CLINICIAN_DISPOSITION,
  CLINICIAN_REFERRALS,
  COMPLETED_BY,
  CRISIS_REPORT,
  CRISIS_REPORT_CLINICIAN,
  CURRENT,
  CURRENT_PROVIDERS,
  DISCRETIONARY_ARREST,
  DISPOSITION,
  DRUGS_ALCOHOL,
  EMPLOYMENT,
  EMS,
  EMS_FIRE,
  FIRE,
  FOLLOW_UP_DISPOSITON,
  FOLLOW_UP_NATURE,
  FOLLOW_UP_REPORT,
  HOUSING,
  INSURANCE,
  KNOWN_CLIENT,
  NA,
  NATURE_OF_CALL,
  NATURE_OF_CRISIS,
  NO,
  NONE,
  NO_RESPONSE,
  OTHER,
  PAST,
  POINT_OF_INTERVENTION,
  PRIMARY,
  PRIOR_ARREST_HISTORY,
  PURPOSE_OF_JDP,
  REFERRAL_SOURCES,
  REPORT_TYPE_OPTIONS,
  RESIDES_WITH,
  SECONDARY,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
  SELF_INJURY,
  TECHNIQUES,
  UNKNOWN,
  VIOLENCE_TARGET,
  WEAPON_TYPE,
  YES,
  YES_NO,
  YES_NO_NA,
  YES_NO_UNKNOWN,
};
