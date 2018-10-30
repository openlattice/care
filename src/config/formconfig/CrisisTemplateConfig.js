import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  SUBJECT_INFORMATION,
  OBSERVED_BEHAVIORS,
  CRISIS_NATURE,
  OFFICER_SAFETY,
  DISPOSITION,
  POST_PROCESS_FIELDS
} from '../../utils/constants/CrisisTemplateConstants';

/*
export const SUBJECT_INFORMATION = {
  SSN_LAST_4: 'last4SSN'
};

export const OBSERVED_BEHAVIORS = {
  CHRONIC: 'chronicComplaint'
};

export const CRISIS_NATURE = {
  NATURE_OF_CRISIS: 'natureOfCrisis',
  ASSISTANCE: 'assistance',
  OTHER_ASSISTANCE: 'otherAssistance',
  HOUSING: 'currentHousing'
};

export const OFFICER_SAFETY = {
  THREATENED_VIOLENCE: 'threatenedViolence',
  THREATENED_PERSON_NAME: 'threatenedPersonName',
  THREATENED_PERSON_RELATIONSHIP: 'threatenedPersonRelationship',
  HAD_INJURIES: 'hadInjuries',
  INJURY_DESCRIPTION: 'injuryDescription',
  INJURY_TYPE: 'injuryType',
  OTHER_INJURY_TYPE: 'otherInjuryType'
};

export const DISPOSITION = {
  PEOPLE_NOTIFIED: 'peopleNotified',
  OTHER_PEOPLE_NOTIFIED: 'otherPeopleNotified',
  VERBAL_REFERRALS: 'verbalReferrals',
  OTHER_VERBAL_REFERRAL: 'otherVerbalReferral',
  COURTESY_TRANSPORTS: 'courtesyTransports',
  ARRESTABLE_OFFENSES: 'arrestableOffenses',
  NO_ACTION_VALUES: 'noActionPossibleValues'
};
*/

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  PEOPLE_FQN
} = APP_TYPES_FQNS;

const config = {
  entitySets: [
    {
      name: PEOPLE_FQN,
      alias: 'person',
      fields: {
        // TODO filter based on whether or not new person
        [SUBJECT_INFORMATION.PERSON_ID]: FQN.PERSON_ID_FQN,
        [SUBJECT_INFORMATION.LAST]: FQN.PERSON_LAST_NAME_FQN,
        [SUBJECT_INFORMATION.FIRST]: FQN.PERSON_FIRST_NAME_FQN,
        [SUBJECT_INFORMATION.MIDDLE]: FQN.PERSON_MIDDLE_NAME_FQN,
        [SUBJECT_INFORMATION.DOB]: FQN.PERSON_DOB_FQN, // TODO format
        [SUBJECT_INFORMATION.GENDER]: FQN.PERSON_SEX_FQN,
        [SUBJECT_INFORMATION.RACE]: FQN.PERSON_RACE_FQN
      }
    },
    {
      name: BEHAVIORAL_HEALTH_REPORT_FQN,
      alias: 'report',
      fields: {
        [SUBJECT_INFORMATION.PERSON_ID]: FQN.PERSON_ID_FQN,
        [POST_PROCESS_FIELDS.DOB]: FQN.DOB_FQN, // TODO format
        [POST_PROCESS_FIELDS.GENDER]: FQN.GENDER_FQN,
        [POST_PROCESS_FIELDS.RACE]: FQN.RACE_FQN,
        [SUBJECT_INFORMATION.AGE]: FQN.AGE_FQN,

        [OBSERVED_BEHAVIORS.VETERAN]: FQN.MILITARY_STATUS_FQN, // TODO format to value instead of boolean
        [OBSERVED_BEHAVIORS.BEHAVIORS]: FQN.OBSERVED_BEHAVIORS_FQN,
        [OBSERVED_BEHAVIORS.OTHER_BEHAVIOR]: FQN.OBSERVED_BEHAVIORS_OTHER_FQN,
        [OBSERVED_BEHAVIORS.DEMEANORS]: FQN.EMOTIONAL_STATE_FQN,

        [POST_PROCESS_FIELDS.HOMELESS]: FQN.HOMELESS_FQN, // TODO process from current housing

        [OFFICER_SAFETY.TECHNIQUES]: FQN.DEESCALATION_TECHNIQUES_FQN,
        [OFFICER_SAFETY.HAD_WEAPON]: FQN.ARMED_WITH_WEAPON_FQN,
        [OFFICER_SAFETY.WEAPONS]: FQN.ARMED_WEAPON_TYPE_FQN, // TODO combine with other weapon field,

        [DISPOSITION.SPECIALISTS]: FQN.SPECIAL_RESOURCES_CALLED_FQN,
        [DISPOSITION.DISPOSITIONS]: FQN.DISPOSITION_FQN,
        [DISPOSITION.REPORT_NUMBER]: FQN.COMPANION_OFFENSE_REPORT_FQN,
        [DISPOSITION.INCIDENT_DESCRIPTION]: FQN.INCIDENT_NARRATIVE_FQN,
        [DISPOSITION.HOSPITALS]: FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN, // TODO verify, fix maybe
        [DISPOSITION.WAS_VOLUNTARY_TRANSPORT]: FQN.VOLUNTARY_ACTION_INDICATOR_FQN,
      }
    },
    {
      name: APPEARS_IN_FQN,
      alias: 'appearsin',
      entityId: POST_PROCESS_FIELDS.TIMESTAMP, // TODO
      fields: {
        [POST_PROCESS_FIELDS.TIMESTAMP]: FQN.DATE_TIME_FQN
      }
    }
  ],
  associations: [
    {
      src: 'person',
      dst: 'report',
      association: 'appearsin'
    }
  ]
};

export default config;
