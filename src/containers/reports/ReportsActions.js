/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const DELETE_REPORT :'DELETE_REPORT' = 'DELETE_REPORT';
const deleteReport :RequestSequence = newRequestSequence(DELETE_REPORT);

const GET_REPORT_IN_FULL :'GET_REPORT_IN_FULL' = 'GET_REPORT_IN_FULL';
const getReportInFull :RequestSequence = newRequestSequence(GET_REPORT_IN_FULL);

const GET_REPORTS :'GET_REPORTS' = 'GET_REPORTS';
const getReports :RequestSequence = newRequestSequence(GET_REPORTS);

const SUBMIT_REPORT_EDITS :'SUBMIT_REPORT_EDITS' = 'SUBMIT_REPORT_EDITS';
const submitReportEdits :RequestSequence = newRequestSequence(SUBMIT_REPORT_EDITS);

export {
  DELETE_REPORT,
  GET_REPORT_IN_FULL,
  GET_REPORTS,
  SUBMIT_REPORT_EDITS,
  deleteReport,
  getReportInFull,
  getReports,
  submitReportEdits,
};
