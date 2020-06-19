import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  ASSISTANCE_ON_SCENE,
} from '../constants';

const { GENERAL_PERSON_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(9, 1)]: {
      type: 'object',
      title: 'Assistance On Scene',
      properties: {
        [getEntityAddressKey(0, GENERAL_PERSON_FQN, FQN.CATEGORY_FQN)]: {
          type: 'array',
          title: 'Assistance on scene',
          items: {
            type: 'string',
            enum: ASSISTANCE_ON_SCENE
          },
          // minItems: 1,
          uniqueItems: true
        },
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(9, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, GENERAL_PERSON_FQN, FQN.CATEGORY_FQN)]: {
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
  uiSchema,
};
