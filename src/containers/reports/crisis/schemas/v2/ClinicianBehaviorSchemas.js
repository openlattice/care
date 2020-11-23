import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  BEHAVIORS,
  COMPLETED_BY,
  CRISIS_REPORT_CLINICIAN,
  NATURE_OF_CALL,
  NATURE_OF_CRISIS,
  POINT_OF_INTERVENTION,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
} from '../constants';

const {
  BEHAVIOR_CLINICIAN_FQN,
  CALL_FOR_SERVICE_FQN,
  CRISIS_REPORT_CLINICIAN_FQN,
  EMPLOYEE_FQN,
  ENCOUNTER_FQN,
  REFERRAL_SOURCE_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: 'Observations',
      properties: {
        [getEntityAddressKey(0, EMPLOYEE_FQN, FQN.CATEGORY_FQN)]: {
          title: 'Assessment Completed by',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: COMPLETED_BY,
        },
        [getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, FQN.TYPE_FQN)]: {
          title: 'Nature of Call',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: NATURE_OF_CALL,
        },
        [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.SERVICE_TYPE_FQN)]: {
          title: 'Point of Intervention',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: POINT_OF_INTERVENTION,
        },
        // [getEntityAddressKey(0, REFERRAL_SOURCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
        //   title: 'Referral source',
        //   type: 'string',
        //   description: SELECT_ONLY_ONE,
        //   enum: REFERRAL_SOURCES,
        // },
        [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.NATURE_OF_CRISIS_FQN)]: {
          title: 'Presenting Psychiatric Issue',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: NATURE_OF_CRISIS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIOR_CLINICIAN_FQN, FQN.OBSERVED_BEHAVIOR_FQN)]: {
          title: 'Behavior',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: BEHAVIORS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.TYPE_FQN)]: {
          title: 'Report Type',
          type: 'string',
          default: CRISIS_REPORT_CLINICIAN,
        },
      },
      required: [
        getEntityAddressKey(0, EMPLOYEE_FQN, FQN.CATEGORY_FQN),
        getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, FQN.TYPE_FQN),
        getEntityAddressKey(0, ENCOUNTER_FQN, FQN.SERVICE_TYPE_FQN),
        // getEntityAddressKey(0, REFERRAL_SOURCE_FQN, FQN.ORGANIZATION_NAME_FQN),
        getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.NATURE_OF_CRISIS_FQN),
        getEntityAddressKey(0, BEHAVIOR_CLINICIAN_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
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
    [getEntityAddressKey(0, EMPLOYEE_FQN, FQN.CATEGORY_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, CALL_FOR_SERVICE_FQN, FQN.TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_FQN, FQN.SERVICE_TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      },
    },
    [getEntityAddressKey(0, REFERRAL_SOURCE_FQN, FQN.ORGANIZATION_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.NATURE_OF_CRISIS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIOR_CLINICIAN_FQN, FQN.OBSERVED_BEHAVIOR_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    }
  }
};

export {
  schema,
  uiSchema
};
