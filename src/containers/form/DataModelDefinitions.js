/*
 * @flow
 */

import Immutable from 'immutable';
import randomUUID from 'uuid/v4';

/*
 * Complainant Information Section
 */

type ComplainantInfo = {
  complainantAddress :string;
  complainantConsumerRelationship :string;
  complainantName :string;
  complainantPhone :string;
};

const COMPLAINANT_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  complainantAddress: '',
  complainantConsumerRelationship: '',
  complainantName: '',
  complainantPhone: ''
});

function getComplainantInfoInitialState() :ComplainantInfo {
  return (COMPLAINANT_INFO_INITIAL_STATE.toJS() :any);
}

/*
 * Consumer Information Section
 */

type ConsumerInfo = {
  address :string;
  age :string;
  armedWeaponType :string;
  armedWithWeapon :boolean;
  accessibleWeaponType :string;
  accessToWeapons :boolean;
  directedagainst :string[];
  directedagainstother :string;
  dob :string;
  drugsAlcohol :string;
  drugType :string;
  emotionalState :string[];
  emotionalStateOther :string;
  firstName :string;
  gender :string;
  historicaldirectedagainst :string[];
  historicaldirectedagainstother :string;
  historyofviolence :boolean;
  historyofviolencetext :string;
  homeless :boolean;
  homelessLocation :string;
  identification :string;
  injuries :string[];
  injuriesOther :string;
  lastName :string;
  middleName :string;
  militaryStatus :string;
  observedBehaviors :string[];
  observedBehaviorsOther :string;
  phone :string;
  photosTakenOf :string[];
  picture :string;
  prescribedMedication :string;
  prevPsychAdmission :string;
  race :string;
  scale1to10 :number;
  selfDiagnosis :string[];
  selfDiagnosisOther :string;
  suicidal :boolean;
  suicidalActions :string[];
  suicideAttemptMethod :string[];
  suicideAttemptMethodOther :string;
  takingMedication :string;
};

const CONSUMER_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  address: '',
  age: '',
  armedWeaponType: '',
  armedWithWeapon: false,
  accessibleWeaponType: '',
  accessToWeapons: false,
  directedagainst: [],
  directedagainstother: '',
  dob: '',
  drugsAlcohol: '',
  drugType: '',
  emotionalState: [],
  emotionalStateOther: '',
  firstName: '',
  gender: '',
  historicaldirectedagainst: [],
  historicaldirectedagainstother: '',
  historyofviolence: false,
  historyofviolencetext: '',
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
  picture: '',
  prescribedMedication: '',
  prevPsychAdmission: '',
  race: '',
  scale1to10: 1,
  selfDiagnosis: [],
  selfDiagnosisOther: '',
  suicidal: false,
  suicidalActions: [],
  suicideAttemptMethod: [],
  suicideAttemptMethodOther: '',
  takingMedication: ''
});

function getConsumerInfoInitialState() :ConsumerInfo {

  const info = CONSUMER_INFO_INITIAL_STATE.toJS();
  info.identification = randomUUID();
  return (info :any);
}

/*
 * Disposition Information Section
 */

type DispositionInfo = {
  deescalationscale :number;
  deescalationTechniques :string[];
  deescalationTechniquesOther :string;
  disposition :string[];
  hospitaltransportindicator :boolean;
  hospitalTransport :boolean;
  hospital :string;
  hospitalname :string;
  incidentNarrative :string;
  referraldestination :string;
  referralprovidedindicator :boolean;
  specializedResourcesCalled :string[];
  stabilizedindicator :boolean;
  TransportingAgency :string;
  voluntaryactionindicator ? :boolean;
};

const DISPOSITION_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  deescalationscale: 1,
  deescalationTechniques: [],
  deescalationTechniquesOther: '',
  disposition: [],
  hospitaltransportindicator: false,
  hospitalTransport: false,
  hospital: '',
  hospitalname: '',
  incidentNarrative: '',
  referraldestination: '',
  referralprovidedindicator: false,
  specializedResourcesCalled: [],
  stabilizedindicator: false,
  TransportingAgency: '',
  voluntaryactionindicator: null
});

function getDispositionInfoInitialState() :DispositionInfo {
  return (DISPOSITION_INFO_INITIAL_STATE.toJS() :any);
}

/*
 * Officer Information Section
 */

type OfficerInfo = {
  officerCertification :string[];
  officerInjuries :string;
  officerName :string;
  officerSeqID :string;
};

const OFFICER_INFO_INITIAL_STATE :Map<string, *> = Immutable.fromJS({
  officerCertification: [],
  officerInjuries: '',
  officerName: '',
  officerSeqID: ''
});

function getOfficerInfoInitialState() :OfficerInfo {
  return (OFFICER_INFO_INITIAL_STATE.toJS() :any);
}

/*
 * Report Information Section
 */

type ReportInfo = {
  cadNumber :string;
  companionOffenseReport :boolean;
  complaintNumber :string;
  dateOccurred :string;
  dateReported :string;
  dispatchReason :string;
  incident :string;
  locationOfIncident :string;
  name :string;
  unit :string;
  onView :boolean;
  postOfOccurrence :string;
  timeOccurred :string;
  timeReported :string;
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

function getReportInfoInitialState() :ReportInfo {
  return (REPORT_INFO_INITIAL_STATE.toJS() :any);
}

export {
  getComplainantInfoInitialState,
  getConsumerInfoInitialState,
  getDispositionInfoInitialState,
  getOfficerInfoInitialState,
  getReportInfoInitialState
};

export type {
  ComplainantInfo,
  ConsumerInfo,
  DispositionInfo,
  OfficerInfo,
  ReportInfo
};
