/*
 * @flow
 */

import moment from 'moment';
import randomUUID from 'uuid/v4';
import { Map, fromJS } from 'immutable';

import * as FQNS from '../../edm/DataModelFqns';
import { isNonEmptyObject } from '../../utils/LangUtils';

/*
 * Complainant Information Section
 */

const COMPLAINANT_INFO_INITIAL_STATE :Map<string, *> = fromJS({
  [FQNS.COMPLAINANT_ADDRESS_FQN]: '',
  [FQNS.COMPLAINANT_RELATIONSHIP_FQN]: '',
  [FQNS.COMPLAINANT_NAME_FQN]: '',
  [FQNS.COMPLAINANT_PHONE_FQN]: '',
});

function getComplainantInfoInitialState() {
  return COMPLAINANT_INFO_INITIAL_STATE.toJS();
}

/*
 * Consumer Information Section
 */

const CONSUMER_INFO_INITIAL_STATE :Map<string, *> = fromJS({
  [FQNS.ADDRESS_FQN]: '',
  [FQNS.AGE_FQN]: '',
  [FQNS.ARMED_WEAPON_TYPE_FQN]: '',
  [FQNS.ARMED_WITH_WEAPON_FQN]: false,
  [FQNS.ACCESSIBLE_WEAPON_TYPE_FQN]: '',
  [FQNS.ACCESS_TO_WEAPONS_FQN]: false,
  [FQNS.DIRECTED_AGAINST_FQN]: [],
  [FQNS.DIRECTED_AGAINST_OTHER_FQN]: '',
  [FQNS.DOB_FQN]: '',
  [FQNS.PERSON_DOB_FQN]: '',
  [FQNS.DRUGS_ALCOHOL_FQN]: '',
  [FQNS.DRUG_TYPE_FQN]: '',
  [FQNS.EMOTIONAL_STATE_FQN]: [],
  [FQNS.EMOTIONAL_STATE_OTHER_FQN]: '',
  [FQNS.PERSON_FIRST_NAME_FQN]: '',
  [FQNS.GENDER_FQN]: '',
  [FQNS.PERSON_SEX_FQN]: '',
  [FQNS.HIST_DIRECTED_AGAINST_FQN]: [],
  [FQNS.HIST_DIRECTED_AGAINST_OTHER_FQN]: '',
  [FQNS.HISTORY_OF_VIOLENCE_FQN]: false,
  [FQNS.HISTORY_OF_VIOLENCE_TEXT_FQN]: '',
  [FQNS.HOMELESS_FQN]: false,
  [FQNS.HOMELESS_LOCATION_FQN]: '',
  [FQNS.PERSON_ID_FQN]: randomUUID(),
  [FQNS.INJURIES_FQN]: [],
  [FQNS.INJURIES_OTHER_FQN]: '',
  [FQNS.PERSON_LAST_NAME_FQN]: '',
  [FQNS.PERSON_MIDDLE_NAME_FQN]: '',
  [FQNS.MILITARY_STATUS_FQN]: '',
  [FQNS.OBSERVED_BEHAVIORS_FQN]: [],
  [FQNS.OBSERVED_BEHAVIORS_OTHER_FQN]: '',
  [FQNS.PHONE_FQN]: '',
  [FQNS.PHOTOS_TAKEN_OF_FQN]: [],
  [FQNS.PERSON_PICTURE_FQN]: '',
  [FQNS.PRESCRIBED_MEDICATION_FQN]: '',
  [FQNS.PREV_PSYCH_ADMISSION_FQN]: '',
  [FQNS.RACE_FQN]: '',
  [FQNS.PERSON_RACE_FQN]: '',
  [FQNS.SCALE_1_TO_10_FQN]: 1,
  [FQNS.SELF_DIAGNOSIS_FQN]: [],
  [FQNS.SELF_DIAGNOSIS_OTHER_FQN]: '',
  [FQNS.SUICIDAL_FQN]: false,
  [FQNS.SUICIDAL_ACTIONS_FQN]: [],
  [FQNS.SUICIDE_ATTEMPT_METHOD_FQN]: [],
  [FQNS.SUICIDE_ATTEMPT_METHOD_OTHER_FQN]: '',
  [FQNS.TAKING_MEDICATION_FQN]: '',
});

function getConsumerInfoInitialState(person :?Object) {

  const info = CONSUMER_INFO_INITIAL_STATE.toJS();
  if (person && isNonEmptyObject(person)) {

    const id = person[FQNS.PERSON_ID_FQN];
    if (Array.isArray(id) && id.length > 0) {
      info[FQNS.PERSON_ID_FQN] = id[0];
    }

    const firstName = person[FQNS.PERSON_FIRST_NAME_FQN];
    if (Array.isArray(firstName) && firstName.length > 0) {
      info[FQNS.PERSON_FIRST_NAME_FQN] = firstName[0];
    }

    const lastName = person[FQNS.PERSON_LAST_NAME_FQN];
    if (Array.isArray(lastName) && lastName.length > 0) {
      info[FQNS.PERSON_LAST_NAME_FQN] = lastName[0];
    }

    const middleName = person[FQNS.PERSON_MIDDLE_NAME_FQN];
    if (Array.isArray(middleName) && middleName.length > 0) {
      info[FQNS.PERSON_MIDDLE_NAME_FQN] = middleName[0];
    }

    const race = person[FQNS.PERSON_RACE_FQN];
    if (Array.isArray(race) && race.length > 0) {
      info[FQNS.PERSON_RACE_FQN] = race[0];
    }

    const sex = person[FQNS.PERSON_SEX_FQN];
    if (Array.isArray(sex) && sex.length > 0) {
      info[FQNS.PERSON_SEX_FQN] = sex[0];
    }

    const picture = person[FQNS.PERSON_PICTURE_FQN];
    if (Array.isArray(picture) && picture.length > 0) {
      info[FQNS.PERSON_PICTURE_FQN] = picture[0];
    }

    const dob = person[FQNS.PERSON_DOB_FQN];
    if (Array.isArray(dob) && dob.length > 0) {
      info[FQNS.PERSON_DOB_FQN] = dob[0];
      if (moment(dob[0]).isValid()) {
        info[FQNS.AGE_FQN] = `${moment().diff(moment(dob[0]), 'years')}`;
      }
    }
  }
  else {
    info[FQNS.PERSON_ID_FQN] = randomUUID();
  }
  return info;
}

/*
 * Disposition Information Section
 */

const DISPOSITION_INFO_INITIAL_STATE :Map<string, *> = fromJS({
  [FQNS.DEESCALATION_SCALE_FQN]: 1,
  [FQNS.DEESCALATION_TECHNIQUES_FQN]: [],
  [FQNS.DEESCALATION_TECHNIQUES_OTHER_FQN]: '',
  [FQNS.DISPOSITION_FQN]: [],
  [FQNS.HOSPITAL_TRANSPORT_INDICATOR_FQN]: false,
  [FQNS.HOSPITAL_FQN]: '',
  [FQNS.HOSPITAL_NAME_FQN]: '',
  [FQNS.INCIDENT_NARRATIVE_FQN]: '',
  [FQNS.REFERRAL_DEST_FQN]: '',
  [FQNS.REFERRAL_PROVIDER_INDICATOR_FQN]: false,
  [FQNS.SPECIAL_RESOURCES_CALLED_FQN]: [],
  [FQNS.STABILIZED_INDICATOR_FQN]: false,
  [FQNS.TRANSPORTING_AGENCY_FQN]: '',
  [FQNS.VOLUNTARY_ACTION_INDICATOR_FQN]: null,
});

function getDispositionInfoInitialState() {
  return DISPOSITION_INFO_INITIAL_STATE.toJS();
}

/*
 * Officer Information Section
 */

const OFFICER_INFO_INITIAL_STATE :Map<string, *> = fromJS({
  [FQNS.OFFICER_CERTIFICATION_FQN]: [],
  [FQNS.OFFICER_INJURIES_FQN]: '',
  [FQNS.OFFICER_NAME_FQN]: '',
  [FQNS.OFFICER_SEQ_ID_FQN]: '',
});

function getOfficerInfoInitialState() {
  return OFFICER_INFO_INITIAL_STATE.toJS();
}

/*
 * Report Information Section
 */

const REPORT_INFO_INITIAL_STATE :Map<string, *> = fromJS({
  [FQNS.CAD_NUMBER_FQN]: '',
  [FQNS.COMPANION_OFFENSE_REPORT_FQN]: false,
  [FQNS.COMPLAINT_NUMBER_FQN]: '',
  [FQNS.DATE_TIME_OCCURRED_FQN]: '',
  [FQNS.DATE_TIME_REPORTED_FQN]: '',
  [FQNS.DISPATCH_REASON_FQN]: '',
  [FQNS.INCIDENT_FQN]: '',
  [FQNS.LOCATION_OF_INCIDENT_FQN]: '',
  [FQNS.OL_ID_FQN]: '',
  [FQNS.ON_VIEW_FQN]: false,
  [FQNS.POST_OF_OCCURRENCE_FQN]: '',
  [FQNS.UNIT_FQN]: ''
});

function getReportInfoInitialState() {
  return REPORT_INFO_INITIAL_STATE.toJS();
}

export {
  getComplainantInfoInitialState,
  getConsumerInfoInitialState,
  getDispositionInfoInitialState,
  getOfficerInfoInitialState,
  getReportInfoInitialState
};
