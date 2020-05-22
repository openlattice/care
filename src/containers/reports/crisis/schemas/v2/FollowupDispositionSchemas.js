import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  FOLLOW_UP_DISPOSITON,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
  YES_NO_UNKNOWN,
} from '../constants';

const {
  DISPOSITION_FQN,
  OFFENSE_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: 'Disposition',
      properties: {
        [getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN)]: {
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          title: 'Disposition',
          items: {
            type: 'string',
            enum: FOLLOW_UP_DISPOSITON
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, DISPOSITION_FQN, FQN.STATUS_FQN)]: {
          type: 'string',
          title: 'Was custody diverted?',
          description: SELECT_ONLY_ONE,
          enum: YES_NO_UNKNOWN
        },
        [getEntityAddressKey(0, OFFENSE_FQN, FQN.DIVERSION_STATUS_FQN)]: {
          type: 'string',
          title: 'Was charge diverted?',
          description: SELECT_ONLY_ONE,
          enum: YES_NO_UNKNOWN
        },
      },
      required: [
        getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN),
        getEntityAddressKey(0, DISPOSITION_FQN, FQN.STATUS_FQN),
        getEntityAddressKey(0, OFFENSE_FQN, FQN.DIVERSION_STATUS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(3, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, DISPOSITION_FQN, FQN.STATUS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, OFFENSE_FQN, FQN.DIVERSION_STATUS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
  }
};

export {
  schema,
  uiSchema,
};
