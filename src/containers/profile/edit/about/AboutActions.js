// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_RESPONSIBLE_USER :'SUBMIT_RESPONSIBLE_USER' = 'SUBMIT_RESPONSIBLE_USER';
const submitResponsibleUser = newRequestSequence(SUBMIT_RESPONSIBLE_USER);

const GET_RESPONSIBLE_USER :'GET_RESPONSIBLE_USER' = 'GET_RESPONSIBLE_USER';
const getResponsibleUser = newRequestSequence(GET_RESPONSIBLE_USER);

const UPDATE_RESPONSIBLE_USER :'UPDATE_RESPONSIBLE_USER' = 'UPDATE_RESPONSIBLE_USER';
const updateResponsibleUser = newRequestSequence(UPDATE_RESPONSIBLE_USER);

export {
  GET_RESPONSIBLE_USER,
  SUBMIT_RESPONSIBLE_USER,
  UPDATE_RESPONSIBLE_USER,
  getResponsibleUser,
  submitResponsibleUser,
  updateResponsibleUser,
};
