import { DataProcessingUtils } from 'lattice-fabricate';

import { INSURANCE } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { INSURANCE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Insurance',
  properties: {
    [getPageSectionKey(7, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
          type: 'string',
          title: 'Primary Insurance',
          enum: INSURANCE
        },
        [getEntityAddressKey(0, INSURANCE_FQN, FQN.TYPE_FQN)]: {
          type: 'string',
          title: 'Type',
          default: 'Primary'
        },
        [getEntityAddressKey(1, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
          type: 'string',
          title: 'Secondary Insurance',
          enum: INSURANCE
        },
        [getEntityAddressKey(1, INSURANCE_FQN, FQN.TYPE_FQN)]: {
          type: 'string',
          title: 'Type',
          default: 'Secondary'
        },
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(7, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        withOther: true,
      }
    },
    [getEntityAddressKey(0, INSURANCE_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    },
    [getEntityAddressKey(1, INSURANCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        withOther: true,
      }
    },
    [getEntityAddressKey(1, INSURANCE_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    },
  }
};

export {
  schema,
  uiSchema,
};
