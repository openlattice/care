/*
 * @flow
 */

/*
 * Complainant Information Section
 */

const COMPLAINANT_INFO_INITIAL_STATE :Object = {
  complainantAddress: '',
  complainantConsumerRelationship: '',
  complainantName: '',
  complainantPhone: ''
};

type ComplainantInfo = {
  complainantAddress :string,
  complainantConsumerRelationship :string,
  complainantName :string,
  complainantPhone :string
};

/*
 * Consumer Information Section
 */

const CONSUMER_INFO_INITIAL_STATE :Object = {
  address: '',
  age: '',
  armedWeaponType: '',
  armedWithWeapon: false,
  accessibleWeaponType: '',
  accessToWeapons: false,
  dob: '',
  drugsAlcohol: '',
  drugType: '',
  emotionalState: [],
  emotionalStateOther: '',
  firstName: '',
  gender: '',
  homeless: false,
  homelessLocation: '',
  identification: '',
  injuries: [],
  injuriesOther: '',
  lastName: '',
  middleName: '',
  militaryStatus: '',
  observedBehaviors: [],
  observedBehaviorsOther: '',
  phone: '',
  photosTakenOf: [],
  prescribedMedication: '',
  prevPsychAdmission: '',
  race: '',
  selfDiagnosis: [],
  selfDiagnosisOther: '',
  suicidal: false,
  suicidalActions: [],
  suicideAttemptMethod: [],
  suicideAttemptMethodOther: '',
  takingMedication: ''
};

type ConsumerInfo = {
  address :string,
  age :string,
  armedWeaponType :string,
  armedWithWeapon :boolean,
  accessibleWeaponType :string,
  accessToWeapons :boolean,
  dob :string,
  drugsAlcohol :string,
  drugType :string,
  emotionalState :string[],
  emotionalStateOther :string,
  firstName :string,
  gender :string,
  homeless :boolean,
  homelessLocation :string,
  identification :string,
  injuries :string[],
  injuriesOther :string,
  lastName :string,
  middleName :string,
  militaryStatus :string,
  observedBehaviors :string[],
  observedBehaviorsOther :string,
  phone :string,
  photosTakenOf :string[],
  prescribedMedication :string,
  prevPsychAdmission :string,
  race :string,
  selfDiagnosis :string[],
  selfDiagnosisOther :string,
  suicidal :boolean,
  suicidalActions :string[],
  suicideAttemptMethod :string[],
  suicideAttemptMethodOther :string,
  takingMedication :string
};

/*
 * Disposition Information Section
 */

const DISPOSITION_INFO_INITIAL_STATE :Object = {
  deescalationTechniques: [],
  deescalationTechniquesOther: '',
  disposition: [],
  hospitalTransport: false,
  hospital: '',
  incidentNarrative: '',
  specializedResourcesCalled: []
};

type DispositionInfo = {
  deescalationTechniques :string[],
  deescalationTechniquesOther :string,
  disposition :string[],
  hospitalTransport :boolean,
  hospital :string,
  incidentNarrative :string,
  specializedResourcesCalled :string[],
};

/*
 * Officer Information Section
 */

const OFFICER_INFO_INITIAL_STATE :Object = {
  officerCertification: [],
  officerInjuries: '',
  officerName: '',
  officerSeqID: ''
};

type OfficerInfo = {
  officerCertification :string[],
  officerInjuries :string,
  officerName :string,
  officerSeqID :string
};

/*
 * Report Information Section
 */

const REPORT_INFO_INITIAL_STATE :Object = {
  cadNumber: '',
  companionOffenseReport: false,
  complaintNumber: '',
  dateOccurred: '',
  dateReported: '',
  dispatchReason: '',
  incident: '',
  locationOfIncident: '',
  name: '', // WHAT IS NAME USED FOR?
  unit: '',
  onView: false,
  postOfOccurrence: '',
  timeOccurred: '',
  timeReported: ''
};

type ReportInfo = {
  cadNumber :string,
  companionOffenseReport :boolean,
  complaintNumber :string,
  dateOccurred :string,
  dateReported :string,
  dispatchReason :string,
  incident :string,
  locationOfIncident :string,
  name :string,
  unit :string,
  onView :boolean,
  postOfOccurrence :string,
  timeOccurred :string,
  timeReported :string
};

export {
  COMPLAINANT_INFO_INITIAL_STATE,
  CONSUMER_INFO_INITIAL_STATE,
  REPORT_INFO_INITIAL_STATE,
  DISPOSITION_INFO_INITIAL_STATE,
  OFFICER_INFO_INITIAL_STATE
};

export type {
  ComplainantInfo,
  ConsumerInfo,
  DispositionInfo,
  OfficerInfo,
  ReportInfo
};
