import { DataProcessingUtils } from 'lattice-fabricate';

import { BEHAVIORS, NATURE_OF_CRISIS, SELECT_ALL_THAT_APPLY } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { BEHAVIOR_FQN, NATURE_OF_CRISIS_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: 'Observations',
      properties: {
        [getEntityAddressKey(0, NATURE_OF_CRISIS_FQN, FQN.DESCRIPTION_FQN)]: {
          title: 'Nature of Crisis',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: NATURE_OF_CRISIS,
          },
          // minItems: 1,
          uniqueItems: true
        },
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
      },
      // required: [
      //   getEntityAddressKey(0, NATURE_OF_CRISIS_FQN, FQN.DESCRIPTION_FQN),
      //   getEntityAddressKey(0, BEHAVIOR_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
      // ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(3, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, NATURE_OF_CRISIS_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
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
  }
};

export {
  schema,
  uiSchema
};
