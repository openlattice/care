// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_EMERGENCY_CONTACTS :'SUBMIT_EMERGENCY_CONTACTS' = 'SUBMIT_EMERGENCY_CONTACTS';
const submitEmergencyContacts = newRequestSequence(SUBMIT_EMERGENCY_CONTACTS);

const GET_EMERGENCY_CONTACTS :'GET_EMERGENCY_CONTACTS' = 'GET_EMERGENCY_CONTACTS';
const getEmergencyContacts = newRequestSequence(GET_EMERGENCY_CONTACTS);

const UPDATE_EMERGENCY_CONTACT :'UPDATE_EMERGENCY_CONTACT' = 'UPDATE_EMERGENCY_CONTACT';
const updateEmergencyContact = newRequestSequence(UPDATE_EMERGENCY_CONTACT);

const DELETE_EMERGENCY_CONTACT :'DELETE_EMERGENCY_CONTACT' = 'DELETE_EMERGENCY_CONTACT';
const deleteEmergencyContact = newRequestSequence(DELETE_EMERGENCY_CONTACT);

export {
  DELETE_EMERGENCY_CONTACT,
  GET_EMERGENCY_CONTACTS,
  SUBMIT_EMERGENCY_CONTACTS,
  UPDATE_EMERGENCY_CONTACT,
  deleteEmergencyContact,
  getEmergencyContacts,
  submitEmergencyContacts,
  updateEmergencyContact,
};
