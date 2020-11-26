import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  BILLED_SERVICES,
  CLINICIAN_DISPOSITION,
  CLINICIAN_REFERRALS,
  PURPOSE_OF_JDP,
  SELECT_ALL_THAT_APPLY,
  SELECT_ONLY_ONE,
  TECHNIQUES,
  YES_NO_NA,
} from '../constants';

const {
  CRISIS_REPORT_CLINICIAN_FQN,
  DISPOSITION_CLINICIAN_FQN,
  ENCOUNTER_DETAILS_FQN,
  INTERACTION_STRATEGY_FQN,
  INVOICE_FQN,
  REFERRAL_REQUEST_FQN,
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
        [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.CUSTODY_DIVERTED_FQN)]: {
          type: 'string',
          title: 'Was criminal custody diverted?',
          description: SELECT_ONLY_ONE,
          enum: YES_NO_NA
        },
        // change this to disposition
        [getEntityAddressKey(0, DISPOSITION_CLINICIAN_FQN, FQN.CJ_DISPOSITION_FQN)]: {
          type: 'array',
          description: SELECT_ONLY_ONE,
          title: 'Disposition',
          items: {
            type: 'string',
            enum: CLINICIAN_DISPOSITION
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, REFERRAL_REQUEST_FQN, FQN.SERVICE_TYPE_FQN)]: {
          type: 'array',
          title: 'Referred to:',
          description: SELECT_ALL_THAT_APPLY,
          items: {
            type: 'string',
            enum: CLINICIAN_REFERRALS
          },
          uniqueItems: true
        },
        [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LAW_ENFORCEMENT_INVOLVEMENT_FQN)]: {
          type: 'boolean',
          title: 'Was jail diversion an option?',
          description: SELECT_ONLY_ONE,
          enumNames: ['Yes', 'No']
        },
        [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.REASON_FQN)]: {
          type: 'array',
          description: SELECT_ALL_THAT_APPLY,
          title: 'Reason for JDP intervention',
          items: {
            type: 'string',
            enum: PURPOSE_OF_JDP
          },
          // minItems: 1,
          uniqueItems: true
        },
        [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LEVEL_OF_CARE_FQN)]: {
          type: 'string',
          title: 'Did JDP intervention prevent ER visit?',
          description: SELECT_ONLY_ONE,
          enum: YES_NO_NA
        },
        [getEntityAddressKey(0, INVOICE_FQN, FQN.LINE_ITEM_FQN)]: {
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
      },
      required: [
        getEntityAddressKey(0, INTERACTION_STRATEGY_FQN, FQN.TECHNIQUES_FQN),
        getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.CUSTODY_DIVERTED_FQN),
        getEntityAddressKey(0, DISPOSITION_CLINICIAN_FQN, FQN.CJ_DISPOSITION_FQN),
        getEntityAddressKey(0, REFERRAL_REQUEST_FQN, FQN.SERVICE_TYPE_FQN),
        getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LAW_ENFORCEMENT_INVOLVEMENT_FQN),
        getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.REASON_FQN),
        getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LEVEL_OF_CARE_FQN),
        getEntityAddressKey(0, INVOICE_FQN, FQN.LINE_ITEM_FQN),
      ]
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
    [getEntityAddressKey(0, CRISIS_REPORT_CLINICIAN_FQN, FQN.CUSTODY_DIVERTED_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, DISPOSITION_CLINICIAN_FQN, FQN.CJ_DISPOSITION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'OtherRadioWidget',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, REFERRAL_REQUEST_FQN, FQN.SERVICE_TYPE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
        withNone: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LAW_ENFORCEMENT_INVOLVEMENT_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.REASON_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'checkboxes',
      'ui:options': {
        mode: 'button',
        row: true,
        withOther: true,
      }
    },
    [getEntityAddressKey(0, ENCOUNTER_DETAILS_FQN, FQN.LEVEL_OF_CARE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'radio',
      'ui:options': {
        mode: 'button',
        row: true,
      }
    },
    [getEntityAddressKey(0, INVOICE_FQN, FQN.LINE_ITEM_FQN)]: {
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
