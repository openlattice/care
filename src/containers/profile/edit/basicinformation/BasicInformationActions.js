// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_BASIC_INFO_CONTAINER :'GET_BASIC_INFO_CONTAINER' = 'GET_BASIC_INFO_CONTAINER';
const getBasicInfoContainer = newRequestSequence(GET_BASIC_INFO_CONTAINER);

const GET_BASIC_INFORMATION :'GET_BASIC_INFORMATION' = 'GET_BASIC_INFORMATION';
const getBasicInformation = newRequestSequence(GET_BASIC_INFORMATION);

const GET_APPEARANCE :'GET_APPEARANCE' = 'GET_APPEARANCE';
const getAppearance = newRequestSequence(GET_APPEARANCE);

const SUBMIT_APPEARANCE :'SUBMIT_APPEARANCE' = 'SUBMIT_APPEARANCE';
const submitAppearance = newRequestSequence(SUBMIT_APPEARANCE);

const UPDATE_APPEARANCE :'UPDATE_APPEARANCE' = 'UPDATE_APPEARANCE';
const updateAppearance = newRequestSequence(UPDATE_APPEARANCE);

const UPDATE_BASIC_INFORMATION :'UPDATE_BASIC_INFORMATION' = 'UPDATE_BASIC_INFORMATION';
const updateBasicInformation = newRequestSequence(UPDATE_BASIC_INFORMATION);

export {
  GET_APPEARANCE,
  GET_BASIC_INFORMATION,
  GET_BASIC_INFO_CONTAINER,
  SUBMIT_APPEARANCE,
  UPDATE_APPEARANCE,
  UPDATE_BASIC_INFORMATION,
  getAppearance,
  getBasicInfoContainer,
  getBasicInformation,
  submitAppearance,
  updateAppearance,
  updateBasicInformation
};
