/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { DISPOSITION } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  SPECIALISTS,
  DISPOSITIONS,
  HAS_REPORT_NUMBER,
  REPORT_NUMBER,
  INCIDENT_DESCRIPTION,

  // for disposition field
  PEOPLE_NOTIFIED,
  OTHER_PEOPLE_NOTIFIED,
  VERBAL_REFERRALS,
  OTHER_VERBAL_REFERRAL,
  COURTESY_TRANSPORTS,
  HOSPITALS,
  WAS_VOLUNTARY_TRANSPORT,
  ARRESTABLE_OFFENSES,
  NO_ACTION_VALUES
} = DISPOSITION;

const INITIAL_STATE :Map<*, *> = fromJS({
  [SPECIALISTS]: [],
  [DISPOSITIONS]: [],
  [HAS_REPORT_NUMBER]: undefined,
  [REPORT_NUMBER]: '',
  [INCIDENT_DESCRIPTION]: '',

  // for disposition field
  [PEOPLE_NOTIFIED]: [],
  [OTHER_PEOPLE_NOTIFIED]: '',
  [VERBAL_REFERRALS]: [],
  [OTHER_VERBAL_REFERRAL]: '',
  [COURTESY_TRANSPORTS]: [],
  [HOSPITALS]: [],
  [WAS_VOLUNTARY_TRANSPORT]: undefined,
  [ARRESTABLE_OFFENSES]: [],
  [NO_ACTION_VALUES]: []
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
