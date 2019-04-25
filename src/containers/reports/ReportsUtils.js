// @flow
import moment from 'moment';
import { List, Map } from 'immutable';
import { isDefined } from '../../utils/LangUtils';
import {
  CRISIS_NATURE,
  DISPOSITION,
  OBSERVED_BEHAVIORS,
  OFFICER_SAFETY,
  SUBJECT_INFORMATION,
} from '../../utils/constants/CrisisTemplateConstants';
import * as FQN from '../../edm/DataModelFqns';
import { formatPersonName } from '../pages/subjectinformation/SubjectInformationManagerUtils';

const compileSubjectData = (data :Map) => ({
  [SUBJECT_INFORMATION.PERSON_ID]: data.getIn([FQN.PERSON_ID_FQN, 0], ''),
  [SUBJECT_INFORMATION.FULL_NAME]: formatPersonName(data),
  [SUBJECT_INFORMATION.FIRST]: data.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], ''),
  [SUBJECT_INFORMATION.LAST]: data.getIn([FQN.PERSON_LAST_NAME_FQN, 0], ''),
  [SUBJECT_INFORMATION.MIDDLE]: data.getIn([FQN.PERSON_MIDDLE_NAME_FQN, 0], ''),
  [SUBJECT_INFORMATION.AKA]: data.getIn([FQN.PERSON_NICK_NAME_FQN, 0], ''),
  [SUBJECT_INFORMATION.DOB]: data.getIn([FQN.PERSON_DOB_FQN, 0], ''),
  [SUBJECT_INFORMATION.RACE]: data.getIn([FQN.PERSON_RACE_FQN, 0], ''),
  [SUBJECT_INFORMATION.GENDER]: data.getIn([FQN.PERSON_SEX_FQN, 0], ''),
  [SUBJECT_INFORMATION.AGE]: moment().diff(moment(data.getIn([FQN.PERSON_DOB_FQN, 0], '')), 'years'),
  [SUBJECT_INFORMATION.SSN_LAST_4]: 'XXXX',
  [SUBJECT_INFORMATION.IS_NEW_PERSON]: false
});

const compileObservedBehaviorData = (data :Map) => ({
  [OBSERVED_BEHAVIORS.VETERAN]: data.getIn([FQN.MILITARY_STATUS_FQN, 0]) === 'Veteran',
  [OBSERVED_BEHAVIORS.BEHAVIORS]: data.get(FQN.OBSERVED_BEHAVIORS_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_BEHAVIOR]: data.getIn([FQN.OBSERVED_BEHAVIORS_OTHER_FQN, 0]),
  [OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE]: data.getIn([FQN.SUICIDAL_ACTIONS_FQN, 0]),
  [OBSERVED_BEHAVIORS.SUICIDE_METHODS]: data.get(FQN.SUICIDE_ATTEMPT_METHOD_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD]: data.getIn([FQN.SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0]),
  [OBSERVED_BEHAVIORS.DEMEANORS]: data.get(FQN.DEMEANORS_FQN, List()).toJS(),
  [OBSERVED_BEHAVIORS.OTHER_DEMEANOR]: data.getIn([FQN.OTHER_DEMEANORS_FQN, 0]),
});

const compileNatureOfCrisisData = (data :Map) => ({
  [CRISIS_NATURE.NATURE_OF_CRISIS]: data.get(FQN.DISPATCH_REASON_FQN, List()).toJS(),
  [CRISIS_NATURE.BIOLOGICAL_CAUSES]: data.get(FQN.BIOLOGICALLY_INDUCED_CAUSES_FQN, List()).toJS(),
  [CRISIS_NATURE.CHEMICAL_CAUSES]: data.get(FQN.CHEMICALLY_INDUCED_CAUSES_FQN, List()).toJS(),
  [CRISIS_NATURE.ASSISTANCE]: data.get(FQN.PERSON_ASSISTING_FQN, List()).toJS(),
  [CRISIS_NATURE.OTHER_ASSISTANCE]: data.getIn([FQN.OTHER_PERSON_ASSISTING_FQN, 0]),
  [CRISIS_NATURE.HOUSING]: data.getIn([FQN.HOUSING_SITUATION_FQN, 0]),
});

const compileOfficerSafetyData = (data :Map) => {

  const injuryType = data.get(FQN.INJURIES_FQN, List()).toJS();
  const otherInjuryType = data.getIn([FQN.INJURIES_OTHER_FQN, 0]);
  const injuredParties = data.get(FQN.PERSON_INJURED_FQN, List()).toJS();
  const otherInjuredPerson = data.getIn([FQN.OTHER_PERSON_INJURED_FQN, 0]);

  const hadInjuries = (
    injuryType.length > 0
    || isDefined(otherInjuryType)
    || injuredParties.length > 0
    || isDefined(otherInjuredPerson)
  );

  return {
    [OFFICER_SAFETY.TECHNIQUES]: data.get(FQN.DEESCALATION_TECHNIQUES_FQN, List()).toJS(),
    [OFFICER_SAFETY.HAD_WEAPON]: data.getIn([FQN.ARMED_WITH_WEAPON_FQN, 0]),
    [OFFICER_SAFETY.WEAPONS]: data.get(FQN.ARMED_WEAPON_TYPE_FQN, List()).toJS(),
    [OFFICER_SAFETY.OTHER_WEAPON]: data.getIn([FQN.OTHER_WEAPON_TYPE_FQN, 0]),
    [OFFICER_SAFETY.THREATENED_VIOLENCE]: data.getIn([FQN.THREATENED_INDICATOR_FQN, 0]),
    [OFFICER_SAFETY.THREATENED_PERSON_RELATIONSHIP]: data.get(FQN.DIRECTED_AGAINST_RELATION_FQN, List()).toJS(),
    [OFFICER_SAFETY.HAD_INJURIES]: hadInjuries,
    [OFFICER_SAFETY.INJURY_TYPE]: injuryType,
    [OFFICER_SAFETY.OTHER_INJURY_TYPE]: otherInjuryType,
    [OFFICER_SAFETY.INJURED_PARTIES]: injuredParties,
    [OFFICER_SAFETY.OTHER_INJURED_PERSON]: otherInjuredPerson,
  };
};

const compileDispositionData = (data :Map) => ({
  [DISPOSITION.SPECIALISTS]: data.get(FQN.SPECIAL_RESOURCES_CALLED_FQN, List()).toJS(),
  [DISPOSITION.DISPOSITIONS]: data.get(FQN.DISPOSITION_FQN, List()).toJS(),
  [DISPOSITION.VERBAL_REFERRALS]: data.get(FQN.REFERRAL_DEST_FQN, List()).toJS(),
  [DISPOSITION.OTHER_VERBAL_REFERRAL]: data.getIn([FQN.OTHER_TEXT_FQN, 0]),
  [DISPOSITION.REPORT_NUMBER]: data.getIn([FQN.OL_ID_FQN, 0]),
  [DISPOSITION.INCIDENT_DESCRIPTION]: data.getIn([FQN.INCIDENT_NARRATIVE_FQN, 0]),
  [DISPOSITION.WAS_VOLUNTARY_TRANSPORT]: data.getIn([FQN.VOLUNTARY_ACTION_INDICATOR_FQN, 0]),
  [DISPOSITION.PEOPLE_NOTIFIED]: data.get(FQN.CATEGORY_FQN, List()).toJS(),
  [DISPOSITION.OTHER_PEOPLE_NOTIFIED]: data.getIn([FQN.OTHER_NOTIFIED_FQN, 0]),
  [DISPOSITION.COURTESY_TRANSPORTS]: data.get(FQN.ORGANIZATION_NAME_FQN, List()).toJS(),
  [DISPOSITION.INCIDENT_DATE_TIME]: data.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]),

});

export {
  compileDispositionData,
  compileNatureOfCrisisData,
  compileObservedBehaviorData,
  compileOfficerSafetyData,
  compileSubjectData,
};
