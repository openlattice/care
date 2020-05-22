import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { BEHAVIORS, CRISIS_REPORT, SELECT_ALL_THAT_APPLY } from '../constants';

const { BEHAVIOR_FQN, CRISIS_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: 'Observations',
      properties: {
        [getEntityAddressKey(0, BEHAVIOR_FQN, FQN.OBSERVED_BEHAVIOR_FQN)]: {
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
        [getEntityAddressKey(0, CRISIS_REPORT_FQN, FQN.TYPE_FQN)]: {
          title: 'Report Type',
          type: 'string',
          default: CRISIS_REPORT,
        },
      },
      required: [
        getEntityAddressKey(0, BEHAVIOR_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
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
    [getEntityAddressKey(0, BEHAVIOR_FQN, FQN.OBSERVED_BEHAVIOR_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, CRISIS_REPORT_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    }
  }
};

export {
  schema,
  uiSchema
};
