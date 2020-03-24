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
    [getPageSectionKey(4, 1)]: {
      type: 'object',
      title: 'Officer Safety',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEESCALATION_TECHNIQUES_FQN)]: {
          title: 'Techniques',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: NATURE_OF_CRISIS,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARMED_WEAPON_TYPE_FQN)]: {
          title: 'Weapon',
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: ASSISTANCES,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
          title: 'Violence Threatened',
          type: 'string',
          description: SELECT_ONLY_ONE,
          enum: HOUSING_SITUATIONS
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_INJURED_FQN)]: {
          title: 'Injuries',
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
  [getPageSectionKey(4, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DEESCALATION_TECHNIQUES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.ARMED_WEAPON_TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DIRECTED_AGAINST_RELATION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withNone: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.PERSON_INJURED_FQN)]: {
      title: 'Injuries',
      type: 'string',
      description: SELECT_ONLY_ONE,
      enum: HOUSING_SITUATIONS
    },
  }
};

export {
  schema,
  uiSchema
};
