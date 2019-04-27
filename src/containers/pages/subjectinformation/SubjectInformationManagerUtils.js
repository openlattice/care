// @flow
import { List, Map, OrderedMap } from 'immutable';
import moment from 'moment';

import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
} from '../../../edm/DataModelFqns';

const formatPersonName = (person :Map) => {
  const firstName = person.getIn([PERSON_FIRST_NAME_FQN, 0], '');
  const lastName = person.getIn([PERSON_LAST_NAME_FQN, 0], '');
  const middleName = person.getIn([PERSON_MIDDLE_NAME_FQN, 0], '');
  return `${lastName}, ${firstName} ${middleName}`;
};

const getPersonOptions = (searchResults :List) => {
  const options = OrderedMap().withMutations((mutable) => {
    searchResults.forEach((person) => {
      const dobStr = person.getIn([PERSON_DOB_FQN, 0], '');
      const dobMoment = moment(dobStr);

      const dob = dobMoment.isValid() ? dobMoment.format('MM-DD-YYYY') : dobStr;

      mutable.set(List.of(formatPersonName(person), dob), person);
    });
  });

  return options;
};

export {
  formatPersonName,
  getPersonOptions
};
