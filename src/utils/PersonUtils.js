// @flow
import { DateTime } from 'luxon';
import type { Map } from 'immutable';
import * as FQN from '../edm/DataModelFqns';

const getLastFirstMiFromPerson = (person :Map) => {
  const firstName = person.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = person.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
  const middle = person.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], '');
  let lastName = '';
  let middleInitial = '';

  if (last) {
    lastName = `${last},`;
  }

  if (middle) {
    middleInitial = `${middle.charAt(0)}.`;
  }

  return `${lastName} ${firstName} ${middleInitial}`.trim();
};

const getFirstLastFromPerson = (person :Map) => {
  const firstName = person.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = person.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');

  return `${firstName} ${last}`.trim();
};

const getDobFromPerson = (person :Map) => {
  const rawDob = person.getIn([FQN.PERSON_DOB_FQN, 0], '');

  if (rawDob) {
    return DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
  }

  return rawDob;
};

export {
  getDobFromPerson,
  getFirstLastFromPerson,
  getLastFirstMiFromPerson,
};
