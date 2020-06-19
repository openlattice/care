// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_CONTACT :'GET_CONTACT' = 'GET_CONTACT';
const getContact = newRequestSequence(GET_CONTACT);

const SUBMIT_CONTACT :'SUBMIT_CONTACT' = 'SUBMIT_CONTACT';
const submitContact = newRequestSequence(SUBMIT_CONTACT);

const UPDATE_CONTACT :'UPDATE_CONTACT' = 'UPDATE_CONTACT';
const updateContact = newRequestSequence(UPDATE_CONTACT);

export {
  GET_CONTACT,
  SUBMIT_CONTACT,
  UPDATE_CONTACT,
  getContact,
  submitContact,
  updateContact,
};
