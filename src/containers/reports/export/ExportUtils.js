// @flow

import { j2xParser as Parser } from 'fast-xml-parser';
import { List, Map } from 'immutable';
import { DateTimeUtils, LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import FileSaver from '../../../utils/FileSaver';
import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { NEIGHBOR_DETAILS } from '../../../utils/constants/EntityConstants';
import { TEXT_XML, XML_HEADER } from '../../../utils/constants/FileTypeConstants';
import { HISPANIC, NON_HISPANIC } from '../../profile/constants';
import {
  CURRENT,
  EMS,
  EMS_FIRE,
  FIRE,
  NA,
  NO,
  NONE,
  OTHER,
  PAST,
  PRIMARY,
  SECONDARY,
  UNKNOWN,
  YES,
} from '../crisis/schemas/constants';

const { isNonEmptyString } = LangUtils;
const { calculateAge } = DateTimeUtils;

type JDPRecord = {
  EntryDate :?string;
  JDPID :?string;
  JDPOpt :?string;
  IncDate :?string;
  IncOpt :?string;
  CompletedOpt :?string;
  LocationOpt :?string;
  NoCOpt :?string;
  NoCOther :?string;
  PoIOpt :?string;
  AgeOpt :?string;
  GndrOpt :?string;
  MilSrvOpt :?string;
  SAcurrtOpt :?string;
  AddlSptOSOpt :?string;
  JDOpt :?string;
  CDOpt :?string;
  CDCharge :?string;
  ACCOpt :?string;
  CAOpt :?string;
  CAOth :?string;
  PurpOpt :?string;
  PurpOth :?string;
  EROpt :?string;
  PrimSrcOpt :?string;
  SecSrcOpt :?string;
  BillOpt :?string;
  WhatSrvOpt :?string;
  RefSrcOpt :?string;
  KnownOpt :?string;
  HPOpt :?string;
  RaceOpt :?string;
  EmpSrcOpt :?string;
  LivOpt :?string;
  WithOpt :?string;
  WithOth :?string;
  PriorOpt :?string;
  SubOpt :?string;
  PresOpt :?string;
  Note :?string;
  DocSent :?string;
}

const {
  CRISIS_REPORT_CLINICIAN_FQN,
  // CRISIS_REPORT_FQN,
  CALL_FOR_SERVICE_FQN,
  CHARGE_FQN,
  CHARGE_EVENT_FQN,
  DISPOSITION_CLINICIAN_FQN,
  EMPLOYEE_FQN,
  ENCOUNTER_DETAILS_FQN,
  ENCOUNTER_FQN,
  GENERAL_PERSON_FQN,
  HOUSING_FQN,
  INCIDENT_FQN,
  INCOME_FQN,
  INSURANCE_FQN,
  INVOICE_FQN,
  LOCATION_FQN,
  OCCUPATION_FQN,
  OFFENSE_FQN,
  REFERRAL_REQUEST_FQN,
  REFERRAL_SOURCE_FQN,
  SUBSTANCE_CLINICIAN_FQN,
} = APP_TYPES_FQNS;

const pipe = (...fns) => (init) => fns.reduce((piped, f) => f(piped), init);

type ReportData = {
  clinicianReportData :Map;
  crisisReportData :Map;
  person :Map;
  personDetails :Map;
  title :string;
};

type XMLPayload = {|
  errors :string[];
  jdpRecord :JDPRecord;
  reportData :ReportData;
|};

/* eslint-disable no-param-reassign */
const insertEntryDate = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const entryDate = clinicianReportData
    .getIn([CRISIS_REPORT_CLINICIAN_FQN, 0, NEIGHBOR_DETAILS, FQN.COMPLETED_DT_FQN, 0]);
  const entryDateDT = DateTime.fromISO(entryDate);
  if (entryDateDT.isValid) {
    xmlPayload.jdpRecord.EntryDate = entryDateDT.toLocaleString(DateTime.DATE_SHORT);
  }
  else {
    xmlPayload.jdpRecord.EntryDate = '';
    xmlPayload.errors.push('Invalid entry datetime');
  }

  return xmlPayload;
};

const insertJDP = (xmlPayload :XMLPayload) => {
  const { clinicianReportData, title } = xmlPayload.reportData;
  xmlPayload.jdpRecord.JDPOpt = title;

  const incidentID = clinicianReportData
    .getIn([INCIDENT_FQN, 0, NEIGHBOR_DETAILS, FQN.CRIMINALJUSTICE_CASE_NUMBER_FQN, 0]);

  if (isNonEmptyString(incidentID)) {
    xmlPayload.jdpRecord.JDPID = incidentID;
  }
  else {
    xmlPayload.jdpRecord.JDPID = '';
    xmlPayload.errors.push('Invalid "Incident #"');
  }

  return xmlPayload;
};

const insertIncidentDate = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const incidentDatetime = clinicianReportData
    .getIn([INCIDENT_FQN, 0, NEIGHBOR_DETAILS, FQN.DATETIME_START_FQN, 0]);

  const incidentDT = DateTime.fromISO(incidentDatetime);

  if (incidentDT.isValid) {
    const { hour } = incidentDT.toLocal();
    let shift = 'Evening';
    if (hour < 16) shift = 'Daytime';
    if (hour < 8) shift = 'Overnight';

    xmlPayload.jdpRecord.IncDate = incidentDT.toLocaleString(DateTime.DATE_SHORT);
    xmlPayload.jdpRecord.IncOpt = shift;
  }
  else {
    xmlPayload.jdpRecord.IncDate = '';
    xmlPayload.jdpRecord.IncOpt = '';
    xmlPayload.errors.push('Invalid "Incident datetime"');
  }
  return xmlPayload;
};

const insertAssessmentCompleted = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const completedBy = clinicianReportData
    .getIn([EMPLOYEE_FQN, 0, NEIGHBOR_DETAILS, FQN.CATEGORY_FQN, 0]);

  if (isNonEmptyString(completedBy)) {
    xmlPayload.jdpRecord.CompletedOpt = completedBy;
  }
  else {
    xmlPayload.jdpRecord.CompletedOpt = '';
    xmlPayload.errors.push('Invalid "Assessment completed by"');
  }
  return xmlPayload;
};

const insertLocation = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const locationCategory = clinicianReportData
    .getIn([LOCATION_FQN, 0, NEIGHBOR_DETAILS, FQN.TYPE_FQN, 0]);

  if (isNonEmptyString(locationCategory)) {
    xmlPayload.jdpRecord.LocationOpt = locationCategory;
  }
  else {
    xmlPayload.errors.push('Invalid "Location Category"');
  }

  return xmlPayload;
};

const insertNatureOfCall = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const natureOfCall = clinicianReportData
    .getIn([CALL_FOR_SERVICE_FQN, 0, NEIGHBOR_DETAILS, FQN.TYPE_FQN], List());
  const natureOfCallValue = natureOfCall.get(0);
  const natureOfCallOther = natureOfCall.get(1);

  if (isNonEmptyString(natureOfCallValue)) {
    xmlPayload.jdpRecord.NoCOpt = natureOfCallValue;
    xmlPayload.jdpRecord.NoCOther = natureOfCallOther;
  }
  else {
    xmlPayload.jdpRecord.NoCOpt = '';
    xmlPayload.jdpRecord.NoCOther = '';
    xmlPayload.errors.push('Invalid "Nature of Call"');
  }

  return xmlPayload;
};

const insertPointOfIntervention = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const pointOfIntervention = clinicianReportData
    .getIn([ENCOUNTER_FQN, 0, NEIGHBOR_DETAILS, FQN.SERVICE_TYPE_FQN, 0]);

  if (isNonEmptyString(pointOfIntervention)) {
    xmlPayload.jdpRecord.PoIOpt = pointOfIntervention;
  }
  else {
    xmlPayload.jdpRecord.PoIOpt = '';
    xmlPayload.errors.push('Invalid "Point of Intervention"');
  }
  return xmlPayload;
};

const insertAgeRange = (xmlPayload :XMLPayload) => {
  const { person } = xmlPayload.reportData;
  const dob = person.getIn([FQN.PERSON_DOB_FQN, 0]);
  const age = calculateAge(dob);
  if (age !== -1) {
    let ageRange = '66+';
    if (age < 66) ageRange = '46 to 65';
    if (age < 46) ageRange = '27 to 45';
    if (age < 27) ageRange = '22 to 26';
    if (age < 22) ageRange = '17 to 21';
    if (age < 17) ageRange = '12 to 16';
    if (age < 12) ageRange = '3 to 11';
    // younger than 3 not spec'd
    xmlPayload.jdpRecord.AgeOpt = ageRange;
  }
  else {
    xmlPayload.jdpRecord.AgeOpt = '';
    xmlPayload.errors.push('Invalid date of birth/age range. Update subject profile.');
  }

  return xmlPayload;
};

const insertGender = (xmlPayload :XMLPayload) => {
  const { person } = xmlPayload.reportData;
  const sex = person.getIn([FQN.PERSON_SEX_FQN, 0]);

  if (isNonEmptyString(sex)) {
    xmlPayload.jdpRecord.GndrOpt = sex;
  }
  else {
    xmlPayload.jdpRecord.GndrOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid sex. Defaulting to "${UNKNOWN}"`);
  }
  return xmlPayload;
};

const insertMilitaryService = (xmlPayload :XMLPayload) => {
  const { personDetails } = xmlPayload.reportData;
  const veteranStatus = personDetails.getIn([FQN.VETERAN_STATUS_FQN, 0]);

  if (isNonEmptyString(veteranStatus)) {
    xmlPayload.jdpRecord.MilSrvOpt = veteranStatus;
  }
  else {
    xmlPayload.jdpRecord.MilSrvOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid history of military service. Defaulting to "${UNKNOWN}"`);
  }
  return xmlPayload;
};

const getYesNoUnknownFromList = (list :List<string>) :?string => {
  const hasNone = list.includes(NONE);
  const hasUnknown = list.includes(UNKNOWN);

  if (!list.size) return undefined;
  if (hasNone) return NO;
  if (hasUnknown) return UNKNOWN;
  return YES;
};

const insertSubstance = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const substances = clinicianReportData
    .get(SUBSTANCE_CLINICIAN_FQN, List())
    .map((neighbor) => neighbor.get(NEIGHBOR_DETAILS, Map()));

  const currentEntity = substances
    .find((neighbor) => neighbor.getIn([FQN.TEMPORAL_STATUS_FQN, 0]) === CURRENT) || Map();

  const currentType :List = currentEntity.get(FQN.TYPE_FQN, List());
  const current = getYesNoUnknownFromList(currentType);
  if (current) {
    xmlPayload.jdpRecord.SAcurrtOpt = current;
  }
  else {
    xmlPayload.jdpRecord.SAcurrtOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid "Substance use during incident". Defaulting to "${UNKNOWN}"`);
  }

  const historyEntity = substances
    .find((neighbor) => neighbor.getIn([FQN.TEMPORAL_STATUS_FQN, 0]) === PAST) || Map();

  const historyType :List = historyEntity.get(FQN.TYPE_FQN, List());
  const history = getYesNoUnknownFromList(historyType);
  if (history) {
    xmlPayload.jdpRecord.SubOpt = history;
  }
  else {
    xmlPayload.jdpRecord.SubOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid "History of substance abuse/treatment". Defaulting to "${UNKNOWN}"`);
  }

  return xmlPayload;
};

const getAdditionalSupportFromList = (list :List<string>) :?string => {
  const hasNone = list.includes(NONE);
  const hasFire = list.includes(FIRE);
  const hasEMS = list.includes(EMS);
  const hasOther = list.includes(OTHER);

  if (hasNone) return NONE;
  if (hasEMS && hasFire) return EMS_FIRE;
  if (hasEMS) return EMS;
  if (hasFire) return FIRE;
  if (hasOther || list.size) return OTHER;

  return undefined;
};

const insertAdditionalSupport = (xmlPayload :XMLPayload) => {
  const { crisisReportData } = xmlPayload.reportData;
  const additionalSupport = crisisReportData
    .getIn([GENERAL_PERSON_FQN, 0, NEIGHBOR_DETAILS, FQN.CATEGORY_FQN]);

  const support = getAdditionalSupportFromList(additionalSupport);
  if (support) {
    xmlPayload.jdpRecord.AddlSptOSOpt = support;
  }
  else {
    xmlPayload.jdpRecord.AddlSptOSOpt = NONE;
    xmlPayload.errors.push(`Invalid "Assistance on scene". Defaulting to ${NONE}`);
  }

  return xmlPayload;
};

const insertJailDiversion = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const encounterDetails = clinicianReportData
    .getIn([ENCOUNTER_DETAILS_FQN, 0, NEIGHBOR_DETAILS], Map());

  const jailDiversion = encounterDetails.getIn([FQN.LAW_ENFORCEMENT_INVOLVEMENT_FQN, 0]);
  xmlPayload.jdpRecord.JDOpt = jailDiversion ? 'Yes' : 'No';
  if (jailDiversion === undefined) {
    xmlPayload.errors.push(`Invalid "Was jail diversion an option?". Defaulting to ${NO}`);
  }

  const reasonProperty = encounterDetails.get(FQN.REASON_FQN, List());
  xmlPayload.jdpRecord.PurpOpt = '';
  xmlPayload.jdpRecord.PurpOth = '';

  if (!reasonProperty.size) {
    xmlPayload.errors.push('Invalid "Reason for JDP intervention"');
  }
  else if (reasonProperty.size === 1) {
    xmlPayload.jdpRecord.PurpOpt = reasonProperty.first();
  }
  else if (reasonProperty.size > 1) {
    xmlPayload.jdpRecord.PurpOpt = OTHER;
    xmlPayload.jdpRecord.PurpOth = reasonProperty.filter((v) => v !== OTHER).toJS().join(', ');
  }

  const preventER = encounterDetails.getIn([FQN.LEVEL_OF_CARE_FQN, 0], '');
  xmlPayload.jdpRecord.EROpt = preventER;
  if (!preventER) xmlPayload.errors.push('Invalid "Did JDP intervention prevent ER visit?"');

  return xmlPayload;
};

const insertCharges = (xmlPayload :XMLPayload) => {
  const { crisisReportData } = xmlPayload.reportData;
  const charges = crisisReportData.get(CHARGE_FQN, List());
  const chargeEvents = crisisReportData.get(CHARGE_EVENT_FQN, List());
  if (!charges.size) {
    xmlPayload.jdpRecord.CDCharge = '';
    xmlPayload.jdpRecord.CDOpt = NA;
  }
  else {
    const chargeNames = charges.map((charge) => charge.getIn([NEIGHBOR_DETAILS, FQN.NAME_FQN, 0])).toJS().join(', ');
    const chargesDiverted = chargeEvents
      .reduce((status, event) => {
        if (status === YES) return status;
        const diverted = event.getIn([NEIGHBOR_DETAILS, FQN.DIVERSION_STATUS_FQN, 0], '');
        return diverted;
      }, NA);
    xmlPayload.jdpRecord.CDCharge = chargeNames;
    xmlPayload.jdpRecord.CDOpt = chargesDiverted;
  }

  return xmlPayload;
};

const insertCustodyDiversion = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const custodyDiverted = clinicianReportData
    .getIn([CRISIS_REPORT_CLINICIAN_FQN, 0, NEIGHBOR_DETAILS, FQN.CUSTODY_DIVERTED_FQN, 0], '');
  if (!custodyDiverted) xmlPayload.errors.push('Invalid "Was criminal custody diverted"');
  xmlPayload.jdpRecord.ACCOpt = custodyDiverted;
  xmlPayload.jdpRecord.CAOpt = '';
  xmlPayload.jdpRecord.CAOth = '';

  const disposition = clinicianReportData
    .getIn([DISPOSITION_CLINICIAN_FQN, 0, NEIGHBOR_DETAILS, FQN.CJ_DISPOSITION_FQN], List());

  if (!disposition.size) {
    xmlPayload.errors.push('Invalid "Disposition"');
  }
  else if (disposition.size === 1) {
    xmlPayload.jdpRecord.CAOpt = disposition.first();
  }
  else if (disposition.size > 1) {
    xmlPayload.jdpRecord.CAOpt = OTHER;
    xmlPayload.jdpRecord.CAOth = disposition.filter((v) => v !== OTHER).toJS().join(', ');
  }

  return xmlPayload;
};

const insertInsurance = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const insurances = clinicianReportData
    .get(INSURANCE_FQN, List())
    .map((neighbor) => neighbor.get(NEIGHBOR_DETAILS, Map()));

  const primaryEntity = insurances
    .find((neighbor) => neighbor.getIn([FQN.GENERAL_STATUS_FQN, 0]) === PRIMARY) || Map();

  const primary :string = primaryEntity.getIn([FQN.ORGANIZATION_NAME_FQN, 0], '');
  if (primary) {
    xmlPayload.jdpRecord.PrimSrcOpt = primary;
  }
  else {
    xmlPayload.jdpRecord.PrimSrcOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid "Primary Insurance". Defaulting to "${UNKNOWN}"`);
  }

  const secondaryEntity = insurances
    .find((neighbor) => neighbor.getIn([FQN.GENERAL_STATUS_FQN, 0]) === SECONDARY) || Map();

  const secondary :string = secondaryEntity.getIn([FQN.ORGANIZATION_NAME_FQN, 0], '');
  if (secondary) {
    xmlPayload.jdpRecord.SecSrcOpt = secondary;
  }
  else {
    xmlPayload.jdpRecord.SecSrcOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid "Secondary Insurance". Defaulting to "${UNKNOWN}"`);
  }
  return xmlPayload;
};

const insertBilledServices = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const billedServices = clinicianReportData
    .getIn([INVOICE_FQN, 0, NEIGHBOR_DETAILS, FQN.LINE_ITEM_FQN], List());

  const billed = getYesNoUnknownFromList(billedServices);
  if (billed) {
    xmlPayload.jdpRecord.BillOpt = billed;
  }
  else {
    xmlPayload.jdpRecord.BillOpt = NA;
    xmlPayload.errors.push(`Invalid "Billed services". Defaulting to "${NA}"`);
  }

  const services = billedServices
    .filter((service) => !(service === NONE || service === OTHER)).toJS().join(', ');
  xmlPayload.jdpRecord.WhatSrvOpt = services;

  return xmlPayload;
};

const insertReferralSource = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const referralSource = clinicianReportData.getIn([REFERRAL_SOURCE_FQN, 0, NEIGHBOR_DETAILS, FQN.SOURCE_FQN, 0], '');

  xmlPayload.jdpRecord.RefSrcOpt = referralSource;
  if (!referralSource) xmlPayload.errors.push('Invalid "Referral source"');

  return xmlPayload;
};

const insertStateService = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const stateServices = clinicianReportData.getIn([INCOME_FQN, 0, NEIGHBOR_DETAILS, FQN.TYPE_FQN], List());

  const serviceNames = stateServices
    .filter((service) => service !== OTHER)
    .toJS().join(', ');

  xmlPayload.jdpRecord.KnownOpt = serviceNames || UNKNOWN;
  return xmlPayload;
};

const insertRaceEthnicity = (xmlPayload :XMLPayload) => {
  const { person } = xmlPayload.reportData;
  const ethnicity = person.getIn([FQN.PERSON_ETHNICITY_FQN, 0], '');
  const race = person.getIn([FQN.PERSON_RACE_FQN, 0], UNKNOWN);

  if (ethnicity === HISPANIC) xmlPayload.jdpRecord.HPOpt = YES;
  else if (ethnicity === NON_HISPANIC) xmlPayload.jdpRecord.HPOpt = NO;
  else xmlPayload.jdpRecord.HPOpt = UNKNOWN;

  xmlPayload.jdpRecord.RaceOpt = race || UNKNOWN;

  return xmlPayload;
};

const insertEmployment = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const employmentOptions = clinicianReportData.getIn([OCCUPATION_FQN, 0, NEIGHBOR_DETAILS, FQN.TYPE_FQN], List());

  if (!employmentOptions.size) xmlPayload.errors.push(`Invalid "Occupation". Defaulting to ${UNKNOWN}`);

  xmlPayload.jdpRecord.EmpSrcOpt = employmentOptions
    .filter((option) => option !== OTHER).first(UNKNOWN);

  return xmlPayload;
};

const insertResidence = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const housingEntity = clinicianReportData.getIn([HOUSING_FQN, 0, NEIGHBOR_DETAILS], Map());
  const type :List = housingEntity.get(FQN.TYPE_FQN, List());
  if (type.isEmpty()) xmlPayload.errors.push(`Invalid "Current Housing Situation". Defaulting to ${UNKNOWN}`);
  xmlPayload.jdpRecord.LivOpt = type.first(UNKNOWN);

  const livesWith :List = housingEntity.get(FQN.DESCRIPTION_FQN, List());
  if (livesWith.isEmpty()) xmlPayload.errors.push('Invalid "Resides With"');

  const hasOther = livesWith.includes(OTHER);
  const livesWithOther = livesWith
    .filter((option) => option !== OTHER)
    .toJS().join(', ');

  if (hasOther) {
    xmlPayload.jdpRecord.WithOpt = OTHER;
    xmlPayload.jdpRecord.WithOth = livesWithOther;
  }
  else {
    xmlPayload.jdpRecord.WithOpt = livesWith.first();
    xmlPayload.jdpRecord.WithOth = '';
  }
  return xmlPayload;
};

const insertPriorArrests = (xmlPayload :XMLPayload) => {
  const { crisisReportData } = xmlPayload.reportData;
  console.log(crisisReportData);
  const priorArrests = crisisReportData
    .getIn([OFFENSE_FQN, 0, NEIGHBOR_DETAILS, FQN.NOTES_FQN, 0], '');
  console.log(priorArrests)

  xmlPayload.jdpRecord.PriorOpt = priorArrests;
  if (!priorArrests) xmlPayload.errors.push('Invalid "Prior Arrests"');

  return xmlPayload;
};

const insertPresenceOfPsychiatricIssue = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const psychIssue = clinicianReportData
    .getIn([CRISIS_REPORT_CLINICIAN_FQN, 0, NEIGHBOR_DETAILS, FQN.NATURE_OF_CRISIS_FQN, 0], '');

  if (psychIssue) {
    xmlPayload.jdpRecord.PresOpt = psychIssue;
  }
  else {
    xmlPayload.jdpRecord.PresOpt = UNKNOWN;
    xmlPayload.errors.push(`Invalid "Presenting Psychiatric Issue". Defaulting to ${UNKNOWN}`);
  }

  return xmlPayload;
};

const insertNotes = (xmlPayload :XMLPayload) => {
  const { clinicianReportData } = xmlPayload.reportData;
  const notes = clinicianReportData
    .getIn([INCIDENT_FQN, 0, NEIGHBOR_DETAILS, FQN.DESCRIPTION_FQN, 0]);

  xmlPayload.jdpRecord.Note = notes;
  return xmlPayload;
};

const insertTimestamp = (xmlPayload :XMLPayload) => {
  xmlPayload.jdpRecord.DocSent = DateTime.local().toFormat('d/M/y_H:m:s');
  return xmlPayload;
};

const generateXMLFromReportData = (reportData :ReportData) :string[] => {
  const initialPayload :XMLPayload = { reportData, jdpRecord: {}, errors: [] };
  const { jdpRecord, errors } = pipe(
    insertEntryDate,
    insertJDP,
    insertIncidentDate,
    insertAssessmentCompleted,
    insertLocation,
    insertNatureOfCall,
    insertPointOfIntervention,
    insertAgeRange,
    insertGender,
    insertMilitaryService,
    insertSubstance,
    insertAdditionalSupport,
    insertJailDiversion,
    insertCharges,
    insertCustodyDiversion,
    insertInsurance,
    insertBilledServices,
    insertReferralSource,
    insertStateService,
    insertRaceEthnicity,
    insertEmployment,
    insertResidence,
    insertPriorArrests,
    insertPresenceOfPsychiatricIssue,
    insertNotes,
    insertTimestamp,
  )(initialPayload);
  const { clinicianReportData } = reportData;
  const incidentID = clinicianReportData
    .getIn([INCIDENT_FQN, 0, NEIGHBOR_DETAILS, FQN.CRIMINALJUSTICE_CASE_NUMBER_FQN, 0]);
  const today = DateTime.local().toISODate();

  const xml = new Parser().parse({
    dataroot: {
      JDPRecord: [
        jdpRecord
      ]
    }
  }, {
    format: false,
    suppressEmptyNode: true,
  });

  const xmlWithHeader = XML_HEADER.concat(xml);
  FileSaver.saveFile(xmlWithHeader, `${incidentID}_${today}.xml`, TEXT_XML);

  return errors;
};

export {
  generateXMLFromReportData
};
