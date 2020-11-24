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
import { UNKNOWN } from '../crisis/schemas/constants';

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
  CRISIS_REPORT_FQN,
  PART_OF_FQN,
  REPORTED_FQN,
  BEHAVIOR_FQN,
  CALL_FOR_SERVICE_FQN,
  CHARGE_FQN,
  DIAGNOSIS_FQN,
  DISPOSITION_FQN,
  EMPLOYEE_FQN,
  ENCOUNTER_DETAILS_FQN,
  ENCOUNTER_FQN,
  GENERAL_PERSON_FQN,
  HOUSING_FQN,
  INCIDENT_FQN,
  INCOME_FQN,
  INJURY_FQN,
  INSURANCE_FQN,
  INTERACTION_STRATEGY_FQN,
  INVOICE_FQN,
  LOCATION_FQN,
  MEDICATION_STATEMENT_FQN,
  OCCUPATION_FQN,
  OFFENSE_FQN,
  REFERRAL_REQUEST_FQN,
  SELF_HARM_FQN,
  STAFF_FQN,
  SUBSTANCE_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
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
    .getIn([ENCOUNTER_FQN, 0, NEIGHBOR_DETAILS, FQN.SERVICE_TYPE_FQN], List());

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
    xmlPayload.errors.push(`Missing sex. Defaulting to ${UNKNOWN}`);
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
    xmlPayload.errors.push(`Missing history of military service. Defaulting to ${UNKNOWN}`);
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
    insertNotes,
  )(initialPayload);

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
  FileSaver.saveFile(xmlWithHeader, 'testWithHeader.xml', TEXT_XML);

  return errors;
};

export {
  generateXMLFromReportData
};
