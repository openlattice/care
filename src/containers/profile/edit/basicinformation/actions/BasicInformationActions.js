// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_APPEARANCE :'GET_APPEARANCE' = 'GET_APPEARANCE';
const getAppearance = newRequestSequence(GET_APPEARANCE);

const GET_BASICS :'GET_BASICS' = 'GET_BASICS';
const getBasics = newRequestSequence(GET_BASICS);

const GET_BASIC_INFORMATION :'GET_BASIC_INFORMATION' = 'GET_BASIC_INFORMATION';
const getBasicInformation = newRequestSequence(GET_BASIC_INFORMATION);

const SUBMIT_APPEARANCE :'SUBMIT_APPEARANCE' = 'SUBMIT_APPEARANCE';
const submitAppearance = newRequestSequence(SUBMIT_APPEARANCE);

const UPDATE_APPEARANCE :'UPDATE_APPEARANCE' = 'UPDATE_APPEARANCE';
const updateAppearance = newRequestSequence(UPDATE_APPEARANCE);

const UPDATE_BASICS :'UPDATE_BASICS' = 'UPDATE_BASICS';
const updateBasics = newRequestSequence(UPDATE_BASICS);

export {
  GET_APPEARANCE,
  GET_BASICS,
  GET_BASIC_INFORMATION,
  SUBMIT_APPEARANCE,
  UPDATE_APPEARANCE,
  UPDATE_BASICS,
  getAppearance,
  getBasicInformation,
  getBasics,
  submitAppearance,
  updateAppearance,
  updateBasics
};
