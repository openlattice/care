import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';

const {
  INCIDENT_FQN,
  LOCATION_FQN
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(2, 1)]: {
      type: 'object',
      title: 'Incident',
      properties: {
        [getEntityAddressKey(0, INCIDENT_FQN, FQN.DATETIME_START_FQN)]: {
          title: 'Date & Time',
          type: 'string',
          format: 'date-time',
        },
        [getEntityAddressKey(0, INCIDENT_FQN, FQN.CRIMINALJUSTICE_CASE_NUMBER_FQN)]: {
          title: 'Incident #',
          type: 'string',
        },
        // [getEntityAddressKey(0, LOCATION_FQN, FQN.LOCATION_ADDRESS_FQN)]: {
        //   title: 'Location',
        //   type: 'string',
        // },
        [getEntityAddressKey(0, INCIDENT_FQN, FQN.DESCRIPTION_FQN)]: {
          title: 'Summary',
          type: 'string',
        },
        // [getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, FQN.HOW_REPORTED_FQN)]: {
        //   title: 'Dispatch',
        //   type: 'string',
        //   enum: ['Call dispatched', 'Self-initiated']
        // },
      },
      required: [
        getEntityAddressKey(0, INCIDENT_FQN, FQN.DATETIME_START_FQN),
      ]
    }
  },
};

const uiSchema = {
  [getPageSectionKey(2, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, INCIDENT_FQN, FQN.DATETIME_START_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, INCIDENT_FQN, FQN.CRIMINALJUSTICE_CASE_NUMBER_FQN)]: {
      classNames: 'column-span-12',
    },
    // [getEntityAddressKey(0, LOCATION_FQN, FQN.LOCATION_ADDRESS_FQN)]: {
    //   classNames: 'column-span-12',
    // },
    [getEntityAddressKey(0, INCIDENT_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    // [getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, FQN.HOW_REPORTED_FQN)]: {
    //   classNames: 'column-span-12',
    // },
  }
};

export {
  schema,
  uiSchema
};
