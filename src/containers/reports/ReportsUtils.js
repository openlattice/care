// @flow

import { List, Map, fromJS } from 'immutable';
import { Logger } from 'lattice-utils';
import { DateTime } from 'luxon';

import { NONE } from './crisis/schemas/constants';

import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import {
  CRISIS_NATURE,
  DISPOSITION,
  OBSERVED_BEHAVIORS,
  OFFICER_SAFETY,
  SUBJECT_INFORMATION,
} from '../../utils/constants/CrisisReportConstants';
import {
  ARRESTED,
  CRIMES_AGAINST_PERSON,
  FELONY,
  NOT_ARRESTED,
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED,
  UNABLE_TO_CONTACT,
} from '../pages/disposition/Constants';

const {
  INJURY_FQN,
  SELF_HARM_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ReportsUtils');

const compileSubjectData = (subjectData :Map, reportData :Map) => {
  const subjectDob = subjectData.getIn([FQN.PERSON_DOB_FQN, 0], '');
  const dobUnknown = !subjectDob;
  const dobDate = DateTime.fromISO(subjectDob);

  const reportedAge = reportData.getIn([FQN.AGE_FQN, 0], '');
  const occurred = reportData.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0], '');
  const occurredDT = DateTime.fromISO(occurred);

  let ageDuringReport = reportedAge;
  if (occurredDT.isValid && dobDate.isValid) {
    ageDuringReport = dobDate
      .until(occurredDT)
      .toDuration(['years', 'months'])
      .toObject()
      .years;
  }

  return {
    [SUBJECT_INFORMATION.PERSON_ID]: subjectData.getIn([FQN.PERSON_ID_FQN, 0], ''),
    [SUBJECT_INFORMATION.FULL_NAME]: getLastFirstMiFromPerson(subjectData),
    [SUBJECT_INFORMATION.FIRST]: subjectData.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.LAST]: subjectData.getIn([FQN.PERSON_LAST_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.MIDDLE]: subjectData.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.AKA]: subjectData.getIn([FQN.PERSON_NICK_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.DOB]: subjectDob,
    [SUBJECT_INFORMATION.RACE]: subjectData.getIn([FQN.PERSON_RACE_FQN, 0], ''),
    [SUBJECT_INFORMATION.GENDER]: subjectData.getIn([FQN.PERSON_SEX_FQN, 0], ''),
    [SUBJECT_INFORMATION.ETHNICITY]: subjectData.getIn([FQN.PERSON_ETHNICITY_FQN, 0], ''),
    [SUBJECT_INFORMATION.AGE]: ageDuringReport,
    [SUBJECT_INFORMATION.DOB_UNKNOWN]: dobUnknown,
    [SUBJECT_INFORMATION.SSN_LAST_4]: subjectData.getIn([FQN.PERSON_SSN_LAST_4_FQN, 0], ''),
    [SUBJECT_INFORMATION.IS_NEW_PERSON]: false,
  };
};

const compileObservedBehaviorData = (data :Map) => ({
  [OBSERVED_BEHAVIORS.VETERAN]: data.getIn([FQN.MILITARY_STATUS_FQN, 0]) === 'Veteran',
  [OBSERVED_BEHAVIORS.BEHAVIORS]: data.get(FQN.OBSERVED_BEHAVIORS_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_BEHAVIOR]: data.getIn([FQN.OBSERVED_BEHAVIORS_OTHER_FQN, 0], ''),
  [OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE]: data.getIn([FQN.SUICIDAL_ACTIONS_FQN, 0], ''),
  [OBSERVED_BEHAVIORS.SUICIDE_METHODS]: data.get(FQN.SUICIDE_ATTEMPT_METHOD_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD]: data.getIn([FQN.SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0], ''),
  [OBSERVED_BEHAVIORS.DEMEANORS]: data.get(FQN.DEMEANORS_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_DEMEANOR]: data.getIn([FQN.OTHER_DEMEANORS_FQN, 0], ''),
});

const compileNatureOfCrisisData = (data :Map) => ({
  [CRISIS_NATURE.NATURE_OF_CRISIS]: data.get(FQN.DISPATCH_REASON_FQN, List()).toJS(),
  [CRISIS_NATURE.BIOLOGICAL_CAUSES]: data.get(FQN.BIOLOGICALLY_INDUCED_CAUSES_FQN, List()).toJS(),
  [CRISIS_NATURE.CHEMICAL_CAUSES]: data.get(FQN.CHEMICALLY_INDUCED_CAUSES_FQN, List()).toJS(),
  [CRISIS_NATURE.ASSISTANCE]: data.get(FQN.PERSON_ASSISTING_FQN, List()).toJS(),
  [CRISIS_NATURE.OTHER_ASSISTANCE]: data.getIn([FQN.OTHER_PERSON_ASSISTING_FQN, 0], ''),
  [CRISIS_NATURE.HOUSING]: data.getIn([FQN.HOUSING_SITUATION_FQN, 0], ''),
});

const compileOfficerSafetyData = (data :Map) => {

  const injuryType = data.get(FQN.INJURIES_FQN, List()).toJS();
  const otherInjuryType = data.getIn([FQN.INJURIES_OTHER_FQN, 0], '');
  const injuredParties = data.get(FQN.PERSON_INJURED_FQN, List()).toJS();
  const otherInjuredPerson = data.getIn([FQN.OTHER_PERSON_INJURED_FQN, 0], '');

  const hadInjuries = (
    injuryType.length > 0
    || otherInjuryType.length > 0
    || injuredParties.length > 0
    || otherInjuredPerson.length > 0
  );

  return {
    [OFFICER_SAFETY.TECHNIQUES]: data.get(FQN.DEESCALATION_TECHNIQUES_FQN, List()).toJS(),
    [OFFICER_SAFETY.HAD_WEAPON]: data.getIn([FQN.ARMED_WITH_WEAPON_FQN, 0], false),
    [OFFICER_SAFETY.WEAPONS]: data.get(FQN.ARMED_WEAPON_TYPE_FQN, List()).toJS(),
    [OFFICER_SAFETY.OTHER_WEAPON]: data.getIn([FQN.OTHER_WEAPON_TYPE_FQN, 0], ''),
    [OFFICER_SAFETY.THREATENED_VIOLENCE]: data.getIn([FQN.THREATENED_INDICATOR_FQN, 0], false),
    [OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP]: data.get(FQN.DIRECTED_AGAINST_RELATION_FQN, List()).toJS(),
    [OFFICER_SAFETY.HAD_INJURIES]: hadInjuries,
    [OFFICER_SAFETY.INJURY_TYPE]: injuryType,
    [OFFICER_SAFETY.OTHER_INJURY_TYPE]: otherInjuryType,
    [OFFICER_SAFETY.INJURED_PARTIES]: injuredParties,
    [OFFICER_SAFETY.OTHER_INJURED_PERSON]: otherInjuredPerson
  };
};

const compileDispositionData = (data :Map) => {
  const noActionValues = [];
  const noActionPossible = data.getIn([FQN.NO_ACTION_POSSIBLE_FQN, 0], false);
  const unableToContact = data.getIn([FQN.UNABLE_TO_CONTACT_FQN, 0], false);
  const resourcesDeclined = data.getIn([FQN.RESOURCES_DECLINED_FQN, 0], false);

  if (noActionPossible) noActionValues.push(NO_ACTION_NECESSARY);
  if (unableToContact) noActionValues.push(UNABLE_TO_CONTACT);
  if (resourcesDeclined) noActionValues.push(RESOURCES_DECLINED);

  const arrestableOffenses = [];
  const arrestIndicator = data.getIn([FQN.ARREST_INDICATOR_FQN, 0], false);
  const crimesAgainstPerson = data.getIn([FQN.CRIMES_AGAINST_PERSON_FQN, 0], false);
  const felonyIndicator = data.getIn([FQN.FELONY_INDICATOR_FQN, 0], false);

  if (crimesAgainstPerson) arrestableOffenses.push(CRIMES_AGAINST_PERSON);
  if (felonyIndicator) arrestableOffenses.push(FELONY);
  if (arrestIndicator) {
    arrestableOffenses.push(ARRESTED);
  }
  else {
    arrestableOffenses.push(NOT_ARRESTED);
  }

  return {
    [DISPOSITION.SPECIALISTS]: data.get(FQN.SPECIAL_RESOURCES_CALLED_FQN, List()).toJS(),
    [DISPOSITION.DISPOSITIONS]: data.get(FQN.DISPOSITION_FQN, List()).toJS(),
    [DISPOSITION.VERBAL_REFERRALS]: data.get(FQN.REFERRAL_DEST_FQN, List()).toJS(),
    [DISPOSITION.OTHER_VERBAL_REFERRAL]: data.getIn([FQN.OTHER_TEXT_FQN, 0], ''),
    [DISPOSITION.REPORT_NUMBER]: data.getIn([FQN.OL_ID_FQN, 0], ''),
    [DISPOSITION.INCIDENT_DESCRIPTION]: data.getIn([FQN.INCIDENT_NARRATIVE_FQN, 0], ''),
    [DISPOSITION.WAS_VOLUNTARY_TRANSPORT]: data.getIn([FQN.VOLUNTARY_ACTION_INDICATOR_FQN, 0]),
    [DISPOSITION.PEOPLE_NOTIFIED]: data.get(FQN.CATEGORY_FQN, List()).toJS(),
    [DISPOSITION.OTHER_PEOPLE_NOTIFIED]: data.getIn([FQN.OTHER_NOTIFIED_FQN, 0], ''),
    [DISPOSITION.COURTESY_TRANSPORTS]: data.get(FQN.ORGANIZATION_NAME_FQN, List()).toJS(),
    [DISPOSITION.INCIDENT_DATE_TIME]: data.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0], ''),
    [DISPOSITION.NO_ACTION_VALUES]: noActionValues,
    [DISPOSITION.ARRESTABLE_OFFENSES]: arrestableOffenses,
    [DISPOSITION.HAS_REPORT_NUMBER]: data.hasIn([FQN.OL_ID_FQN, 0])
  };
};

const getEntityDataFromFields = (formData :Object, fields :Object, propertyTypeIds :Map) => {
  const entityData = {};
  Object.keys(fields).forEach((field) => {
    const fqn = fields[field];
    const propertyTypeId = propertyTypeIds.get(fqn);
    if (!propertyTypeId) {
      LOG.error('propertyType id for fqn not found', fqn);
    }
    else {
      let updatedValue;
      if (Array.isArray(formData[field])) {
        updatedValue = formData[field];
      }
      else {
        updatedValue = [formData[field]];
      }
      entityData[propertyTypeId] = updatedValue;
    }
  });

  return entityData;
};

const getProfileV2SafetySummary = (groupedNeighborsByType :Map<string, List>) => {

  const injuries = groupedNeighborsByType.get(INJURY_FQN, List());
  const selfHarms = groupedNeighborsByType.get(SELF_HARM_FQN, List());
  const violentBehaviors = groupedNeighborsByType.get(VIOLENT_BEHAVIOR_FQN, List());
  const weapons = groupedNeighborsByType.get(WEAPON_FQN, List());

  const injuryCount = injuries
    .countBy((injury) => injury.getIn([FQN.PERSON_INJURED_FQN, 0]) !== NONE)
    .get(true, 0);

  const selfHarmCount = selfHarms
    .countBy((selfHarm) => selfHarm.getIn([FQN.ACTION_FQN, 0]) !== NONE)
    .get(true, 0);

  const violenceCount = violentBehaviors
    .countBy((violence) => violence.getIn([FQN.DIRECTED_AGAINST_RELATION_FQN, 0]) !== NONE)
    .get(true, 0);

  const weaponCount = weapons
    .countBy((weapon) => weapon.getIn([FQN.TYPE_FQN, 0]) !== NONE)
    .get(true, 0);

  return fromJS([
    { name: 'Injuries', count: injuryCount },
    { name: 'Self-harm', count: selfHarmCount },
    { name: 'Violence', count: violenceCount },
    { name: 'Armed', count: weaponCount },
  ])
    .sortBy((category) => category.get('count'), (valueA, valueB) => valueB - valueA);
};

export {
  compileDispositionData,
  compileNatureOfCrisisData,
  compileObservedBehaviorData,
  compileOfficerSafetyData,
  compileSubjectData,
  getEntityDataFromFields,
  getProfileV2SafetySummary,
};
