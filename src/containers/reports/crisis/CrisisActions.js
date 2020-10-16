// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

const SUBMIT_CRISIS_REPORT_V2 :'SUBMIT_CRISIS_REPORT_V2' = 'SUBMIT_CRISIS_REPORT_V2';
const submitCrisisReportV2 :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT_V2);

const GET_CRISIS_REPORT :'GET_CRISIS_REPORT' = 'GET_CRISIS_REPORT';
const getCrisisReport :RequestSequence = newRequestSequence(GET_CRISIS_REPORT);

const GET_CRISIS_REPORT_V2 :'GET_CRISIS_REPORT_V2' = 'GET_CRISIS_REPORT_V2';
const getCrisisReportV2 :RequestSequence = newRequestSequence(GET_CRISIS_REPORT_V2);

const DELETE_CRISIS_REPORT_CONTENT :'DELETE_CRISIS_REPORT_CONTENT' = 'DELETE_CRISIS_REPORT_CONTENT';
const deleteCrisisReportContent :RequestSequence = newRequestSequence(DELETE_CRISIS_REPORT_CONTENT);

const ADD_OPTIONAL_CRISIS_REPORT_CONTENT :'ADD_OPTIONAL_CRISIS_REPORT_CONTENT' = 'ADD_OPTIONAL_CRISIS_REPORT_CONTENT';
const addOptionalCrisisReportContent :RequestSequence = newRequestSequence(ADD_OPTIONAL_CRISIS_REPORT_CONTENT);

const UPDATE_CRISIS_REPORT :'UPDATE_CRISIS_REPORT' = 'UPDATE_CRISIS_REPORT';
const updateCrisisReport :RequestSequence = newRequestSequence(UPDATE_CRISIS_REPORT);

const UPDATE_PERSON_REPORT_COUNT :'UPDATE_PERSON_REPORT_COUNT' = 'UPDATE_PERSON_REPORT_COUNT';
const updatePersonReportCount :RequestSequence = newRequestSequence(UPDATE_PERSON_REPORT_COUNT);

const GET_REPORTS_NEIGHBORS :'GET_REPORTS_NEIGHBORS' = 'GET_REPORTS_NEIGHBORS';
const getReportsNeighbors :RequestSequence = newRequestSequence(GET_REPORTS_NEIGHBORS);

const GET_REPORTS_V2_NEIGHBORS :'GET_REPORTS_V2_NEIGHBORS' = 'GET_REPORTS_V2_NEIGHBORS';
const getReportsV2Neighbors :RequestSequence = newRequestSequence(GET_REPORTS_V2_NEIGHBORS);

const GET_SUBJECT_OF_INCIDENT :'GET_SUBJECT_OF_INCIDENT' = 'GET_SUBJECT_OF_INCIDENT';
const getSubjectOfIncident :RequestSequence = newRequestSequence(GET_SUBJECT_OF_INCIDENT);

const GET_LOCATION_OF_INCIDENT :'GET_LOCATION_OF_INCIDENT' = 'GET_LOCATION_OF_INCIDENT';
const getLocationOfIncident :RequestSequence = newRequestSequence(GET_LOCATION_OF_INCIDENT);

const GET_CHARGE_EVENTS :'GET_CHARGE_EVENTS' = 'GET_CHARGE_EVENTS';
const getChargeEvents :RequestSequence = newRequestSequence(GET_CHARGE_EVENTS);

const CREATE_MISSING_CALL_FOR_SERVICE :'CREATE_MISSING_CALL_FOR_SERVICE' = 'CREATE_MISSING_CALL_FOR_SERVICE';
const createMissingCallForService :RequestSequence = newRequestSequence(CREATE_MISSING_CALL_FOR_SERVICE);

const CLEAR_CRISIS_REPORT :'CLEAR_CRISIS_REPORT' = 'CLEAR_CRISIS_REPORT';
const clearCrisisReport = () => ({
  type: CLEAR_CRISIS_REPORT
});

export {
  ADD_OPTIONAL_CRISIS_REPORT_CONTENT,
  CLEAR_CRISIS_REPORT,
  CREATE_MISSING_CALL_FOR_SERVICE,
  DELETE_CRISIS_REPORT_CONTENT,
  GET_CHARGE_EVENTS,
  GET_CRISIS_REPORT,
  GET_CRISIS_REPORT_V2,
  GET_LOCATION_OF_INCIDENT,
  GET_REPORTS_NEIGHBORS,
  GET_REPORTS_V2_NEIGHBORS,
  GET_SUBJECT_OF_INCIDENT,
  SUBMIT_CRISIS_REPORT,
  SUBMIT_CRISIS_REPORT_V2,
  UPDATE_CRISIS_REPORT,
  UPDATE_PERSON_REPORT_COUNT,
  addOptionalCrisisReportContent,
  clearCrisisReport,
  createMissingCallForService,
  deleteCrisisReportContent,
  getChargeEvents,
  getCrisisReport,
  getCrisisReportV2,
  getLocationOfIncident,
  getReportsNeighbors,
  getReportsV2Neighbors,
  getSubjectOfIncident,
  submitCrisisReport,
  submitCrisisReportV2,
  updateCrisisReport,
  updatePersonReportCount,
};
