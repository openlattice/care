import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  DESCRIPTION_FQN,
  CATEGORY_FQN
} from '../../../../../edm/DataModelFqns';

import { SAFETY_TYPES } from './constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OFFICER_SAFETY_CONCERNS_FQN } = APP_TYPES_FQNS;

const schema = {
  definitions: {
    officerSafetyCaution: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, CATEGORY_FQN)]: {
          type: 'string',
          title: 'Safety type',
          enum: SAFETY_TYPES
        },
        [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Description',
        }
      }
    }
  },
  type: 'object',
  title: 'Officer Safety',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'array',
      title: 'Officer Safety Concerns',
      items: {
        $ref: '#/definitions/officerSafetyCaution'
      },
      default: [
        {
          [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, CATEGORY_FQN)]: undefined,
          [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, DESCRIPTION_FQN)]: undefined,
        }
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add Officer Safety Concern',
      addActionKey: 'addOfficerSafetyConcerns',
      orderable: false
    },
    items: {
      classNames: 'grid-container',
      'ui:options': {
        editable: true
      },
      [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, CATEGORY_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio'
      },
      [getEntityAddressKey(-1, OFFICER_SAFETY_CONCERNS_FQN, DESCRIPTION_FQN)]: {
        classNames: 'column-span-12'
      },
    }
  }
};

export { schema, uiSchema };
