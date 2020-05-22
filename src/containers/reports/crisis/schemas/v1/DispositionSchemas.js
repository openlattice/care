import { DataProcessingUtils } from 'lattice-fabricate';

import {
  ARRESTABLE_OFFENSES,
  COURTESY_TRANSPORTS,
  DISPOSITIONS,
  OFFICER_TRAINING,
  PEOPLE_NOTIFIED,
  VERBAL_REFERRALS,
} from './constants';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { SELECT_ALL_THAT_APPLY, SELECT_ONLY_ONE } from '../constants';

const { BEHAVIORAL_HEALTH_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(5, 1)]: {
      type: 'object',
      title: 'Disposition',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SPECIAL_RESOURCES_CALLED_FQN)]: {
          title: 'Specialists On Scene',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: OFFICER_TRAINING,
          },
          minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.CATEGORY_FQN)]: {
          title: DISPOSITIONS.NOTIFIED_SOMEONE,
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: PEOPLE_NOTIFIED,
          },
          minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.REFERRAL_DEST_FQN)]: {
          title: DISPOSITIONS.VERBAL_REFERRAL,
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: VERBAL_REFERRALS,
          },
          minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
          title: DISPOSITIONS.COURTESY_TRANPORT,
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: COURTESY_TRANSPORTS,
          },
          minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN)]: {
          title: 'Hospital admittance',
          type: 'boolean',
          description: SELECT_ONLY_ONE,
          enumNames: ['Yes', 'No']
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.NARCAN_ADMINISTERED_FQN)]: {
          title: DISPOSITIONS.ADMINISTERED_DRUG,
          type: 'boolean',
          description: SELECT_ONLY_ONE,
          enumNames: ['Yes', 'No']
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARRESTABLE_OFFENSE_FQN)]: {
          title: DISPOSITIONS.ARRESTABLE_OFFENSE,
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: ARRESTABLE_OFFENSES,
          },
          minItems: 1,
          uniqueItems: true
        },
      },
      required: [
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SPECIAL_RESOURCES_CALLED_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.CATEGORY_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.REFERRAL_DEST_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ORGANIZATION_NAME_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.NARCAN_ADMINISTERED_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARRESTABLE_OFFENSE_FQN),
      ]
    },
  },
};

const uiSchema = {
  [getPageSectionKey(5, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SPECIAL_RESOURCES_CALLED_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.CATEGORY_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.REFERRAL_DEST_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.HOSPITAL_TRANSPORT_INDICATOR_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.NARCAN_ADMINISTERED_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARRESTABLE_OFFENSE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
      }
    },
  }
};

export {
  schema,
  uiSchema
};
