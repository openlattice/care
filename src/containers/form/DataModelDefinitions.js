/*
 * @flow
 */

import Immutable from 'immutable';
import randomUUID from 'uuid/v4';

/*
 * Complainant Information Section
 */

type ComplainantInfo = {
  complainantAddress :string,
  complainantConsumerRelationship :string,
  complainantName :string,
  complainantPhone :string
};

const COMPLAINANT_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  complainantAddress: '',
  complainantConsumerRelationship: '',
  complainantName: '',
  complainantPhone: ''
});

/*
 * Consumer Information Section
 */

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

const CONSUMER_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
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
  identification: randomUUID(),
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
});

/*
 * Disposition Information Section
 */

type DispositionInfo = {
  deescalationTechniques :string[],
  deescalationTechniquesOther :string,
  disposition :string[],
  hospitalTransport :boolean,
  hospital :string,
  incidentNarrative :string,
  specializedResourcesCalled :string[],
};

const DISPOSITION_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  deescalationTechniques: [],
  deescalationTechniquesOther: '',
  disposition: [],
  hospitalTransport: false,
  hospital: '',
  incidentNarrative: '',
  specializedResourcesCalled: []
});

/*
 * Officer Information Section
 */

type OfficerInfo = {
  officerCertification :string[],
  officerInjuries :string,
  officerName :string,
  officerSeqID :string
};

const OFFICER_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  officerCertification: [],
  officerInjuries: '',
  officerName: '',
  officerSeqID: ''
});

/*
 * Report Information Section
 */

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

const REPORT_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
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
});

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
