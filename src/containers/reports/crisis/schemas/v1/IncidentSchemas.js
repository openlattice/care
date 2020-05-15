import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { CRISIS_REPORT } from '../constants';

const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Incident',
      properties: {
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DATE_TIME_OCCURRED_FQN)]: {
          title: 'Date & Time',
          type: 'string',
          format: 'date-time',
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OL_ID_FQN)]: {
          title: 'Incident #',
          type: 'string',
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.INCIDENT_NARRATIVE_FQN)]: {
          title: 'Summary',
          type: 'string',
        },
        [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.TYPE_FQN)]: {
          title: 'Report Type',
          type: 'string',
          default: CRISIS_REPORT,
        },
      },
      required: [
        getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DATE_TIME_OCCURRED_FQN),
      ]
    }
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.DATE_TIME_OCCURRED_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.OL_ID_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.INCIDENT_NARRATIVE_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    [getEntityAddressKey(0, BEHAVIORAL_HEALTH_REPORT_FQN, FQN.TYPE_FQN)]: {
      'ui:widget': 'hidden'
    }
  }
};

export {
  schema,
  uiSchema
};
