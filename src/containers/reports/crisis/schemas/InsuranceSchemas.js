import { DataProcessingUtils } from 'lattice-fabricate';

import { INSURANCE } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Insurance',
  properties: {
    [getPageSectionKey(6, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Primary Insurance',
          items: {
            type: 'string',
            enum: INSURANCE
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Secondary Insurance',
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
  [getPageSectionKey(6, 1)]: {
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
  }
};

export {
  schema,
  uiSchema,
};
