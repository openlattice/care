import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import {
  CONTEXT_FQN,
  DESCRIPTION_FQN,
  TITLE_FQN,

} from '../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  INTERACTION_STRATEGY_FQN,
  RESPONSE_PLAN_FQN,
} = APP_TYPES_FQNS;

export const schema = {
  definitions: {
    taskItems: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]: {
          type: 'string',
          title: 'Title',
        },
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Description',
        }
      },
      required: [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]
    }
  },
  type: 'object',
  title: 'Background & Response Plan',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Background Information',
      properties: {
        [getEntityAddressKey(1, RESPONSE_PLAN_FQN, CONTEXT_FQN)]: {
          type: 'string',
          title: 'Summary'
        }
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'array',
      title: 'Response Plan',
      items: {
        $ref: '#/definitions/taskItems'
      },
      default: [{
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]: undefined,
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, DESCRIPTION_FQN)]: undefined,
      }]
    }
  }
};

export const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12',
    [getEntityAddressKey(1, RESPONSE_PLAN_FQN, CONTEXT_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    }
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add Strategy'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, DESCRIPTION_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'textarea'
      }
    }
  }
};
