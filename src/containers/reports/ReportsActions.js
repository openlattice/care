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

export {
  DELETE_REPORT,
  GET_REPORT,
  GET_REPORTS,
  UPDATE_REPORT,
  deleteReport,
  getReport,
  getReports,
  updateReport,
};
