// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_RESPONSE_PLAN :'SUBMIT_RESPONSE_PLAN' = 'SUBMIT_RESPONSE_PLAN';
const submitResponsePlan = newRequestSequence(SUBMIT_RESPONSE_PLAN);

const GET_RESPONSE_PLAN :'GET_RESPONSE_PLAN' = 'GET_RESPONSE_PLAN';
const getResponsePlan = newRequestSequence(GET_RESPONSE_PLAN);

export {
  GET_RESPONSE_PLAN,
  SUBMIT_RESPONSE_PLAN,
  getResponsePlan,
  submitResponsePlan,
};
