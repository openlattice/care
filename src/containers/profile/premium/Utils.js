// @flow

import { List, Map } from 'immutable';
import { DateTime } from 'luxon';
import type { FQN } from 'lattice';

import {
  ARMED_WITH_WEAPON_FQN,
  DATE_TIME_OCCURRED_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  OTHER_PERSON_INJURED_FQN,
  PERSON_INJURED_FQN,
  THREATENED_INDICATOR_FQN,
} from '../../../edm/DataModelFqns';

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

const countPropertyOccurrance = (reports :List<Map>, propertyTypeFqn :FQN) => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const propertyValues = report.get(propertyTypeFqn, []);

      propertyValues.forEach((value) => {
        incrementValueAtKey(mutable, value, value);
      });

    });
  });

const countCrisisCalls = (reports :List<Map>, timeFQN :FQN = DATE_TIME_OCCURRED_FQN) => {
  let total = 0;
  let recent = 0;
  reports.forEach((report :Map) => {
    const occurred = report.getIn([timeFQN, 0], '');
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

const countSafetyIncidents = (reports :List) :Map => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const injuryType = report.get(INJURIES_FQN, List());
      const injuredParties = report.get(PERSON_INJURED_FQN, List());
      const otherInjuryType = report.getIn([INJURIES_OTHER_FQN, 0], '');
      const otherInjuredPerson = report.getIn([OTHER_PERSON_INJURED_FQN, 0], '');

      const hadInjuries :boolean = (
        injuryType.count() > 0
        || injuredParties.count() > 0
        || otherInjuryType.length > 0
        || otherInjuredPerson.length > 0
      );

      const armedWithWeapon :boolean = report.getIn([ARMED_WITH_WEAPON_FQN, 0], false);
      const threatenedViolence :boolean = report.getIn([THREATENED_INDICATOR_FQN, 0], false);

      incrementValueAtKey(mutable, 'Armed', armedWithWeapon);
      incrementValueAtKey(mutable, 'Injuries', threatenedViolence);
      incrementValueAtKey(mutable, 'Violence', hadInjuries);
    });
  })
  .sortBy((count) => -count)
  .toArray()
  .map(([name, count]) => ({ name, count }));

export {
  countCrisisCalls,
  countPropertyOccurrance,
  countSafetyIncidents,
  incrementValueAtKey,
};
