// @flow
import { List, Map, getIn } from 'immutable';

import { getAgeFromIsoDate, getDateShortFromIsoDate } from './DateUtils';

import * as FQN from '../edm/DataModelFqns';

const getLastFirstMiFromPerson = (person :Map | Object, middleInitialOnly :boolean = false) => {
  const firstName = getIn(person, [FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = getIn(person, [FQN.PERSON_LAST_NAME_FQN, 0], '');
  const middle = getIn(person, [FQN.PERSON_MIDDLE_NAME_FQN, 0], '');
  let lastName = '';
  let middleInitial = '';

  if (last) {
    lastName = `${last},`;
  }

  if (middle) {
    middleInitial = middleInitialOnly ? `${middle.charAt(0)}.` : middle;
  }

  return `${lastName} ${firstName} ${middleInitial}`.trim();
};

const getFirstLastFromPerson = (person :Map | Object) => {
  const firstName = getIn(person, [FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = getIn(person, [FQN.PERSON_LAST_NAME_FQN, 0], '');

  return `${firstName} ${last}`.trim();
};

const getDobFromPerson = (person :Map | Object, asDate :boolean = false, invalidValue :any = '') => {
  const dobStr = getIn(person, [FQN.PERSON_DOB_FQN, 0], '');
  return getDateShortFromIsoDate(dobStr, asDate, invalidValue);
};

const getPersonOptions = (searchResults :List = List()) => searchResults
  .map((person) => {
    // $FlowFixMe
    const formattedDob :string = getDobFromPerson(person);
    const formattedName :string = getLastFirstMiFromPerson(person);
    const label = formattedDob.length
      ? `${formattedName} - ${formattedDob}`
      : `${formattedName}`;
    return {
      label,
      value: person
    };
  });

const getPersonAge = (person :Map | Object, asNumber :boolean = false, invalidValue :any = '') => {
  const dobStr = getIn(person, [FQN.PERSON_DOB_FQN, 0], '');
  return getAgeFromIsoDate(dobStr, asNumber, invalidValue);
};

export {
  getDobFromPerson,
  getFirstLastFromPerson,
  getLastFirstMiFromPerson,
  getPersonAge,
  getPersonOptions,
};
