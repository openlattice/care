import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  DRUGS_ALCOHOL,
  SELECT_ALL_THAT_APPLY,
} from '../constants';

const {
  SUBSTANCE_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(2, 1)]: {
      type: 'object',
      title: 'Drugs & Alcohol Involvement',
      properties: {
        [getEntityAddressKey(0, SUBSTANCE_FQN, FQN.TYPE_FQN)]: {
          title: 'Substance use during incident',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: DRUGS_ALCOHOL,
          },
          // minItems: 1,
          uniqueItems: true,
          sharedProperty: {
            property: FQN.TEMPORAL_STATUS_FQN,
            value: 'current'
          }
        },
        [getEntityAddressKey(0, SUBSTANCE_FQN, FQN.TEMPORAL_STATUS_FQN)]: {
          title: 'Temporal Status',
          type: 'string',
          default: 'current',
          skipPopulate: true,
        },
        [getEntityAddressKey(1, SUBSTANCE_FQN, FQN.TYPE_FQN)]: {
          title: 'History of substance abuse or treatment',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: DRUGS_ALCOHOL,
          },
          // minItems: 1,
          uniqueItems: true,
          sharedProperty: {
            property: FQN.TEMPORAL_STATUS_FQN,
            value: 'past'
          }
        },
        [getEntityAddressKey(1, SUBSTANCE_FQN, FQN.TEMPORAL_STATUS_FQN)]: {
          title: 'Temporal Status',
          type: 'string',
          default: 'past',
          skipPopulate: true,
        },
      }
    },
  },
};

const uiSchema = {
  [getPageSectionKey(2, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, SUBSTANCE_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(1, SUBSTANCE_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, SUBSTANCE_FQN, FQN.TEMPORAL_STATUS_FQN)]: {
      'ui:widget': 'hidden'
    },
    [getEntityAddressKey(1, SUBSTANCE_FQN, FQN.TEMPORAL_STATUS_FQN)]: {
      'ui:widget': 'hidden'
    },
  }
};

export {
  schema,
  uiSchema
};
