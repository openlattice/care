import { DataProcessingUtils } from 'lattice-fabricate';

import {
  BEHAVIORS,
  DEMEANORS,
  SUICIDE_ACTION_TYPE,
} from './constants';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { SELECT_ALL_THAT_APPLY, SELECT_ONLY_ONE } from '../constants';

const { BEHAVIORAL_HEALTH_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(2, 1)]: {
      type: 'object',
      title: 'Observations',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.MILITARY_STATUS_FQN)]: {
          title: 'Served in military?',
          type: 'boolean',
          default: false
        },
        // [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.AFFILIATION_FQN)]: {
        //   title: 'Affiliated with University of Iowa?',
        //   type: 'boolean',
        //   default: false
        // },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN)]: {
          title: 'Behaviors',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: BEHAVIORS,
          },
          minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SUICIDAL_ACTIONS_FQN)]: {
          title: 'Suicide threat or attempt?',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: SUICIDE_ACTION_TYPE,
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEMEANORS_FQN)]: {
          title: 'Demeanors',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: DEMEANORS,
          },
          minItems: 1,
          uniqueItems: true
        },
      },
      required: [
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SUICIDAL_ACTIONS_FQN),
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEMEANORS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(2, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    'ui:order': [
      getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.MILITARY_STATUS_FQN),
      '*',
      getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN),
      getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SUICIDAL_ACTIONS_FQN),
      getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEMEANORS_FQN),
    ],
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.MILITARY_STATUS_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.AFFILIATION_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.SUICIDAL_ACTIONS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEMEANORS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
  }
};

export {
  schema,
  uiSchema
};
