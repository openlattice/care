/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

import { CLEAR_SUBJECT_INFORMATION, SET_INPUT_VALUE, SET_INPUT_VALUES } from './Actions';

import { getAgeFromIsoDate } from '../../../utils/DateUtils';
import { POST_PROCESS_FIELDS, SUBJECT_INFORMATION } from '../../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';
import { CLEAR_REPORT } from '../../reports/ReportsActions';

const {
  AGE,
  AKA,
  DOB,
  DOB_UNKNOWN,
  ETHNICITY,
  FIRST,
  FULL_NAME,
  GENDER,
  IS_NEW_PERSON,
  LAST,
  MIDDLE,
  PERSON_ID,
  RACE,
  SSN_LAST_4,
} = SUBJECT_INFORMATION;

const INITIAL_STATE :Map = fromJS({
  [AGE]: '',
  [AKA]: '',
  [DOB]: '',
  [DOB_UNKNOWN]: false,
  [ETHNICITY]: '',
  [FIRST]: '',
  [FULL_NAME]: '',
  [GENDER]: '',
  [IS_NEW_PERSON]: true,
  [LAST]: '',
  [MIDDLE]: '',
  [PERSON_ID]: '',
  [RACE]: '',
  [SSN_LAST_4]: '',
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case SET_INPUT_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }

    case SET_INPUT_VALUES:
      return state.merge(fromJS(action.value));

    case CLEAR_SUBJECT_INFORMATION:
    case CLEAR_REPORT:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export function getInvalidFields(state :Map) {
  const invalidFields = [];

  if (state.get(IS_NEW_PERSON)) {

    if (!state.get(GENDER, '').length) {
      invalidFields.push(GENDER);
    }

    if (!state.get(RACE, '').length) {
      invalidFields.push(RACE);
    }

    if (state.get(DOB_UNKNOWN)) {
      const age = state.get(AGE);
      if ((age < 0)) {
        invalidFields.push(AGE);
      }
    }
    else if (!DateTime.fromISO(state.get(DOB)).isValid) {
      invalidFields.push(DOB);
    }

  }

  return invalidFields;
}

export function getStatus(state :Map) :string {
  if (state === INITIAL_STATE) {
    return FORM_STEP_STATUS.INITIAL;
  }

  return getInvalidFields(state).length ? FORM_STEP_STATUS.IN_PROGRESS : FORM_STEP_STATUS.COMPLETED;
}

export function processForSubmit(state :Map) :Object {
  const dobDT = DateTime.fromISO(state.get(DOB));
  const dob = dobDT.isValid ? dobDT.toISODate() : undefined;
  const last4SSN = state.get(SSN_LAST_4) || undefined;

  let preprocessedState = state.get(IS_NEW_PERSON)
    ? state.set(DOB, dob).set(PERSON_ID, uuid())
    : Map().set(PERSON_ID, state.get(PERSON_ID));

  if (dobDT.isValid && !state.get(AGE)) {
    preprocessedState = preprocessedState.set(AGE, getAgeFromIsoDate(dob, true));
  }

  return preprocessedState
    .set(POST_PROCESS_FIELDS.DOB, dob)
    .set(POST_PROCESS_FIELDS.RACE, state.get(RACE))
    .set(POST_PROCESS_FIELDS.GENDER, state.get(GENDER))
    .set(SSN_LAST_4, last4SSN)
    .toJS();
}
