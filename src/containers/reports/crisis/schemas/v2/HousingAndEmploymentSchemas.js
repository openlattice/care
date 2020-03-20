import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  EMPLOYMENT,
  HOUSING,
  KNOWN_CLIENT,
  RESIDES_WITH,
  SELECT_ALL_THAT_APPLY,
} from '../constants';

const {
  HOUSING_FQN,
  OCCUPATION_FQN,
  INCOME_FQN
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(6, 1)]: {
      type: 'object',
      title: 'Housing & Employment',
      properties: {
        [getEntityAddressKey(0, HOUSING_FQN, FQN.TYPE_FQN)]: {
          title: 'Current Housing Situation',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: HOUSING,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, HOUSING_FQN, FQN.DESCRIPTION_FQN)]: {
          title: 'Resides With',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: RESIDES_WITH,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, OCCUPATION_FQN, FQN.TYPE_FQN)]: {
          title: 'Employment',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: EMPLOYMENT,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, INCOME_FQN, FQN.TYPE_FQN)]: {
          title: 'Client of State Service',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
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
  [getPageSectionKey(6, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, HOUSING_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, HOUSING_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, OCCUPATION_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, INCOME_FQN, FQN.TYPE_FQN)]: {
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
