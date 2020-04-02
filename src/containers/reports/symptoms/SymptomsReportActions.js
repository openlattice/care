// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_SYMPTOMS_REPORT :'SUBMIT_SYMPTOMS_REPORT' = 'SUBMIT_SYMPTOMS_REPORT';
const submitSymptomsReport :RequestSequence = newRequestSequence(SUBMIT_SYMPTOMS_REPORT);

const GET_SYMPTOMS_REPORT :'GET_SYMPTOMS_REPORT' = 'GET_SYMPTOMS_REPORT';
const getSymptomsReport :RequestSequence = newRequestSequence(GET_SYMPTOMS_REPORT);

const UPDATE_SYMPTOMS_REPORT :'UPDATE_SYMPTOMS_REPORT' = 'UPDATE_SYMPTOMS_REPORT';
const updateSymptomsReport :RequestSequence = newRequestSequence(UPDATE_SYMPTOMS_REPORT);

const CLEAR_SYMPTOMS_REPORT :'CLEAR_SYMPTOMS_REPORT' = 'CLEAR_SYMPTOMS_REPORT';
const clearSymptomsReport = () => ({
  type: CLEAR_SYMPTOMS_REPORT
});

export {
  CLEAR_SYMPTOMS_REPORT,
  GET_SYMPTOMS_REPORT,
  SUBMIT_SYMPTOMS_REPORT,
  UPDATE_SYMPTOMS_REPORT,
  clearSymptomsReport,
  getSymptomsReport,
  submitSymptomsReport,
  updateSymptomsReport,
};
