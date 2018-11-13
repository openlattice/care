/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';

const SET_INPUT_VALUE :string = 'SET_INPUT_VALUE_OBSERVED_BEHAVIORS';
const setInputValue :RequestSequence = newRequestSequence(SET_INPUT_VALUE);

export {
  SET_INPUT_VALUE,
  setInputValue
};
