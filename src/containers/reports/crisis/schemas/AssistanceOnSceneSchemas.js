import { DataProcessingUtils } from 'lattice-fabricate';

import {
  BILLED_SERVICES,
  DISPOSITION,
  TECHNIQUES,
  YES_NO_NA,
  YES_NO_UNKNOWN
} from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Assistance On Scene',
  properties: {
    [getPageSectionKey(6, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Techniques Used During Interaction',
          items: {
            type: 'string',
            enum: TECHNIQUES
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Disposition',
          items: {
            type: 'string',
            enum: DISPOSITION
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Was custody diverted?',
          enum: YES_NO_UNKNOWN
        },
        [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Was jail diversion an option?',
          enum: YES_NO_NA
        },
        [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Purpose of JDP intervention if diversion was not an option',
          items: {
            type: 'string',
            enum: DISPOSITION
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(5, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Did JDP intevention prevent ER visit?',
          enum: YES_NO_NA
        },
        [getEntityAddressKey(6, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          title: 'Billed services',
          items: {
            type: 'string',
            enum: BILLED_SERVICES
          },
          // minItems: 1,
          uniqueItems: true
        },
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(6, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
    },
    [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withOther: true,
      }
    },
    [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio'
    },
    [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio'
    },
    [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        withOther: true,
      }
    },
    [getEntityAddressKey(5, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio'
    },
    [getEntityAddressKey(6, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
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
