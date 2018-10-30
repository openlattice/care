/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { DISPOSITION, OTHER } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';
import { DISPOSITIONS as DISPOSITION_TYPES } from './Constants';

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

  let finished = true;

  // DISPOSITION CHECKBOX LIST

  const dispositions = state.get(DISPOSITIONS);

  if (dispositions.includes(DISPOSITION_TYPES.NOTIFIED_SOMEONE)) {
    const peopleNotified = state.get(PEOPLE_NOTIFIED, List());
    if (!peopleNotified.size) {
      finished = false;
    }

    if (peopleNotified.includes(OTHER) && !state.get(OTHER_PEOPLE_NOTIFIED, '').length) {
      finished = false;
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.VERBAL_REFERRAL)) {
    const verbalReferrals = state.get(VERBAL_REFERRALS, List());
    if (!verbalReferrals.size) {
      finished = false;
    }

    if (verbalReferrals.includes(OTHER) && !state.get(OTHER_VERBAL_REFERRAL, '').length) {
      finished = false;
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.COURTESY_TRANPORT)) {
    if (!state.get(COURTESY_TRANSPORTS, List()).size) {
      finished = false;
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.HOSPITAL)) {
    if (state.get(WAS_VOLUNTARY_TRANSPORT) === undefined) {
      finished = false;
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.ARRESTABLE_OFFENSE)) {
    if (!state.get(ARRESTABLE_OFFENSES, List()).size) {
      finished = false;
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.NO_ACTION_POSSIBLE)) {
    if (!state.get(NO_ACTION_VALUES, List()).size) {
      finished = false;
    }
  }

  // REPORT NUMBER / DESCRIPTION

  if (state.get(HAS_REPORT_NUMBER) === undefined) {
    finished = false;
  }
  else if (state.get(HAS_REPORT_NUMBER) && !state.get(REPORT_NUMBER, '').length) {
    finished = false;
  }
  else if (!state.get(HAS_REPORT_NUMBER) && !state.get(INCIDENT_DESCRIPTION, '').length) {
    finished = false;
  }

  return finished ? FORM_STEP_STATUS.COMPLETED : FORM_STEP_STATUS.IN_PROGRESS;
}

export function processForSubmit(state :Map<*, *>) :Object {
  return state.toJS();
}
