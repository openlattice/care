// @flow
import { List, Map } from 'immutable';
import { Models, Types } from 'lattice';

const { AclBuilder, AceBuilder } = Models;
const { PrincipalTypes, PermissionTypes } = Types;

const getRoles = (roles :List) => {
  const owner = roles.find((role) => role?.name === 'Behavioral Health Report - OWNER');
  const read = roles.find((role) => role?.name === 'Behavioral Health Report - READ');
  const write = roles.find((role) => role?.name === 'Behavioral Health Report - WRITE');
  return [owner, read, write];
};

const getAces = (orgId) => {
  const types = [PermissionTypes.OWNER, PermissionTypes.READ, PermissionTypes.WRITE];
  const aces = types.map((type) => (new AceBuilder({
    principal: {
      type: PrincipalTypes.ROLE,
      id: `${orgId}|Behavioral Health Report - ${type}`
    },
    permissions: [type]
  }).build()));

  return aces;
};

const getAclUpdates = (propertyMetaData, orgId) => {
  const aclUpdates = [];
  Object.keys(propertyMetaData).forEach((entitySetId) => {
    // entity set acl
    aclUpdates.push({
      action: 'ADD',
      acl: new AclBuilder({
        aclKey: [entitySetId],
        aces: getAces(orgId),
      }).build(),
    });

    Object.keys(propertyMetaData[entitySetId]).forEach((propertyTypeId) => {
      // property type acl
      aclUpdates.push({
        action: 'ADD',
        acl: new AclBuilder({
          aclKey: [entitySetId, propertyTypeId],
          aces: getAces(orgId),
        }).build(),
      });
    });
  });

  return aclUpdates;
};

export {
  getAclUpdates,
  getRoles,
};
