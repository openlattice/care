/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { OBSERVED_BEHAVIORS } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  VETERAN,
  CHRONIC,
  BEHAVIORS,
  OTHER_BEHAVIOR,
  DEMEANORS
} = OBSERVED_BEHAVIORS;

const INITIAL_STATE :Map<*, *> = fromJS({
  [VETERAN]: false,
  [CHRONIC]: false,
  [BEHAVIORS]: [],
  [OTHER_BEHAVIOR]: '',
  [DEMEANORS]: []
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

export function getStatus(state :Map<*, *>) :boolean {
  if (state === INITIAL_STATE) {
    return FORM_STEP_STATUS.INITIAL;
  }
  return FORM_STEP_STATUS.COMPLETED;
}

export function processForSubmit(state :Map<*, *>) :Object {
  return state.toJS();
}
