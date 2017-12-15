/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_FOLLOW_UP_REPORT :'SUBMIT_FOLLOW_UP_REPORT' = 'SUBMIT_FOLLOW_UP_REPORT';
const submitFollowUpReport :RequestSequence = newRequestSequence(SUBMIT_FOLLOW_UP_REPORT);

export {
  SUBMIT_FOLLOW_UP_REPORT,
  submitFollowUpReport
};
