// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_BASIC_INFORMATION :'GET_BASIC_INFORMATION' = 'GET_BASIC_INFORMATION';
const getBasicInformation = newRequestSequence(GET_BASIC_INFORMATION);

const UPDATE_BASIC_INFORMATION :'UPDATE_BASIC_INFORMATION' = 'UPDATE_BASIC_INFORMATION';
const updateBasicInformation = newRequestSequence(UPDATE_BASIC_INFORMATION);

const SUBMIT_BASIC_INFORMATION :'SUBMIT_BASIC_INFORMATION' = 'SUBMIT_BASIC_INFORMATION';
const submitBasicInformation = newRequestSequence(SUBMIT_BASIC_INFORMATION);

export {
  GET_BASIC_INFORMATION,
  SUBMIT_BASIC_INFORMATION,
  UPDATE_BASIC_INFORMATION,
  getBasicInformation,
  submitBasicInformation,
  updateBasicInformation,
};
