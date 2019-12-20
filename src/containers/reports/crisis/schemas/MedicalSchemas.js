import { DataProcessingUtils } from 'lattice-fabricate';

import { DRUGS_ALCOHOL, YES_NO_UNKNOWN } from './constants';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  definitions: {
    diagnosis: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Diagnosis'
        }
      }
    },
    medication: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
          type: 'string',
          title: 'Medication',
        },
        [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Condition',
        },
        [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_MIDDLE_NAME_FQN)]: {
          type: 'string',
          title: 'Compliance',
          enum: YES_NO_UNKNOWN
        }
      }
    }
  },
  type: 'object',
  title: 'Medical',
  properties: {
    [getPageSectionKey(4, 1)]: {
      type: 'array',
      title: 'Diagnoses',
      items: {
        $ref: '#/definitions/diagnosis'
      },
      default: [{}],
    },
    [getPageSectionKey(4, 2)]: {
      type: 'array',
      title: 'Prescribed Medication',
      items: {
        $ref: '#/definitions/medication'
      },
      default: [{}],
    },
    [getPageSectionKey(4, 3)]: {
      type: 'object',
      title: 'Drugs & Alcohol Involvement',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'Substance use during incident',
          type: 'array',
          items: {
            type: 'string',
            enum: DRUGS_ALCOHOL,
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          title: 'History of substance abuse or treatment',
          type: 'array',
          items: {
            type: 'string',
            enum: DRUGS_ALCOHOL,
          },
          // minItems: 1,
          uniqueItems: true
        },
      }
    },
  },
};

const uiSchema = {
  [getPageSectionKey(4, 1)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Diagnosis',
      orderable: false,
    },
    items: {
      classNames: 'grid-container',
      'ui:options': {
        editable: true
      },
      [getEntityAddressKey(-1, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
        classNames: 'column-span-12',
      }
    },
  },
  [getPageSectionKey(4, 2)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Medication',
      orderable: false,
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-2, PEOPLE_FQN, FQN.PERSON_MIDDLE_NAME_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'radio',

      },
    }
  },
  [getPageSectionKey(4, 3)]: {
    classNames: 'column-span-12 grid-container',
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
