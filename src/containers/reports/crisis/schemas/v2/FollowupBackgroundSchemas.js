import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  ASSESSMENT_LOCATION,
  FOLLOW_UP_NATURE,
  FOLLOW_UP_REPORT,
  POINT_OF_INTERVENTION,
  REFERRAL_SOURCE,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE
} from '../constants';

const {
  ENCOUNTER_FQN,
  FOLLOW_UP_REPORT_FQN,
  LOCATION_FQN,
  REFERRAL_REQUEST_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Follow-up',
      properties: {
        [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.TYPE_FQN)]: {
          title: 'Datetime of Follow-up',
          type: 'string',
          default: FOLLOW_UP_REPORT
        },
        [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.COMPLETED_DT_FQN)]: {
          title: 'Datetime of Follow-up',
          type: 'string',
          format: 'date-time',
        },
        // Update property to match prod
        [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.NATURE_OF_CRISIS_FQN)]: {
          title: 'Nature of Follow-up',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: FOLLOW_UP_NATURE,
        },
        [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.SERVICE_TYPE_FQN)]: {
          title: 'Point of Intervention',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: POINT_OF_INTERVENTION,
        },
        [getEntityAddressKey(0, LOCATION_FQN, FQN.TYPE_FQN)]: {
          title: 'Assessment Location',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: ASSESSMENT_LOCATION,
        },
        [getEntityAddressKey(0, REFERRAL_REQUEST_FQN, FQN.SOURCE_FQN)]: {
          title: 'Referral Request',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: REFERRAL_SOURCE,
          },
          // minItems: 1,
          uniqueItems: true,
        },
        [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.CHECKED_IN_FQN)]: {
          title: 'Unable to Contact',
          type: 'boolean',
        },
        [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.DESCRIPTION_FQN)]: {
          title: 'Attempt Description',
          type: 'string',
        },
      },
      required: [
        getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.COMPLETED_DT_FQN),
        getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.NATURE_OF_CRISIS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    },
    [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.COMPLETED_DT_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, FOLLOW_UP_REPORT_FQN, FQN.NATURE_OF_CRISIS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.SERVICE_TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, LOCATION_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, REFERRAL_REQUEST_FQN, FQN.SOURCE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.CHECKED_IN_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea',
    },
  }
};

export {
  schema,
  uiSchema
};
