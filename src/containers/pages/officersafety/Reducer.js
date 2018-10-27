/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { OFFICER_SAFETY, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  TECHNIQUES,
  HAD_WEAPON,
  WEAPONS,
  OTHER_WEAPON,
  THREATENED_VIOLENCE,
  THREATENED_PERSON_NAME,
  THREATENED_PERSON_RELATIONSHIP,
  HAD_INJURIES,
  INJURY_DESCRIPTION,
  INJURY_TYPE,
  OTHER_INJURY_TYPE
} = OFFICER_SAFETY;

const INITIAL_STATE :Map<*, *> = fromJS({
  [TECHNIQUES]: [],
  [HAD_WEAPON]: false,
  [WEAPONS]: [],
  [OTHER_WEAPON]: '',
  [THREATENED_VIOLENCE]: false,
  [THREATENED_PERSON_NAME]: '',
  [THREATENED_PERSON_RELATIONSHIP]: '',
  [HAD_INJURIES]: false,
  [INJURY_DESCRIPTION]: '',
  [INJURY_TYPE]: '',
  [OTHER_INJURY_TYPE]: ''
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

  let finished = true;

  if (state.get(HAD_WEAPON)) {
    const weaponList = state.get(WEAPONS, List());
    if (!weaponList.size) {
      finished = false;
    }
    if (weaponList.includes(OTHER) && !state.get(OTHER_WEAPON).length) {
      finished = false;
    }
  }

  if (state.get(THREATENED_VIOLENCE)) {
    if (!state.get(THREATENED_PERSON_NAME, '').length) {
      finished = false;
    }
  }

  if (state.get(HAD_INJURIES)) {
    if (!state.get(INJURY_DESCRIPTION).length) {
      finished = false;
    }

    if (state.get(INJURY_TYPE) === OTHER && !state.get(OTHER_INJURY_TYPE).length) {
      finished = false;
    }
  }

  return finished ? FORM_STEP_STATUS.COMPLETED : FORM_STEP_STATUS.IN_PROGRESS;
}
