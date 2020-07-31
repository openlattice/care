import { Models } from 'lattice';

const { FQN } = Models;

export const APP_NAME = 'BehavioralHealthReport';

export const APP_TYPES_FQNS = {
  APPEARS_IN_FQN: FQN.of('app.appearsin'),
  APP_SETTINGS_FQN: FQN.of('app.settings'),
  ASSIGNED_TO_FQN: FQN.of('app.assignedto'),
  BEHAVIORAL_HEALTH_REPORT_FQN: FQN.of('app.bhr'),
  BEHAVIOR_FQN: FQN.of('app.behavior'),
  CONTACTED_VIA_FQN: FQN.of('app.contactedvia'),
  CONTACT_INFORMATION_FQN: FQN.of('app.contactinformation'),
  EMERGENCY_CONTACT_FQN: FQN.of('app.emergencycontact'),
  HAS_FQN: FQN.of('app.has'),
  HAS_RELATIONSHIP_WITH_FQN: FQN.of('app.hasrelationshipwith'),
  HOSPITALS_FQN: FQN.of('app.hospitals'),
  IDENTIFYING_CHARACTERISTICS_FQN: FQN.of('app.identifyingcharacteristics'),
  IMAGE_FQN: FQN.of('app.image'),
  INTERACTION_STRATEGY_FQN: FQN.of('app.interactionstrategy'),
  ISSUE_FQN: FQN.of('app.issue'),
  IS_EMERGENCY_CONTACT_FOR_FQN: FQN.of('app.isemergencycontactfor'),
  IS_PICTURE_OF_FQN: FQN.of('app.ispictureof'),
  LOCATED_AT_FQN: FQN.of('app.locatedat'),
  LOCATION_FQN: FQN.of('app.location'),
  OBSERVED_IN_FQN: FQN.of('app.observedin'),
  OFFICERS_FQN: FQN.of('app.officers'),
  OFFICER_SAFETY_CONCERNS_FQN: FQN.of('app.officersafetyconcerns'),
  PART_OF_FQN: FQN.of('app.partof'),
  PEOPLE_FQN: FQN.of('app.people'),
  PERSON_DETAILS_FQN: FQN.of('app.persondetails'),
  PHYSICAL_APPEARANCE_FQN: FQN.of('app.physicalappearance'),
  REPORTED_FQN: FQN.of('app.reported'),
  RESPONSE_PLAN_FQN: FQN.of('app.responseplan'),
  STAFF_FQN: FQN.of('app.staff'),
  STAY_AWAY_LOCATION_FQN: FQN.of('app.stayawaylocation'),
  SUBJECT_OF_FQN: FQN.of('app.subjectof'),

  INCIDENT_FQN: FQN.of('app.incident_new'),
  CALL_FOR_SERVICE_FQN: FQN.of('app.callforservice'),
  NATURE_OF_CRISIS_FQN: FQN.of('app.natureofcrisis'),
  DIAGNOSIS_FQN: FQN.of('app.diagnosis'),
  MEDICATION_STATEMENT_FQN: FQN.of('app.medicationstatement'),
  SUBSTANCE_FQN: FQN.of('app.substance'),
  WEAPON_FQN: FQN.of('app.weapon'),
  VIOLENT_BEHAVIOR_FQN: FQN.of('app.violentbehavior'),
  INJURY_FQN: FQN.of('app.injury'),
  SELF_HARM_FQN: FQN.of('app.selfharm'),
  HOUSING_FQN: FQN.of('app.housing'),
  OCCUPATION_FQN: FQN.of('app.occupation'),
  INCOME_FQN: FQN.of('app.income'),
  INSURANCE_FQN: FQN.of('app.insurance'),
  INVOLVED_IN_FQN: FQN.of('app.involvedin'),
  ENCOUNTER_FQN: FQN.of('app.encounters'),
  ENCOUNTER_DETAILS_FQN: FQN.of('app.encounterdetails'),
  INVOICE_FQN: FQN.of('app.invoice'),
  REFERRAL_REQUEST_FQN: FQN.of('app.referralrequest'),
  CRISIS_REPORT_CLINICIAN_FQN: FQN.of('app.crisisreport_clinician'),
  CRISIS_REPORT_FQN: FQN.of('app.crisisreport_officer'),
  FOLLOW_UP_REPORT_FQN: FQN.of('app.followupreport'),

  DISPOSITION_FQN: FQN.of('app.disposition'),
  OFFENSE_FQN: FQN.of('app.offense'),
  CLEARED_BY_FQN: FQN.of('app.clearedby'),
  GENERAL_PERSON_FQN: FQN.of('app.generalperson'),
  CHARGE_EVENT_FQN: FQN.of('app.chargeevent'),
  CHARGE_FQN: FQN.of('app.charge'),
  REGISTERED_FOR_FQN: FQN.of('app.registeredfor'),

  // protected
  DISPOSITION_CLINICIAN_FQN: FQN.of('app.disposition_clinician'),
  MEDICATION_STATEMENT_CLINICIAN_FQN: FQN.of('app.medicationstatement_clinician'),
  DIAGNOSIS_CLINICIAN_FQN: FQN.of('app.diagnosis_clinician'),
  SUBSTANCE_CLINICIAN_FQN: FQN.of('app.substance_clinician'),
  BEHAVIOR_CLINICIAN_FQN: FQN.of('app.behavior_clinician'),
  SELF_HARM_CLINICIAN_FQN: FQN.of('app.selfharm_clinician'),

  /* <===== BEGIN LONG BEACH HACK =====> */
  FILED_FOR_FQN: FQN.of('app.filed_for'),
  PROBATION_FQN: FQN.of('app.probation'),
  SERVED_WITH_FQN: FQN.of('app.served_with'),
  SERVICES_OF_PROCESS_FQN: FQN.of('app.services_of_process'),
  WARRANTS_FQN: FQN.of('app.warrants'),
  /* <===== END LONG BEACH HACK =====> */
  /* <===== BEGIN LIVERMORE HACK =====> */
  ENCAMPMENT_FQN: FQN.of('app.encampment'),
  ENCAMPMENT_LOCATION_FQN: FQN.of('app.encampmentlocation'),
  LIVES_AT_FQN: FQN.of('app.livesat_new'),
  /* <===== END LIVERMORE HACK =====> */
  /* <===== SYMPTOMS ======> */
  SYMPTOM_FQN: FQN.of('app.symptom'),
  INTERACTED_WITH_FQN: FQN.of('app.interactedwith'),
  /* <===== END SYMPTOMS ======> */

  FORMS_FQN: FQN.of('app.forms')
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
