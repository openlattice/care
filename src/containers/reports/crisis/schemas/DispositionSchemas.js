import { DataProcessingUtils } from 'lattice-fabricate';

import {
  BILLED_SERVICES,
  DISPOSITION,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
  TECHNIQUES,
  YES_NO_NA,
  YES_NO_UNKNOWN
} from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  // DISPOSITION_FQN,
  PEOPLE_FQN,
  INTERACTION_STRATEGY_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'Disposition',
  properties: {
    [getPageSectionKey(8, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, INTERACTION_STRATEGY_FQN, FQN.TECHNIQUES_FQN)]: {
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
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
          description: SELECT_ALL_THAT_APPLY,
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
          description: SELECT_ONLY_ONE,
          enum: YES_NO_UNKNOWN
        },
        [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Was jail diversion an option?',
          description: SELECT_ONLY_ONE,
          enum: YES_NO_NA
        },
        [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
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
          description: SELECT_ONLY_ONE,
          enum: YES_NO_NA
        },
        [getEntityAddressKey(6, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
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
  [getPageSectionKey(8, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, INTERACTION_STRATEGY_FQN, FQN.TECHNIQUES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(3, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(4, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(5, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(6, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
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
  uiSchema,
};
