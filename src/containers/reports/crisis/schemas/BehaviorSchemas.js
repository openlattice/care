import { DataProcessingUtils } from 'lattice-fabricate';

import { BEHAVIORS, NATURE_OF_CRISIS } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Observations',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Nature of Crisis',
          type: 'array',
          items: {
            type: 'string',
            enum: NATURE_OF_CRISIS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Behavior',
          type: 'array',
          items: {
            type: 'string',
            enum: BEHAVIORS,
          },
          // minItems: 1,
          uniqueItems: true
        },
      },
      // required: [
      //   getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN),
      //   getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN),
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
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
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
