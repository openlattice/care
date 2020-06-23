import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { PHONE_TYPES } from '../../contacts/schemas/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  CONTACT_INFORMATION_FQN,
} = APP_TYPES_FQNS;

export const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.CONTACT_PHONE_NUMBER_FQN)]: {
          type: 'string',
          title: 'Phone Number',
        },
        [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.EXTENTION_FQN)]: {
          type: 'string',
          title: 'Ext.',
        },
        [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.TYPE_FQN)]: {
          type: 'string',
          title: 'Type',
          enum: PHONE_TYPES
        },
      },
      required: [
        getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.CONTACT_PHONE_NUMBER_FQN),
        getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.TYPE_FQN),
      ]
    }
  }
};

export const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.CONTACT_PHONE_NUMBER_FQN)]: {
      classNames: 'column-span-6'
    },
    [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.EXTENTION_FQN)]: {
      classNames: 'column-span-2'
    },
    [getEntityAddressKey(0, CONTACT_INFORMATION_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-4'
    },
  },
};
