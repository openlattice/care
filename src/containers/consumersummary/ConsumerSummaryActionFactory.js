import { newRequestSequence } from 'redux-reqseq';

const GET_BHR_REPORT = 'GET_BHR_REPORT';
const getBHRReport = newRequestSequence(GET_BHR_REPORT);

export {
  GET_BHR_REPORT,
  getBHRReport
};
