import React from 'react';

import { ProfileContainer } from '@lattice-works/lattice-helpline-center';
import { useSelector } from 'react-redux';

const HelplineContainer = () => {
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  return (
    <ProfileContainer organizationId={organizationId} />
  )
};

export default HelplineContainer;