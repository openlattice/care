/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const SET_INPUT_VALUE :string = 'SET_INPUT_VALUE_OFFICER_SAFETY';
const setInputValue :RequestSequence = newRequestSequence(SET_INPUT_VALUE);

export {
  SET_INPUT_VALUE,
  setInputValue
};
