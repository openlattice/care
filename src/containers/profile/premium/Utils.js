// @flow
import { Models } from 'lattice';
import { List, Map } from 'immutable';
import { DateTime } from 'luxon';
import { DATE_TIME_OCCURRED_FQN } from '../../../edm/DataModelFqns';

const { FullyQualifiedName } = Models;

const incrementValueAtKey = (mutable :Map, key :string, value :boolean) => {
  if (value) {
    if (mutable.has(key)) {
      mutable.update(key, (count) => count + 1);
    }
    else {
      mutable.set(key, 1);
    }
  }
};

const countPropertyOccurrance = (reports :List<Map>, propertyTypeFqn :FullyQualifiedName) => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const propertyValues = report.get(propertyTypeFqn, []);

      propertyValues.forEach((value) => {
        incrementValueAtKey(mutable, value, value);
      });

    });
  });

const countCrisisCalls = (reports :List<Map>) => {
  let total = 0;
  let recent = 0;
  reports.forEach((report :Map) => {
    const occurred = report.getIn([DATE_TIME_OCCURRED_FQN, 0], '');
    const dtOccurred = DateTime.fromISO(occurred);
    if (dtOccurred.isValid) {
      const durationInYears = dtOccurred
        .until(DateTime.local()).toDuration(['years'])
        .toObject()
        .years;

      const durationInWeeks = dtOccurred
        .until(DateTime.local()).toDuration(['weeks'])
        .toObject()
        .weeks;

      if (durationInYears <= 1) total += 1;
      if (durationInWeeks <= 1) recent += 1;
    }
  });

  return { recent, total };
};

export {
  countCrisisCalls,
  countPropertyOccurrance,
  incrementValueAtKey,
};
