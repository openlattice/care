// @flow
import { List, Map, getIn } from 'immutable';
import { DateTime, Interval } from 'luxon';

import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
} from '../../../edm/DataModelFqns';

const formatPersonName = (person :Map | Object) => {
  const firstName = getIn(person, [PERSON_FIRST_NAME_FQN, 0], '');
  const lastName = getIn(person, [PERSON_LAST_NAME_FQN, 0], '');
  const middleName = getIn(person, [PERSON_MIDDLE_NAME_FQN, 0], '');
  return `${lastName}, ${firstName} ${middleName}`;
};

const getPersonOptions = (searchResults :List = List()) => searchResults
  .map((person) => {
    const dobStr = getIn(person, [PERSON_DOB_FQN, 0], '');
    const formattedDob = DateTime.fromISO(dobStr).toLocaleString(DateTime.DATE_SHORT);
    const label = `${formatPersonName(person)} - ${formattedDob}`;
    return {
      label,
      value: person
    };
  });

const getPersonAge = (person :Map | Object, asNumber :boolean = false, invalidValue :any = '') => {
  const dobStr = getIn(person, [PERSON_DOB_FQN, 0], '');
  const dobDT = DateTime.fromISO(dobStr);
  if (dobDT.isValid) {
    const now = DateTime.local();
    const age = Math.floor(Interval.fromDateTimes(dobDT, now).length('years'));

    return asNumber ? `${age}` : age;
  }

  return invalidValue;
};

export {
  formatPersonName,
  getPersonAge,
  getPersonOptions,
};
