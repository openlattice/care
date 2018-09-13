import { newRequestSequence } from 'redux-reqseq';

const GET_BHR_REPORTS = 'GET_BHR_REPORTS';
const getBHRReports = newRequestSequence(GET_BHR_REPORTS);

export {
  GET_BHR_REPORTS,
  getBHRReports
};
