/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const GET_REPORT_IN_FULL :'GET_REPORT_IN_FULL' = 'GET_REPORT_IN_FULL';
const getReportInFull :RequestSequence = newRequestSequence(GET_REPORT_IN_FULL);

const GET_REPORTS :'GET_REPORTS' = 'GET_REPORTS';
const getReports :RequestSequence = newRequestSequence(GET_REPORTS);

export {
  GET_REPORT_IN_FULL,
  GET_REPORTS,
  getReportInFull,
  getReports,
};
