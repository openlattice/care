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
  PERSON_DETAILS_FQN: new FullyQualifiedName('app.persondetails'),
  PHYSICAL_APPEARANCE_FQN: new FullyQualifiedName('app.physicalappearance'),
  REPORTED_FQN: new FullyQualifiedName('app.reported'),
  RESPONSE_PLAN_FQN: new FullyQualifiedName('app.responseplan'),
  STAFF_FQN: new FullyQualifiedName('app.staff'),
  STAY_AWAY_LOCATION_FQN: new FullyQualifiedName('app.stayawaylocation'),
  SUBJECT_OF_FQN: new FullyQualifiedName('app.subjectof'),

  INCIDENT_FQN: new FullyQualifiedName('app.incident_new'),
  CALL_FOR_SERVICE_FQN: new FullyQualifiedName('app.callforservice'),
  NATURE_OF_CRISIS_FQN: new FullyQualifiedName('app.natureofcrisis'),
  DIAGNOSIS_FQN: new FullyQualifiedName('app.diagnosis'),
  MEDICATION_STATEMENT_FQN: new FullyQualifiedName('app.medicationstatement'),
  SUBSTANCE_FQN: new FullyQualifiedName('app.substance'),
  WEAPON_FQN: new FullyQualifiedName('app.weapon'),
  VIOLENT_BEHAVIOR_FQN: new FullyQualifiedName('app.violentbehavior'),
  INJURY_FQN: new FullyQualifiedName('app.injury'),
  SELF_HARM_FQN: new FullyQualifiedName('app.selfharm'),
  HOUSING_FQN: new FullyQualifiedName('app.housing'),
  OCCUPATION_FQN: new FullyQualifiedName('app.occupation'),
  INCOME_FQN: new FullyQualifiedName('app.income'),
  INSURANCE_FQN: new FullyQualifiedName('app.insurance'),
  INVOLVED_IN_FQN: new FullyQualifiedName('app.involvedin'),
  ENCOUNTER_FQN: new FullyQualifiedName('app.encounters'),
  ENCOUNTER_DETAILS_FQN: new FullyQualifiedName('app.encounterdetails'),
  INVOICE_FQN: new FullyQualifiedName('app.invoice'),
  REFERRAL_REQUEST_FQN: new FullyQualifiedName('app.referralrequest'),
  CRISIS_REPORT_CLINICIAN_FQN: new FullyQualifiedName('app.crisisreport_clinician'),
  CRISIS_REPORT_FQN: new FullyQualifiedName('app.crisisreport_officer'),
  FOLLOW_UP_REPORT_FQN: new FullyQualifiedName('app.followupreport'),

  DISPOSITION_FQN: new FullyQualifiedName('app.disposition'),
  OFFENSE_FQN: new FullyQualifiedName('app.offense'),
  CLEARED_BY_FQN: new FullyQualifiedName('app.clearedby'),
  GENERAL_PERSON_FQN: new FullyQualifiedName('app.generalperson'),

  // protected
  DISPOSITION_CLINICIAN_FQN: new FullyQualifiedName('app.disposition_clinician'),
  MEDICATION_STATEMENT_CLINICIAN_FQN: new FullyQualifiedName('app.medicationstatement_clinician'),
  DIAGNOSIS_CLINICIAN_FQN: new FullyQualifiedName('app.diagnosis_clinician'),
  SUBSTANCE_CLINICIAN_FQN: new FullyQualifiedName('app.substance_clinician'),
  BEHAVIOR_CLINICIAN_FQN: new FullyQualifiedName('app.behavior_clinician'),
  SELF_HARM_CLINICIAN_FQN: new FullyQualifiedName('app.selfharm_clinician'),

  /* <===== BEGIN LONG BEACH HACK =====> */
  FILED_FOR_FQN: new FullyQualifiedName('app.filed_for'),
  PROBATION_FQN: new FullyQualifiedName('app.probation'),
  SERVED_WITH_FQN: new FullyQualifiedName('app.served_with'),
  SERVICES_OF_PROCESS_FQN: new FullyQualifiedName('app.services_of_process'),
  WARRANTS_FQN: new FullyQualifiedName('app.warrants'),
  /* <===== END LONG BEACH HACK =====> */
  /* <===== BEGIN LIVERMORE HACK =====> */
  ENCAMPMENT_FQN: new FullyQualifiedName('app.encampment'),
  ENCAMPMENT_LOCATION_FQN: new FullyQualifiedName('app.encampmentlocation'),
  LIVES_AT_FQN: new FullyQualifiedName('app.livesat_new'),
  /* <===== END LIVERMORE HACK =====> */
  /* <===== SYMPTOMS ======> */
  SYMPTOM_FQN: new FullyQualifiedName('app.symptom'),
  INTERACTED_WITH_FQN: new FullyQualifiedName('app.interactedwith'),
  /* <===== END SYMPTOMS ======> */

  FORMS_FQN: new FullyQualifiedName('app.forms')
};

export const STRING_ID_FQN = 'general.stringid';

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
