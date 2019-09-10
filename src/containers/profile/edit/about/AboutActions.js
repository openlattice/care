// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_RESPONSIBLE_USER :'SUBMIT_RESPONSIBLE_USER' = 'SUBMIT_RESPONSIBLE_USER';
const submitResponsibleUser = newRequestSequence(SUBMIT_RESPONSIBLE_USER);

const GET_RESPONSIBLE_USER :'GET_RESPONSIBLE_USER' = 'GET_RESPONSIBLE_USER';
const getResponsibleUser = newRequestSequence(GET_RESPONSIBLE_USER);

const UPDATE_RESPONSIBLE_USER :'UPDATE_RESPONSIBLE_USER' = 'UPDATE_RESPONSIBLE_USER';
const updateResponsibleUser = newRequestSequence(UPDATE_RESPONSIBLE_USER);

const GET_RESPONSIBLE_USER_OPTIONS :'GET_RESPONSIBLE_USER_OPTIONS' = 'GET_RESPONSIBLE_USER_OPTIONS';
const getResponsibleUserOptions = newRequestSequence(GET_RESPONSIBLE_USER_OPTIONS);

export {
  GET_RESPONSIBLE_USER,
  GET_RESPONSIBLE_USER_OPTIONS,
  SUBMIT_RESPONSIBLE_USER,
  UPDATE_RESPONSIBLE_USER,
  getResponsibleUser,
  getResponsibleUserOptions,
  submitResponsibleUser,
  updateResponsibleUser,
};
