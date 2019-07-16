// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_RESPONSE_PLAN :'SUBMIT_RESPONSE_PLAN' = 'SUBMIT_RESPONSE_PLAN';
const submitResponsePlan = newRequestSequence(SUBMIT_RESPONSE_PLAN);

export {
  SUBMIT_RESPONSE_PLAN,
  submitResponsePlan,
};
