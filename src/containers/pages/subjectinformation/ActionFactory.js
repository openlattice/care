/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const CLEAR :string = 'CLEAR_SUBJECT_INFORMATION';
const clear :RequestSequence = newRequestSequence(CLEAR);

const SET_INPUT_VALUE :string = 'SET_INPUT_VALUE_SUBJECT_INFORMATION';
const setInputValue :RequestSequence = newRequestSequence(SET_INPUT_VALUE);

const SET_INPUT_VALUES :string = 'SET_INPUT_VALUES_SUBJECT_INFORMATION';
const setInputValues :RequestSequence = newRequestSequence(SET_INPUT_VALUES);

export {
  CLEAR,
  SET_INPUT_VALUE,
  SET_INPUT_VALUES,
  clear,
  setInputValue,
  setInputValues
};
