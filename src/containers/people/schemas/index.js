import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import {
  ETHNICITY_VALUES,
  RACE_VALUES,
  SEX_VALUES
} from '../../profile/constants';

const { PEOPLE_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: 'New Person',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Last Name'
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
          type: 'string',
          title: 'First Name'
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_MIDDLE_NAME_FQN)]: {
          type: 'string',
          title: 'Middle Name'
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_NICK_NAME_FQN)]: {
          type: 'array',
          title: 'Aliases',
          items: {
            type: 'string',
            enum: ['']
          },
          uniqueItems: true,
          default: []
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_DOB_FQN)]: {
          type: 'string',
          title: 'Date of Birth',
          format: 'date'
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_SSN_LAST_4_FQN)]: {
          type: 'number',
          title: 'Last 4 SSN',
          minimum: 0,
          maximum: 9999
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_SEX_FQN)]: {
          type: 'string',
          title: 'Sex',
          enum: SEX_VALUES
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_RACE_FQN)]: {
          type: 'string',
          title: 'Race',
          enum: RACE_VALUES
        },
        [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_ETHNICITY_FQN)]: {
          type: 'string',
          title: 'Ethnicity',
          enum: ETHNICITY_VALUES
        },
        // [getEntityAddressKey(0, PERSON_DETAILS_FQN, FQN.VETERAN_STATUS_FQN)]: {
        //   type: 'string',
        //   title: 'Served in the military?',
        //   enum: YES_NO_UNKNOWN
        // },
      },
      required: [
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN),
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN),
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_DOB_FQN),
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_SEX_FQN),
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_RACE_FQN),
        getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_ETHNICITY_FQN),
        // getEntityAddressKey(0, PERSON_DETAILS_FQN, FQN.VETERAN_STATUS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
      classNames: 'column-span-12'
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
      classNames: 'column-span-12'
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_MIDDLE_NAME_FQN)]: {
      classNames: 'column-span-12'
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_NICK_NAME_FQN)]: {
      classNames: 'column-span-12',
      'ui:options': {
        creatable: true,
        multiple: true,
        placeholder: '',
        noOptionsMessage: 'Type to Create'
      }
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_DOB_FQN)]: {
      classNames: 'column-span-12'
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_SSN_LAST_4_FQN)]: {
      classNames: 'column-span-6',
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_SEX_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        inline: false
      }
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_RACE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        inline: false
      }
    },
    [getEntityAddressKey(0, PEOPLE_FQN, FQN.PERSON_ETHNICITY_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        inline: false
      }
    },
    // [getEntityAddressKey(0, PERSON_DETAILS_FQN, FQN.VETERAN_STATUS_FQN)]: {
    //   classNames: 'column-span-12',
    //   'ui:widget': 'radio',
    //   'ui:options': {
    //     inline: false
    //   }
    // },
  }
};

export {
  schema,
  uiSchema
};
