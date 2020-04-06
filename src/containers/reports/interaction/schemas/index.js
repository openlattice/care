import { fromJS } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { INTERACTED_WITH_FQN } = APP_TYPES_FQNS;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Track Your Physical Contact',
      properties: {
        [getEntityAddressKey(0, INTERACTED_WITH_FQN, FQN.CONTACT_DATE_TIME_FQN)]: {
          title: 'Date & Time',
          type: 'string',
          format: 'date-time'
        },
      },
      required: [
        getEntityAddressKey(0, INTERACTED_WITH_FQN, FQN.CONTACT_DATE_TIME_FQN),
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
    [getEntityAddressKey(0, INTERACTED_WITH_FQN, FQN.CONTACT_DATE_TIME_FQN)]: {
      classNames: 'column-span-12',
    },
  },
};

const getDefaultFormData = () => {
  const now = DateTime.local().toISO();
  return fromJS({
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, INTERACTED_WITH_FQN, FQN.CONTACT_DATE_TIME_FQN)]: now
    }
  });
};

export {
  schema,
  uiSchema,
  getDefaultFormData,
};
