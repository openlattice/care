// @flow
import { get, remove } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { COMPLETED_DT_FQN, RELATIONSHIP_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  CONTACTED_VIA_FQN,
  CONTACT_INFORMATION_FQN,
  EMERGENCY_CONTACT_FQN,
  IS_EMERGENCY_CONTACT_FOR_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const {
  getEntityAddressKey,
  getPageSectionKey,
} = DataProcessingUtils;

const getContactAssociations = (
  formData :Object,
  nowAsIsoString :String,
  personEKID :UUID | number
) => {
  const contacts = get(formData, getPageSectionKey(1, 1), []);
  const associations :any[][] = [];
  contacts.forEach((contact, index) => {
    debugger;
    const relationship = get(contact, getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, RELATIONSHIP_FQN), '');
    associations.push(
      [IS_EMERGENCY_CONTACT_FOR_FQN, index, EMERGENCY_CONTACT_FQN, personEKID, PEOPLE_FQN, {
        [RELATIONSHIP_FQN.toString()]: [relationship]
      }],
      [CONTACTED_VIA_FQN, index, CONTACT_INFORMATION_FQN, index, EMERGENCY_CONTACT_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }]
    );
  });

  return associations;
};

// remove relationship data prevent it from being added as a regular entity on top of being an association
const removeRelationshipData = (formData :Object) :Object => {
  const contacts = get(formData, getPageSectionKey(1, 1), []);
  const withoutRelationships = contacts
    .map((contact :Object) => remove(contact, getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, RELATIONSHIP_FQN)));

  return {
    [getPageSectionKey(1, 1)]: withoutRelationships
  };
};

export {
  getContactAssociations,
  removeRelationshipData,
};
