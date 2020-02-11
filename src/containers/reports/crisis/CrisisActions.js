// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

export {
  SUBMIT_CRISIS_REPORT,
  submitCrisisReport,
};
