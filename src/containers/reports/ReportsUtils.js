// @flow
import moment from 'moment';
import type { Map } from 'immutable';
import { SUBJECT_INFORMATION, OBSERVED_BEHAVIORS } from '../../utils/constants/CrisisTemplateConstants';
import {
  PERSON_DOB_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_ID_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  MILITARY_STATUS_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OBSERVED_BEHAVIORS_OTHER_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  DEMEANORS_FQN,
  OTHER_DEMEANORS_FQN,
} from '../../edm/DataModelFqns';
import { formatPersonName } from '../pages/subjectinformation/SubjectInformationManagerUtils';

const compileSubjectData = (data :Map) => {
  return {
    [SUBJECT_INFORMATION.PERSON_ID]: data.getIn([PERSON_ID_FQN, 0], ''),
    [SUBJECT_INFORMATION.FULL_NAME]: formatPersonName(data),
    [SUBJECT_INFORMATION.FIRST]: data.getIn([PERSON_FIRST_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.LAST]: data.getIn([PERSON_LAST_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.MIDDLE]: data.getIn([PERSON_MIDDLE_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.AKA]: data.getIn([PERSON_NICK_NAME_FQN, 0], ''),
    [SUBJECT_INFORMATION.DOB]: data.getIn([PERSON_DOB_FQN, 0], ''),
    [SUBJECT_INFORMATION.RACE]: data.getIn([PERSON_RACE_FQN, 0], ''),
    [SUBJECT_INFORMATION.GENDER]: data.getIn([PERSON_SEX_FQN, 0], ''),
    [SUBJECT_INFORMATION.AGE]: moment().diff(moment(data.getIn([PERSON_DOB_FQN, 0], '')), 'years'),
    [SUBJECT_INFORMATION.SSN_LAST_4]: 'XXXX',
    [SUBJECT_INFORMATION.IS_NEW_PERSON]: false
  };
};

const compileObservedBehaviorData = (data :Map) => {
  return {
    [OBSERVED_BEHAVIORS.VETERAN]: data.getIn([MILITARY_STATUS_FQN, 0]) === 'Veteran',
    [OBSERVED_BEHAVIORS.BEHAVIORS]: data.get(OBSERVED_BEHAVIORS_FQN, []),
    [OBSERVED_BEHAVIORS.OTHER_BEHAVIOR]: data.getIn([OBSERVED_BEHAVIORS_OTHER_FQN, 0]),
    [OBSERVED_BEHAVIORS.SUICIDE_ATTEMPT_TYPE]: data.getIn([SUICIDAL_ACTIONS_FQN, 0]),
    [OBSERVED_BEHAVIORS.SUICIDE_METHODS]: data.get(SUICIDE_ATTEMPT_METHOD_FQN, []),
    [OBSERVED_BEHAVIORS.OTHER_SUICIDE_METHOD]: data.getIn([SUICIDE_ATTEMPT_METHOD_OTHER_FQN, 0]),
    [OBSERVED_BEHAVIORS.DEMEANORS]: data.get(DEMEANORS_FQN, []),
    [OBSERVED_BEHAVIORS.OTHER_DEMEANOR]: data.getIn([OTHER_DEMEANORS_FQN, 0]),
  };
};

const compileNatureOfCrisisData = (data :Map) => {
  
};

const compileOfficerSafetyData = (data :Map) => {
  
};

const compileDispositionData = (data :Map) => {

};

export {
  compileSubjectData,
  compileObservedBehaviorData
};
