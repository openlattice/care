import { newRequestSequence } from 'redux-reqseq';

const GET_BHR_REPORTS = 'GET_BHR_REPORTS';
const getBHRReports = newRequestSequence(GET_BHR_REPORTS);

const GET_BHR_REPORT_DATA = 'GET_BHR_REPORT_DATA';
const getBHRReportData = newRequestSequence(GET_BHR_REPORT_DATA);

export {
  GET_BHR_REPORTS,
  getBHRReports,
  GET_BHR_REPORT_DATA,
  getBHRReportData
};
