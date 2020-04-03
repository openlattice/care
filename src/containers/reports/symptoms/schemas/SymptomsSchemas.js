import { DataProcessingUtils } from 'lattice-fabricate';

import { ADDITIONAL_NOTES_PLACEHOLDER, SYMPTOMS } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { SELECT_ALL_THAT_APPLY } from '../../shared/constants';

const { SYMPTOM_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Symptoms Report',
      properties: {
        [getEntityAddressKey(0, SYMPTOM_FQN, FQN.NAME_FQN)]: {
          title: 'Select Symptoms',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: SYMPTOMS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, SYMPTOM_FQN, FQN.DESCRIPTION_FQN)]: {
          title: 'Additional Notes',
          type: 'string',
        },
      },
      required: [
        getEntityAddressKey(0, SYMPTOM_FQN, FQN.NAME_FQN),
      ],
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, SYMPTOM_FQN, FQN.NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
      },
    },
    [getEntityAddressKey(0, SYMPTOM_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea',
      'ui:options': {
        placeholder: ADDITIONAL_NOTES_PLACEHOLDER
      }
    },
  },
};

export {
  schema,
  uiSchema
};
