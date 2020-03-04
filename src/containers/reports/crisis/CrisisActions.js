// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

const GET_CRISIS_REPORT :'GET_CRISIS_REPORT' = 'GET_CRISIS_REPORT';
const getCrisisReport :RequestSequence = newRequestSequence(GET_CRISIS_REPORT);

const GET_REPORTS_NEIGHBORS :'GET_REPORTS_NEIGHBORS' = 'GET_REPORTS_NEIGHBORS';
const getReportsNeighbors :RequestSequence = newRequestSequence(GET_REPORTS_NEIGHBORS);

const GET_SUBJECT_OF_INCIDENT :'GET_SUBJECT_OF_INCIDENT' = 'GET_SUBJECT_OF_INCIDENT';
const getSubjectOfIncident :RequestSequence = newRequestSequence(GET_SUBJECT_OF_INCIDENT);

export {
  GET_CRISIS_REPORT,
  GET_REPORTS_NEIGHBORS,
  GET_SUBJECT_OF_INCIDENT,
  SUBMIT_CRISIS_REPORT,
  getCrisisReport,
  getReportsNeighbors,
  getSubjectOfIncident,
  submitCrisisReport,
};
