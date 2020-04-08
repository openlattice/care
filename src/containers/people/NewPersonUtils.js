// @flow
import { Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS as APP } from '../../shared/Consts';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

function getNewPersonAssociations() :any[][] {
  const now = DateTime.local().toISO();
  const NOW_DATA = { [FQN.COMPLETED_DT_FQN]: [now] };

  const associations :any[][] = [
    [APP.REPORTED_FQN, 0, APP.PEOPLE_FQN, 0, APP.PERSON_DETAILS_FQN, NOW_DATA]
  ];

  return associations;
}

function getDefaultFormData(searchInputs :Map) {
  const firstName :string = searchInputs.get('firstName').trim() || undefined;
  const lastName :string = searchInputs.get('lastName').trim() || undefined;
  const dob :string = searchInputs.get('dob');
  const race :string = searchInputs.getIn(['race', 'value']);
  const sex :string = searchInputs.getIn(['sex', 'value']);
  const ethnicity :string = searchInputs.getIn(['ethnicity', 'value']);

  const formData = {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_LAST_NAME_FQN)]: lastName,
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_FIRST_NAME_FQN)]: firstName,
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_DOB_FQN)]: dob,
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_SEX_FQN)]: sex,
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_RACE_FQN)]: race,
      [getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_ETHNICITY_FQN)]: ethnicity,
    }
  };

  return formData;
}

export {
  getDefaultFormData,
  getNewPersonAssociations
};
