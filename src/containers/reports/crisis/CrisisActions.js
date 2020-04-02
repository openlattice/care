// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

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

const GET_REPORTS_NEIGHBORS :'GET_REPORTS_NEIGHBORS' = 'GET_REPORTS_NEIGHBORS';
const getReportsNeighbors :RequestSequence = newRequestSequence(GET_REPORTS_NEIGHBORS);

const GET_REPORTS_V2_NEIGHBORS :'GET_REPORTS_V2_NEIGHBORS' = 'GET_REPORTS_V2_NEIGHBORS';
const getReportsV2Neighbors :RequestSequence = newRequestSequence(GET_REPORTS_V2_NEIGHBORS);

const GET_SUBJECT_OF_INCIDENT :'GET_SUBJECT_OF_INCIDENT' = 'GET_SUBJECT_OF_INCIDENT';
const getSubjectOfIncident :RequestSequence = newRequestSequence(GET_SUBJECT_OF_INCIDENT);

const CLEAR_CRISIS_REPORT :'CLEAR_CRISIS_REPORT' = 'CLEAR_CRISIS_REPORT';
const clearCrisisReport = () => ({
  type: CLEAR_CRISIS_REPORT
});

export {
  ADD_OPTIONAL_CRISIS_REPORT_CONTENT,
  CLEAR_CRISIS_REPORT,
  DELETE_CRISIS_REPORT_CONTENT,
  GET_CRISIS_REPORT,
  GET_CRISIS_REPORT_V2,
  GET_REPORTS_NEIGHBORS,
  GET_REPORTS_V2_NEIGHBORS,
  GET_SUBJECT_OF_INCIDENT,
  SUBMIT_CRISIS_REPORT,
  UPDATE_CRISIS_REPORT,
  addOptionalCrisisReportContent,
  clearCrisisReport,
  deleteCrisisReportContent,
  getCrisisReport,
  getCrisisReportV2,
  getReportsNeighbors,
  getReportsV2Neighbors,
  getSubjectOfIncident,
  submitCrisisReport,
  updateCrisisReport,
};
