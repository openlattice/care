/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { CRISIS_NATURE, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  NATURE_OF_CRISIS,
  ASSISTANCE,
  OTHER_ASSISTANCE,
  HOUSING
} = CRISIS_NATURE;

const INITIAL_STATE :Map<*, *> = fromJS({
  [NATURE_OF_CRISIS]: [],
  [ASSISTANCE]: [],
  [OTHER_ASSISTANCE]: '',
  [HOUSING]: []
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case SET_INPUT_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }

    case CLEAR_CRISIS_TEMPLATE:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export function getInvalidFields(state :Map<*, *>) {
  const invalidFields = [];

  if (!state.get(NATURE_OF_CRISIS, List()).size) {
    invalidFields.push(NATURE_OF_CRISIS);
  }

  if (!state.get(ASSISTANCE, List()).size) {
    invalidFields.push(ASSISTANCE);
  }
  else if (state.get(ASSISTANCE, List()).includes(OTHER) && !state.get(OTHER_ASSISTANCE).length) {
    invalidFields.push(ASSISTANCE);
  }

  if (!state.get(HOUSING, List()).size) {
    invalidFields.push(HOUSING);
  }

  return invalidFields;
}

export function getStatus(state :Map<*, *>) :boolean {
  if (state === INITIAL_STATE) {
    return FORM_STEP_STATUS.INITIAL;
  }
  return getInvalidFields(state).length ? FORM_STEP_STATUS.IN_PROGRESS : FORM_STEP_STATUS.COMPLETED;
}

export function processForSubmit(state :Map<*, *>) :Object {
  return state.toJS();
}
