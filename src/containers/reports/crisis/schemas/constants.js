import { APP_TYPES_FQNS as APP } from '../../../../shared/Consts';

export const CRISIS_REPORT = 'Crisis Report';
export const CRISIS_REPORT_CLINICIAN = 'Crisis Report (Clinician)';
export const FOLLOW_UP_REPORT = 'Follow-up Report';

export const REPORT_TYPE_OPTIONS = [
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

export const NA = 'N/A';
export const NO = 'No';
export const NONE = 'None';
export const OTHER = 'Other';
export const UNKNOWN = 'Unknown';
export const YES = 'Yes';

export const YES_NO_UNKNOWN = [
  YES,
  NO,
  UNKNOWN,
];

export const YES_NO_NA = [
  YES,
  NO,
  NA
];

export const YES_NO = [YES, NO];

export const SELECT_ALL_THAT_APPLY = 'Select all that apply';
export const SELECT_ONLY_ONE = 'Select only one';

export const BEHAVIORS = [
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

export const CIT_OFFICER = 'CIT Officer';
export const MHFA_OFFICER = 'MHFA Officer';
export const JDP_CLINICIAN = 'JDP Clinician';
export const FORENSIC_PEER = 'Forensic peer';
export const ESP_CRISIS_TEAM = 'ESP/Crisis Team';
export const COMPLETED_BY = [
  CIT_OFFICER,
  ESP_CRISIS_TEAM,
  FORENSIC_PEER,
  JDP_CLINICIAN,
  MHFA_OFFICER,
];

export const MEETS_DISCRETIONARY_ARREST = 'Meets criteria for discretionary arrest';
export const DOES_NOT_MEET_DISCRETIONARY_ARREST = 'Does not meet criteria for discretionary arrest';
export const DISCRETIONARY_ARREST = [
  MEETS_DISCRETIONARY_ARREST,
  DOES_NOT_MEET_DISCRETIONARY_ARREST,
];

export const ACCIDENT = 'Accident';
export const CRIMINAL = 'Criminal';
export const DOMESTIC = 'Domestic';
export const FOLLOW_UP = 'Follow Up';
export const GENERAL_DISTURBANCE = 'General Disturbance';
export const PSYCH_SITUATION = 'Psych Situation';
export const SUICIDE_ATTEMPT = 'Suicide Attempt';
export const WELLNESS = 'Wellness';
export const NATURE_OF_CALL = [
  ACCIDENT,
  CRIMINAL,
  DOMESTIC,
  FOLLOW_UP,
  GENERAL_DISTURBANCE,
  PSYCH_SITUATION,
  SUICIDE_ATTEMPT,
  WELLNESS,
];

export const ACUTE_STRESS = 'Acute stress';
export const CO_OCCURING_MH_AND_SA = 'Co-Occuring MH and SA';
export const COGNITIVE_ISSUES = 'Cognitive issues';
export const DEVELOPMENTAL_DISORDER = 'Developmental disorder';
export const SUBSTANCE_USE_DISORDER = 'Substance use disorder';
export const PSYCHOTIC_DISORDER = 'Psychotic disorder';
export const MENTAL_HEALTH_ISSUES = 'Mental health issues';
export const MOOD_DISORDER = 'Mood disorder';
export const NATURE_OF_CRISIS = [
  ACUTE_STRESS,
  CO_OCCURING_MH_AND_SA,
  COGNITIVE_ISSUES,
  DEVELOPMENTAL_DISORDER,
  SUBSTANCE_USE_DISORDER,
  PSYCHOTIC_DISORDER,
  MENTAL_HEALTH_ISSUES,
  MOOD_DISORDER,
  UNKNOWN,
];

export const EMS = 'EMS';
export const FIRE = 'Fire';
export const EMS_FIRE = 'EMS and Fire';
export const CASE_MANAGER = 'Case Manager';
export const SERVICE_PROVIDER = 'Service Provider';
export const FAMILY = 'Family';
export const FRIEND = 'Friend';
export const NEIGHBOR = 'Neighbor';
export const SPOUSE_PARTNER = 'Spouse or Partner';

export const ASSISTANCE_ON_SCENE = [
  EMS,
  FIRE,
  CASE_MANAGER,
  SERVICE_PROVIDER,
  FAMILY,
  FRIEND,
  NEIGHBOR,
  SPOUSE_PARTNER,
];

export const PAST = 'past';
export const CURRENT = 'current';

export const ALCOHOL = 'Alcohol';
export const COCAINE = 'Cocaine';
export const OPIOIDS = 'Opioids';
export const PRESCRIPTION = 'Prescription';
export const DRUGS_ALCOHOL = [
  ALCOHOL,
  COCAINE,
  OPIOIDS,
  PRESCRIPTION,
  UNKNOWN,
];

export const PERMANENT_RESIDENCE = 'Permanent Residence';
export const STABLE_HOUSING = 'Stable Housing';
export const TEMPORARY = 'Temporary';
export const ASSISTED_CARE = 'Assisted Care';
export const HOMELESS_SHELTER = 'Homeless Shelter';
export const UNSHELTERED_HOMELESS = 'Unsheltered Homeless';
export const GROUP_HOME = 'Group Home';
export const HOUSING = [
  PERMANENT_RESIDENCE,
  STABLE_HOUSING,
  SERVICE_PROVIDER,
  TEMPORARY,
  ASSISTED_CARE,
  HOMELESS_SHELTER,
  UNSHELTERED_HOMELESS,
  FAMILY,
  FRIEND,
  GROUP_HOME,
  UNKNOWN
];

export const CAREGIVER = 'Caregiver';
export const CHILDREN = 'Children';
export const PARENT = 'Parent';
export const SPOUSE_OR_PARTNER = 'Spouse or Partner';
export const ROOMMATE = 'Roommate';
export const FRIENDS = 'Friend(s)';
export const SELF = 'Self';
export const RESIDES_WITH = [
  CAREGIVER,
  CHILDREN,
  FAMILY,
  FRIENDS,
  PARENT,
  ROOMMATE,
  SELF,
  SPOUSE_OR_PARTNER,
  UNKNOWN,
];
export const FULL_TIME = 'Full-time';
export const PART_TIME = 'Part-time';
export const RETIRED = 'Retired';
export const STUDENT = 'Student';
export const EXTRALEGAL = 'Extralegal';
export const RECEIVES_BENEFITS = 'Receives Benefits';
export const UNEMPLOYED = 'Unemployed';
export const EMPLOYMENT = [
  FULL_TIME,
  PART_TIME,
  RETIRED,
  STUDENT,
  EXTRALEGAL, // remove
  RECEIVES_BENEFITS,
  UNEMPLOYED,
  UNKNOWN,
];
export const DCF = 'DCF';
export const DDS = 'DDS';
export const DMH = 'DMH';
export const KNOWN_CLIENT = [
  DCF,
  DDS,
  DMH,
  UNKNOWN
];

export const GUN = 'Gun';
export const KNIFE = 'Knife';
export const WEAPON_TYPE = [
  GUN,
  KNIFE,
];

export const BYSTANDER = 'Bystander';
export const CO_WORKER = 'Co-worker';
export const FAMILY_MEMBER = 'Family Member';
export const FREQUENT_CONTACT = 'Frequent Contact';
export const OFFICER = 'Officer';
export const VIOLENCE_TARGET = [
  BYSTANDER,
  CO_WORKER,
  FAMILY_MEMBER,
  FREQUENT_CONTACT,
  FRIEND,
  NEIGHBOR,
  OFFICER,
];

export const SUICIDAL_IDEATION = 'Suicidal Ideation';
export const SELF_HARM = 'Self-harm';
export const SELF_HARM_ATTEMPT = 'Self-harm attempt';
export const SELF_INJURY = [
  SUICIDE_ATTEMPT,
  SUICIDAL_IDEATION,
  SELF_HARM,
  SELF_HARM_ATTEMPT,
];

export const MBHP = 'MBHP';
export const MEDICARE = 'Medicare';
export const MEDICAID = 'Medicaid';
export const PRIVATE = 'Private';
export const VETERANS_AFFAIRS = 'Veterans Affairs';
export const UNINSURED = 'Uninsured';
export const INSURANCE = [
  MBHP,
  MEDICARE,
  MEDICAID,
  PRIVATE,
  VETERANS_AFFAIRS,
  UNINSURED,
  UNKNOWN,
];

export const VERBAL = 'Verbal';
export const HANDCUFFS = 'Handcuffs';
export const FORCE = 'Force';
export const TECHNIQUES = [
  VERBAL,
  HANDCUFFS,
  FORCE,
];

export const CBAT = 'CBAT';
export const CCS = 'CCS';
export const DAY_TREATMENT = 'Day Treatment';
export const DEESCALATED_ON_SCENE = 'De-escalated on Scene';
export const DETOX = 'Detox';
export const ESP_MOBILE = 'ESP / Mobile';
export const MEDICAL_HOSPITAL = 'Medical Hospital';
export const NEW_OUTPATIENT = 'New Outpatient';
export const SECTION_12 = 'Section 12';
export const SECTION_18 = 'Section 18';
export const SECTION_35 = 'Section 35';
export const VOLUNTARY_ER_EVAL = 'Voluntary ER Eval';

export const CLINICIAN_DISPOSITION = [
  CBAT,
  CCS,
  DAY_TREATMENT,
  DEESCALATED_ON_SCENE,
  DETOX,
  ESP_MOBILE,
  MEDICAL_HOSPITAL,
  NEW_OUTPATIENT,
  SECTION_12,
  SECTION_18,
  SECTION_35,
  VOLUNTARY_ER_EVAL,
];

export const ARRESTABLE_OFFENSE = 'Arrestable offense';
export const COMMUNITY_IMPACT_REFERRAL = 'Community Impact Referral';
export const COURTESY_TRANSPORT = 'Courtesy Transport';
export const NOTIFIED_SOMEONE = 'Notified Someone';
export const RESOLVED_ON_SCENE = 'Resolved on scene';
export const DISPOSITION = [
  ARRESTABLE_OFFENSE,
  COMMUNITY_IMPACT_REFERRAL,
  COURTESY_TRANSPORT,
  MEDICAL_HOSPITAL,
  NOTIFIED_SOMEONE,
  RESOLVED_ON_SCENE,
  SECTION_12,
  SECTION_18,
  SECTION_35,
];

export const ZERO = '0';
export const ONE = '1';
export const TWO_FIVE = '2-5';
export const SIX_PLUS = '6+';
export const PRIOR_ARREST_HISTORY = [
  ZERO,
  ONE,
  TWO_FIVE,
  SIX_PLUS,
  UNKNOWN,
];

export const CURRENT_PROVIDERS = 'Current Providers';
export const PSYCHOPHARM = 'PsychoPharm';
export const CLINICIAN_REFERRALS = [
  CURRENT_PROVIDERS,
  PSYCHOPHARM,
];

export const AGENCY_ASSISTANCE = 'Agency Assistance';
export const CCIT_CASE_CONFERENCE = 'CCIT Case Conference';
export const COMMUNITY_OUTREACH = 'Community Outreach';
export const DEATH_NOTIFICATION = 'Death Notification';
export const FAMILY_SUPPORT = 'Family Support';
export const PSYCH_EVAL = 'Psych Eval';
export const RETURN_VISIT = 'Return Visit';
export const SAFETY_CHECK = 'Safety Check';
export const VICTIM_ASSITANCE = 'Victim Assitance';
export const PURPOSE_OF_JDP = [
  AGENCY_ASSISTANCE,
  CCIT_CASE_CONFERENCE,
  COMMUNITY_OUTREACH,
  DEATH_NOTIFICATION,
  FAMILY_SUPPORT,
  PSYCH_EVAL,
  RETURN_VISIT,
  SAFETY_CHECK,
  VICTIM_ASSITANCE,
];

export const COMMUNITY_EVALUATION = 'Community Evaluation';
export const ER_EVALUATION = 'ER Evaluation';
export const BILLED_SERVICES = [
  COMMUNITY_EVALUATION,
  ER_EVALUATION,
];

export const FIRST_CALL = '1st Call';
export const SECOND_CALL = '2nd Call';
export const OUTREACH_VISIT = 'Outreach Visit';
export const OUTREACH_LETTER = 'Outreach Letter';
export const FOLLOW_UP_NATURE = [
  FOLLOW_UP,
  WELLNESS,
  FIRST_CALL,
  SECOND_CALL,
  OUTREACH_VISIT,
  OUTREACH_LETTER,
];

export const NON_CRIMINAL = 'Non-criminal';
export const PRE_ARREST = 'Pre-arrest';
export const POST_ARREST = 'Post-arrest';
export const RE_ENTRY = 'Re-entry';
export const POINT_OF_INTERVENTION = [
  NON_CRIMINAL,
  PRE_ARREST,
  POST_ARREST,
  RE_ENTRY,
];
export const COMMUNITY = 'Community';
export const COURT = 'Court';
export const CRISIS_OFFICE = 'Crisis Office';
export const HOSPITAL = 'Hospital';
export const INCARCERATION_FACILITY = 'Incarceration facility';
export const POLICE_LOCK_UP = 'Police Lock-up';
export const POLICE_STATION = 'Police Station';
export const RESIDENCE = 'Residence';
export const SCHOOL = 'School';
export const ASSESSMENT_LOCATION = [
  COMMUNITY,
  COURT,
  CRISIS_OFFICE,
  HOSPITAL,
  INCARCERATION_FACILITY,
  POLICE_LOCK_UP,
  POLICE_STATION,
  RESIDENCE,
  SCHOOL,
  OTHER,
];

export const COMMUNITY_TREATMENT_PROVIDER = 'Community Treatment Provider';
export const COURT_CLINIC = 'Court Clinic';
export const COURT_PERSONNEL = 'Court Personnel';
export const LAW_ENFORCEMENT = 'Law Enforcement';
export const PRIVATE_CITIZEN = 'Private Citizen';
export const STATE_AGENCY = 'State Agency';
export const REFERRAL_SOURCES = [
  COMMUNITY_TREATMENT_PROVIDER,
  COURT_CLINIC,
  COURT_PERSONNEL,
  LAW_ENFORCEMENT,
  PRIVATE_CITIZEN,
  SCHOOL,
  STATE_AGENCY,
];

export const FIRST_ATTEMPT = '1st Attempt';
export const SECOND_ATTEMPT = '2nd Attempt';
export const VISIT = 'Visit';
export const NO_RESPONSE = [
  FIRST_ATTEMPT,
  SECOND_ATTEMPT,
  VISIT,
  OTHER,
];

export const CIT_OFFICER_ASSESSMENT = 'CIT Officer Assessment';
export const ESP_MOBILE_CRISIS_EVAL = 'ESP/Mobile Crisis Eval';
export const INPATIENT = 'Inpatient';
export const JDP_CO_RESPONSE = 'JDP Co-response';
export const LGH = 'LGH';
export const LGH_SAINTS = 'LGH-Saints';
export const LAHEY = 'Lahey';
export const MHFA_OFFICER_ASSESSMENT = 'MHFA Officer Assessment';
export const OUTPATIENT = 'Outpatient';
export const FOLLOW_UP_DISPOSITON = [
  CIT_OFFICER_ASSESSMENT,
  COMMUNITY_OUTREACH,
  DETOX,
  ESP_MOBILE_CRISIS_EVAL,
  FAMILY_SUPPORT,
  INPATIENT,
  JDP_CO_RESPONSE,
  LGH,
  LGH_SAINTS,
  LAHEY,
  MHFA_OFFICER_ASSESSMENT,
  OUTPATIENT,
  SECTION_12,
  SECTION_18,
  SECTION_35,
];

export const PRIMARY = 'Primary';
export const SECONDARY = 'Secondary';
