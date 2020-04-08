// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_SYMPTOMS_REPORT :'SUBMIT_SYMPTOMS_REPORT' = 'SUBMIT_SYMPTOMS_REPORT';
const submitSymptomsReport :RequestSequence = newRequestSequence(SUBMIT_SYMPTOMS_REPORT);

const GET_SYMPTOMS_REPORT :'GET_SYMPTOMS_REPORT' = 'GET_SYMPTOMS_REPORT';
const getSymptomsReport :RequestSequence = newRequestSequence(GET_SYMPTOMS_REPORT);

const UPDATE_SYMPTOMS_REPORT :'UPDATE_SYMPTOMS_REPORT' = 'UPDATE_SYMPTOMS_REPORT';
const updateSymptomsReport :RequestSequence = newRequestSequence(UPDATE_SYMPTOMS_REPORT);

const GET_ALL_SYMPTOMS_REPORTS :'GET_ALL_SYMPTOMS_REPORTS' = 'GET_ALL_SYMPTOMS_REPORTS';
const getAllSymptomsReports :RequestSequence = newRequestSequence(GET_ALL_SYMPTOMS_REPORTS);

const CLEAR_SYMPTOMS_REPORT :'CLEAR_SYMPTOMS_REPORT' = 'CLEAR_SYMPTOMS_REPORT';
const clearSymptomsReport = () => ({
  type: CLEAR_SYMPTOMS_REPORT
});

export {
  CLEAR_SYMPTOMS_REPORT,
  GET_ALL_SYMPTOMS_REPORTS,
  GET_SYMPTOMS_REPORT,
  SUBMIT_SYMPTOMS_REPORT,
  UPDATE_SYMPTOMS_REPORT,
  clearSymptomsReport,
  getAllSymptomsReports,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
};
