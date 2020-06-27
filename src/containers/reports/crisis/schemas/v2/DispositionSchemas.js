import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  DISCRETIONARY_ARREST,
  DISPOSITION,
  PRIOR_ARREST_HISTORY,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
  TECHNIQUES,
  YES_NO,
} from '../constants';

const {
  DISPOSITION_FQN,
  INTERACTION_STRATEGY_FQN,
  OFFENSE_FQN,
  CHARGE_EVENT_FQN,
  CHARGE_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(8, 1)]: {
      type: 'object',
      title: 'Disposition',
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
        [getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN)]: {
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
        [getEntityAddressKey(0, OFFENSE_FQN, FQN.NOTES_FQN)]: {
          type: 'string',
          title: 'Prior arrests',
          description: SELECT_ONLY_ONE,
          enum: PRIOR_ARREST_HISTORY
        },
        [getEntityAddressKey(0, OFFENSE_FQN, FQN.DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Meets criteria for discretionary arrest?',
          description: SELECT_ONLY_ONE,
          enum: DISCRETIONARY_ARREST,
          enumNames: YES_NO,
        },
      },
      required: [
        getEntityAddressKey(0, INTERACTION_STRATEGY_FQN, FQN.TECHNIQUES_FQN),
        getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN),
        getEntityAddressKey(0, OFFENSE_FQN, FQN.NOTES_FQN),
        getEntityAddressKey(0, OFFENSE_FQN, FQN.DESCRIPTION_FQN),
      ]
    },
    [getPageSectionKey(8, 2)]: {
      type: 'array',
      title: 'Charges',
      items: {
        type: 'object',
        properties: {
          [getEntityAddressKey(-1, CHARGE_FQN, FQN.NAME_FQN)]: {
            type: 'string',
            title: 'Charge',
          },
          [getEntityAddressKey(-1, CHARGE_EVENT_FQN, FQN.DIVERSION_STATUS_FQN)]: {
            type: 'string',
            title: 'Was charge diverted?',
            description: SELECT_ONLY_ONE,
            enum: YES_NO,
          }
        },
        required: [
          getEntityAddressKey(-1, CHARGE_FQN, FQN.NAME_FQN),
          getEntityAddressKey(-1, CHARGE_EVENT_FQN, FQN.DIVERSION_STATUS_FQN),
        ]
      },
      default: [{}],
    },
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
    [getEntityAddressKey(0, DISPOSITION_FQN, FQN.CJ_DISPOSITION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, OFFENSE_FQN, FQN.NOTES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, OFFENSE_FQN, FQN.DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
  },
  [getPageSectionKey(8, 2)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addActionKey: 'addOptional',
      addButtonText: '+ Charge',
      orderable: false,
    },
    items: {
      classNames: 'grid-container',
      'ui:options': {
        editable: true
      },
      [getEntityAddressKey(-1, CHARGE_FQN, FQN.NAME_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-1, CHARGE_EVENT_FQN, FQN.DIVERSION_STATUS_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio',
        'ui:options': {
          mode: 'button',
          row: true,
        }
      },
    }
  },
};

export {
  schema,
  uiSchema,
};
