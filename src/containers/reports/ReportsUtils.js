// @flow
import moment from 'moment';
import type { Map } from 'immutable';
import {
  CRISIS_NATURE,
  OBSERVED_BEHAVIORS,
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
  [OBSERVED_BEHAVIORS.BEHAVIORS]: data.get(FQN.OBSERVED_BEHAVIORS_FQN, []),
  [OBSERVED_BEHAVIORS.OTHER_BEHAVIOR]: data.getIn([FQN.OBSERVED_BEHAVIORS_OTHER_FQN, 0]),
  [OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE]: data.getIn([FQN.SUICIDAL_ACTIONS_FQN, 0]),
  [OBSERVED_BEHAVIORS.SUICIDE_METHODS]: data.get(FQN.SUICIDE_ATTEMPT_METHOD_FQN, []),
  [OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD]: data.getIn([FQN.SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0]),
  [OBSERVED_BEHAVIORS.DEMEANORS]: data.get(FQN.DEMEANORS_FQN, []),
  [OBSERVED_BEHAVIORS.OTHER_DEMEANOR]: data.getIn([FQN.OTHER_DEMEANORS_FQN, 0]),
});

const compileNatureOfCrisisData = (data :Map) => ({
  [CRISIS_NATURE.NATURE_OF_CRISIS]: data.get(FQN.DISPATCH_REASON_FQN, []),
  [CRISIS_NATURE.BIOLOGICAL_CAUSES]: data.get(FQN.BIOLOGICALLY_INDUCED_CAUSES_FQN, []),
  [CRISIS_NATURE.CHEMICAL_CAUSES]: data.get(FQN.CHEMICALLY_INDUCED_CAUSES_FQN, []),
  [CRISIS_NATURE.ASSISTANCE]: data.get(FQN.PERSON_ASSISTING_FQN, []),
  [CRISIS_NATURE.OTHER_ASSISTANCE]: data.getIn([FQN.OTHER_PERSON_ASSISTING_FQN, 0]),
  [CRISIS_NATURE.HOUSING]: data.getIn([FQN.HOUSING_SITUATION_FQN, 0]),
});

const compileOfficerSafetyData = (data :Map) => ({

});

const compileDispositionData = (data :Map) => ({

});

export {
  compileDispositionData,
  compileNatureOfCrisisData,
  compileObservedBehaviorData,
  compileOfficerSafetyData,
  compileSubjectData,
};
