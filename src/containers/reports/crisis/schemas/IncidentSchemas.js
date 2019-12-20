import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Incident',
  properties: {
    [getPageSectionKey(2, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Date & Time',
          type: 'string',
          format: 'date-time'
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Incident #',
          type: 'string',
        },
        [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Location',
          type: 'string',
        },
        [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Summary',
          type: 'string',
        },
        [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Dispatch',
          type: 'string',
          enum: ['Call dispatched', 'Self-initiated']
        },
      },
      // required: [
      //   getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN),
      // ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(2, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-6',
    },
    [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-6',
    },
    [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
    },
  }
};

export {
  schema,
  uiSchema
};
