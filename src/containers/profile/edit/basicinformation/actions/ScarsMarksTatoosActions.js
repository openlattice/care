// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_SCARS_MARKS_TATOOS :'GET_SCARS_MARKS_TATOOS' = 'GET_SCARS_MARKS_TATOOS';
const getScarsMarksTatoos = newRequestSequence(GET_SCARS_MARKS_TATOOS);

const SUBMIT_SCARS_MARKS_TATOOS :'SUBMIT_SCARS_MARKS_TATOOS' = 'SUBMIT_SCARS_MARKS_TATOOS';
const submitScarsMarksTatoos = newRequestSequence(SUBMIT_SCARS_MARKS_TATOOS);

const UPDATE_SCARS_MARKS_TATOOS :'UPDATE_SCARS_MARKS_TATOOS' = 'UPDATE_SCARS_MARKS_TATOOS';
const updateScarsMarksTatoos = newRequestSequence(UPDATE_SCARS_MARKS_TATOOS);

export {
  GET_SCARS_MARKS_TATOOS,
  SUBMIT_SCARS_MARKS_TATOOS,
  UPDATE_SCARS_MARKS_TATOOS,
  getScarsMarksTatoos,
  submitScarsMarksTatoos,
  updateScarsMarksTatoos,
};
