/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const CLEAR_CRISIS_TEMPLATE :'CLEAR_CRISIS_TEMPLATE' = 'CLEAR_CRISIS_TEMPLATE';
const clearCrisisTemplate :RequestSequence = newRequestSequence(CLEAR_CRISIS_TEMPLATE);

const SUBMIT_CRISIS_REPORT :'SUBMIT_CRISIS_REPORT' = 'SUBMIT_CRISIS_REPORT';
const submitCrisisReport :RequestSequence = newRequestSequence(SUBMIT_CRISIS_REPORT);

export {
  CLEAR_CRISIS_TEMPLATE,
  SUBMIT_CRISIS_REPORT,
  clearCrisisTemplate,
  submitCrisisReport
};
