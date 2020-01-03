import { DataProcessingUtils } from 'lattice-fabricate';

import { INSURANCE } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Threats, Violence, & Weapons',
  properties: {
    [getPageSectionKey(5, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Brandished weapon(s):',
          items: {
            type: 'string',
            enum: INSURANCE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Violence threatened toward:',
          items: {
            type: 'string',
            enum: INSURANCE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Violence engaged with:',
          items: {
            type: 'string',
            enum: INSURANCE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Injured parties:',
          items: {
            type: 'string',
            enum: INSURANCE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Self-harm:',
          items: {
            type: 'string',
            enum: INSURANCE
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
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
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
