import { DataProcessingUtils } from 'lattice-fabricate';

import {
  EMPLOYMENT,
  HOUSING,
  KNOWN_CLIENT,
  RESIDES_WITH
} from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Housing & Employment',
  properties: {
    [getPageSectionKey(5, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Current Housing Situation',
          type: 'array',
          items: {
            type: 'string',
            enum: HOUSING,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Resides With',
          type: 'array',
          items: {
            type: 'string',
            enum: RESIDES_WITH,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Employment',
          type: 'array',
          items: {
            type: 'string',
            enum: EMPLOYMENT,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Client of State Service',
          type: 'array',
          items: {
            type: 'string',
            enum: KNOWN_CLIENT,
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
  }
};

export {
  schema,
  uiSchema,
};
