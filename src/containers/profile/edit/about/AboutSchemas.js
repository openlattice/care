import { DataProcessingUtils } from 'lattice-fabricate';

import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import {
  GENERAL_NOTES_FQN,
  OL_ID_FQN,
} from '../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { RESPONSE_PLAN_FQN, STAFF_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, STAFF_FQN, OL_ID_FQN)]: {
          type: 'string',
          title: 'Responsible Officer',
          enum: []
        },
        [getEntityAddressKey(0, RESPONSE_PLAN_FQN, GENERAL_NOTES_FQN)]: {
          type: 'string',
          title: 'Internal Team Notes'
        }
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, STAFF_FQN, OL_ID_FQN)]: {
      classNames: 'column-span-6'
    },
    [getEntityAddressKey(0, RESPONSE_PLAN_FQN, GENERAL_NOTES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
  },
};

export {
  schema,
  uiSchema
};
