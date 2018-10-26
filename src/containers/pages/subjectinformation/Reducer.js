/*
 * @flow
 */

import randomUUID from 'uuid/v4';
import { Map, fromJS } from 'immutable';

import { CLEAR, SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  FULL_NAME,
  PERSON_ID,
  IS_NEW_PERSON,
  LAST,
  FIRST,
  MIDDLE,
  DOB,
  GENDER,
  RACE,
  AGE,
  SSN_LAST_4
} = SUBJECT_INFORMATION;

const INITIAL_STATE :Map<*, *> = fromJS({
  [FULL_NAME]: '',
  [PERSON_ID]: '',
  [IS_NEW_PERSON]: false,
  [LAST]: '',
  [FIRST]: '',
  [MIDDLE]: '',
  [DOB]: '',
  [GENDER]: '',
  [RACE]: '',
  [AGE]: '',
  [SSN_LAST_4]: ''
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case SET_INPUT_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }

    case SET_INPUT_VALUES:
      return state.merge(fromJS(action.value));

    case CLEAR:
    case CLEAR_CRISIS_TEMPLATE:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export function getStatus(state :Map<*, *>) :boolean {
  if (state === INITIAL_STATE) {
    return FORM_STEP_STATUS.INITIAL;
  }
  return FORM_STEP_STATUS.COMPLETED;
}
