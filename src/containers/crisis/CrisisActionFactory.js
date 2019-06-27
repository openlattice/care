/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_CRISIS_REPORT :'CLEAR_CRISIS_REPORT' = 'CLEAR_CRISIS_REPORT';
const clearCrisisReport = () => ({
  type: CLEAR_CRISIS_REPORT
});

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

export {
  CLEAR_CRISIS_REPORT,
  SUBMIT_CRISIS_REPORT,
  clearCrisisReport,
  submitCrisisReport
};
