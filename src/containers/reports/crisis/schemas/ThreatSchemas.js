import { DataProcessingUtils } from 'lattice-fabricate';

import {
  SELECT_ALL_THAT_APPLY,
  SELF_INJURY,
  VIOLENCE_TARGET,
  WEAPON_TYPE
} from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  INJURY_FQN,
  SELF_HARM_FQN,
  VIOLENT_BEHAVIOR_FQN,
  WEAPON_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Threats, Violence, & Weapons',
  properties: {
    [getPageSectionKey(5, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, WEAPON_FQN, FQN.TYPE_FQN)]: {
          type: 'array',
          title: 'Brandished weapon(s):',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: WEAPON_TYPE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, VIOLENT_BEHAVIOR_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
          type: 'array',
          title: 'Violence threatened toward or engaged with',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: VIOLENCE_TARGET
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, INJURY_FQN, FQN.PERSON_INJURED_FQN)]: {
          type: 'array',
          title: 'Injured parties:',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: VIOLENCE_TARGET
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, SELF_HARM_FQN, FQN.ACTION_FQN)]: {
          type: 'array',
          title: 'Self-harm:',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: SELF_INJURY
          },
          // minItems: 1,
          uniqueItems: true
        },
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(5, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, WEAPON_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, VIOLENT_BEHAVIOR_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, INJURY_FQN, FQN.PERSON_INJURED_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, SELF_HARM_FQN, FQN.ACTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
  }
};

export {
  schema,
  uiSchema,
};
