import { DataProcessingUtils } from 'lattice-fabricate';

import {
  PERSON_TYPES,
  RELATIONSHIP_TYPES,
  TECHNIQUES,
  WEAPONS
} from './constants';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { SELECT_ALL_THAT_APPLY } from '../constants';

const { BEHAVIORAL_HEALTH_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(4, 1)]: {
      type: 'object',
      title: 'Officer Safety',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEESCALATION_TECHNIQUES_FQN)]: {
          title: 'Techniques',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: TECHNIQUES,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARMED_WEAPON_TYPE_FQN)]: {
          title: 'Weapon',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: WEAPONS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
          title: 'Violence threatened',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: RELATIONSHIP_TYPES,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_INJURED_FQN)]: {
          title: 'Injuries',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: PERSON_TYPES,
          },
          // minItems: 1,
          uniqueItems: true
        },
      },
      // required: [
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DESCRIPTION_FQN),
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
      // ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(4, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEESCALATION_TECHNIQUES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARMED_WEAPON_TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_INJURED_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
  }
};

export {
  schema,
  uiSchema
};
