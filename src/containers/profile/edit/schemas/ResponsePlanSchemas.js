import { DataProcessingUtils } from 'lattice-fabricate';
import { ENTITY_SET_NAMES, PROPERTY_TYPE_FQNS } from './mockFQNs';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  TASK_ESN,
} = ENTITY_SET_NAMES;

const {
  NAME_FQN,
  DESCRIPTION_FQN,
} = PROPERTY_TYPE_FQNS;

export const schema = {
  definitions: {
    taskItems: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, TASK_ESN, NAME_FQN)]: {
          type: 'number',
          title: 'Task Name',
        },
        [getEntityAddressKey(-1, TASK_ESN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Task Description',
        }
      },
      required: [getEntityAddressKey(-1, TASK_ESN, NAME_FQN)]
    }
  },
  type: 'object',
  title: 'Arrays',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'array',
      title: 'Tasks',
      items: {
        $ref: '#/definitions/taskItems'
      },
      default: [{
        [getEntityAddressKey(-1, TASK_ESN, NAME_FQN)]: undefined,
        [getEntityAddressKey(-1, TASK_ESN, DESCRIPTION_FQN)]: undefined,
      }]
    }
  }
};

export const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add Task'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, TASK_ESN, NAME_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-1, TASK_ESN, DESCRIPTION_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'textarea'
      }
    }
  }
};
