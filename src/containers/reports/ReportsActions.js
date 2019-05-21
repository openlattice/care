/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const DELETE_REPORT :'DELETE_REPORT' = 'DELETE_REPORT';
const deleteReport :RequestSequence = newRequestSequence(DELETE_REPORT);

const GET_REPORTS :'GET_REPORTS' = 'GET_REPORTS';
const getReports :RequestSequence = newRequestSequence(GET_REPORTS);

const UPDATE_REPORT :'UPDATE_REPORT' = 'UPDATE_REPORT';
const updateReport :RequestSequence = newRequestSequence(UPDATE_REPORT);

const GET_REPORT :'GET_REPORT' = 'GET_REPORT';
const getReport :RequestSequence = newRequestSequence(GET_REPORT);

const GET_REPORTS_BY_DATE_RANGE :'GET_REPORTS_BY_DATE_RANGE' = 'GET_REPORTS_BY_DATE_RANGE';
const getReportsByDateRange :RequestSequence = newRequestSequence(GET_REPORTS_BY_DATE_RANGE);

export {
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS,
  GET_REPORTS_BY_DATE_RANGE,
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReports,
  getReportsByDateRange,
  updateReport,
};
