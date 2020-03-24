import { DataProcessingUtils } from 'lattice-fabricate';

import {
  BEHAVIORS,
  DEMEANORS,
  SUICIDE_ACTION_TYPE,
  SUICIDE_BEHAVIORS,
  SUICIDE_METHODS,
} from './constants';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { SELECT_ALL_THAT_APPLY } from '../constants';

const { BEHAVIORAL_HEALTH_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(2, 1)]: {
      type: 'object',
      title: 'Observations',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN)]: {
          title: 'Behaviors',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: BEHAVIORS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEMEANORS_FQN)]: {
          title: 'Demeanors',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: DEMEANORS,
          },
          // minItems: 1,
          uniqueItems: true
        },
      },
      // required: [
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DESCRIPTION_FQN),
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
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
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIORS_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
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
