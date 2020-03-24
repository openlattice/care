export const SUICIDE_BEHAVIORS = 'Suicide behaviors';

export const BEHAVIORS = [
  'Belligerent / Uncooperative',
  'Bizzare, unusual behavior',
  'Disorientation / Confusion',
  'Disorganized speech / Communication',
  'Disorderly / Disruptive',
  'Hallucinations / Delusions',
  'Hopeless / Depressed',
  'Mania',
  'Neglect of self care',
  'Out of touch with reality',
  'Paranoid',
  SUICIDE_BEHAVIORS,
];

export const SUICIDE_ACTION_TYPE = [
  'Threat',
  'Attempt'
];

export const SUICIDE_METHODS = [
  'Overdose',
  'Weapon',
  'Hanging',
  'Jump',
  'Suicide by cop',
];

export const DEMEANORS = [
  'Belligerent / Uncooperative',
  'Charged / Attacked Officer',
  'Cooperative / Attentive',
  'Distant / Removed',
  'Scared / Nervous',
  'Verbally threatening / Aggressive',
];

export const BIOLOGICAL = 'Biologically Induced (Depression / Anxiety)';
export const CHEMICAL = 'Chemically Induced (Crack / Meth / PCP / Heroin)';

export const NATURE_OF_CRISIS = [
  BIOLOGICAL,
  'Medically Induced (Traumatic Brain Injury / UTI)',
  CHEMICAL,
  'Excited Delirium',
  'Unknown'
];

export const BIOLOGICAL_CAUSES = [
  'Depression',
  'Anxiety',
  'Schizophrenia',
  'Bipolar',
  'PTSD'
];

export const CHEMICAL_CAUSES = [
  'OTC',
  'Prescription',
  'Illicit',
  'Poison'
];

export const ASSISTANCES = [
  'Case Manager / Service Provider',
  'Spouse / Partner / Girlfriend / Boyfriend',
  'Family Member',
  'Friend',
  'Neighbor',
];

export const HOMELESS_STR = 'Unsheltered Homeless';

export const HOUSING_SITUATIONS = [
  'Stable Housing',
  'Service Provider Housing',
  'Homeless Shelter',
  HOMELESS_STR,
  'Unknown'
];

export const TECHNIQUES = [
  'Verbal',
  'Handcuffs',
  'Use of force'
];

export const WEAPONS = [
  'Knife',
  'Gun',
];

export const RELATIONSHIP_TYPES = [
  'Co-Worker',
  'Family Member',
  'Frequent Contact / Associate',
  'Neighbor',
  'Unknown'
];

export const PERSON_TYPES = [
  'Officer',
  'Family',
  'Bystander',
];

export const INJURY_TYPES = [
  'Abrasion',
  'Bruise',
  'Burn',
  'Complaint of pain only',
  'Concussion',
  'Death',
  'Gunshot',
  'Human Bite',
  'Laceration',
  'Other sickness',
  'Soft tissue damage',
  'Sprain / strain / twist',
  'Unconscious',
  'No injuries noted or visible',
];

export const OFFICER_TRAINING = [
  'Officer with 40-hour CIT training',
  'Co-responder (mental health professional)'
];

export const DISPOSITIONS = {
  NOTIFIED_SOMEONE: 'Notified Someone',
  VERBAL_REFERRAL: 'Verbal Referral',
  COURTESY_TRANPORT: 'Courtesy Transport',
  HOSPITAL: 'Hospital',
  ADMINISTERED_DRUG: 'Administered naloxene or narcan',
  ARRESTABLE_OFFENSE: 'Arrestable offense',
  NO_ACTION_POSSIBLE: 'No action possible'
};

export const PEOPLE_NOTIFIED = [
  'Case Manager / MH agency notified',
  'Family member',
];

export const VERBAL_REFERRALS = [
  'Local service provider',
  'Mental health service provider',
  'Alcohol and/or drug treatment',
  'LEAD',
  'Shelter',
];

export const COURTESY_TRANSPORTS = [
  'To shelter',
  'Emergency crisis center',
  'Home',
  'Drug/alcohol detox assistance',
  'General'
];

export const NOT_ARRESTED = 'Not arrested';
export const ARRESTED = 'Arrested';
export const CRIMES_AGAINST_PERSON = 'Crimes against person';
export const FELONY = 'Felony';

export const ARRESTABLE_OFFENSES = [
  NOT_ARRESTED,
  ARRESTED,
  CRIMES_AGAINST_PERSON,
  FELONY
];

export const UNABLE_TO_CONTACT = 'Unable to contact';
export const NO_ACTION_NECESSARY = 'No action possible / necessary';
export const RESOURCES_DECLINED = 'Resources offered + declined';

export const NO_ACTION_VALUES = [
  UNABLE_TO_CONTACT,
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED
];

export const VOLUNTARY = [
  'Voluntary',
  'Involuntary',
];
