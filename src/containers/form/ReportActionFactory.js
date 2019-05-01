/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_REPORT :'SUBMIT_REPORT' = 'SUBMIT_REPORT';
const submitReport :RequestSequence = newRequestSequence(SUBMIT_REPORT);

export {
  SUBMIT_REPORT,
  submitReport
};
