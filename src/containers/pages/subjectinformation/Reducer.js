/*
 * @flow
 */

import moment from 'moment';
import randomUUID from 'uuid/v4';
import { Map, fromJS } from 'immutable';

import { CLEAR, SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import { CLEAR_CRISIS_TEMPLATE } from '../../crisis/CrisisActionFactory';
import { SUBJECT_INFORMATION, POST_PROCESS_FIELDS } from '../../../utils/constants/CrisisTemplateConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';
import { isNotInteger } from '../../../utils/ValidationUtils';

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

export function getInvalidFields(state :Map<*, *>) {
  const invalidFields = [];

  if (state.get(IS_NEW_PERSON)) {
    if (!state.get(LAST, '').length) {
      invalidFields.push(LAST);
    }

    if (!state.get(FIRST, '').length) {
      invalidFields.push(FIRST);
    }

    if (!state.get(GENDER, '').length) {
      invalidFields.push(GENDER);
    }

    if (!state.get(RACE, '').length) {
      invalidFields.push(RACE);
    }

    if (state.get(SSN_LAST_4, '').length !== 4) {
      invalidFields.push(SSN_LAST_4);
    }

    if (!state.get(DOB, '').length || !moment(state.get(DOB, '')).isValid()) {
      invalidFields.push(DOB);
    }

    const age = state.get(AGE, '');
    if (!(age > 0) && !age.length) {
      invalidFields.push(AGE);
    }

  }
  else if (!state.get(PERSON_ID, '').length) {
    invalidFields.push(PERSON_ID);
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
  const dobMoment = moment(state.get(DOB, ''));
  const dob = dobMoment.isValid() ? dobMoment.format('MM-DD-YYYY') : '';

  const preprocessedState = state.get(IS_NEW_PERSON)
    ? state.set(DOB, dob).set(PERSON_ID, randomUUID())
    : Map().set(PERSON_ID, state.get(PERSON_ID));

  return preprocessedState
    .set(POST_PROCESS_FIELDS.DOB, dob)
    .set(POST_PROCESS_FIELDS.RACE, state.get(RACE))
    .set(POST_PROCESS_FIELDS.GENDER, state.get(GENDER))
    .toJS();
}
