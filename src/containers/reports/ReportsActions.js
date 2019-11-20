/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DELETE_REPORT :'DELETE_REPORT' = 'DELETE_REPORT';
const deleteReport :RequestSequence = newRequestSequence(DELETE_REPORT);

const UPDATE_REPORT :'UPDATE_REPORT' = 'UPDATE_REPORT';
const updateReport :RequestSequence = newRequestSequence(UPDATE_REPORT);

const GET_REPORT :'GET_REPORT' = 'GET_REPORT';
const getReport :RequestSequence = newRequestSequence(GET_REPORT);

const SUBMIT_REPORT :'SUBMIT_REPORT' = 'SUBMIT_REPORT';
const submitReport :RequestSequence = newRequestSequence(SUBMIT_REPORT);

const GET_REPORTS_BY_DATE_RANGE :'GET_REPORTS_BY_DATE_RANGE' = 'GET_REPORTS_BY_DATE_RANGE';
const getReportsByDateRange :RequestSequence = newRequestSequence(GET_REPORTS_BY_DATE_RANGE);

const CLEAR_REPORT :'CLEAR_REPORT' = 'CLEAR_REPORT';
const clearReport = () => ({
  type: CLEAR_REPORT
});

export {
  CLEAR_REPORT,
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS_BY_DATE_RANGE,
  SUBMIT_REPORT,
  UPDATE_REPORT,
  clearReport,
  deleteReport,
  getReport,
  getReportsByDateRange,
  submitReport,
  updateReport,
};
