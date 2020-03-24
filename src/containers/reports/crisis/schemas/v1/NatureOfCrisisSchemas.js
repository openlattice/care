import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { ASSISTANCES, HOUSING_SITUATIONS, NATURE_OF_CRISIS } from '../../../../pages/natureofcrisis/Constants';
import { SELECT_ALL_THAT_APPLY, SELECT_ONLY_ONE } from '../constants';

const { BEHAVIORAL_HEALTH_REPORT_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(3, 1)]: {
      type: 'object',
      title: 'Nature Of Crisis',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DISPATCH_REASON_FQN)]: {
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
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_ASSISTING_FQN)]: {
          title: 'Assistance on Scene',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: ASSISTANCES,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.HOUSING_SITUATION_FQN)]: {
          title: 'Housing',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: HOUSING_SITUATIONS
        },
      },
      // required: [
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DESCRIPTION_FQN),
      //   getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OBSERVED_BEHAVIOR_FQN),
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
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DISPATCH_REASON_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_ASSISTING_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.HOUSING_SITUATION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
  }
};

export {
  schema,
  uiSchema
};
