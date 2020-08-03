import React, { useState } from 'react';

import { ProfileContainer } from '@lattice-works/lattice-helpline-center';
import { useSelector } from 'react-redux';

import { usePeopleRoute } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';

const HelplineContainer = () => {
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  console.log(organizationId);
  const [personId, setPersonId] = useState('');
  usePeopleRoute(setPersonId);

  console.log(personId);
  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <ProfileContainer organizationId={organizationId} personId={personId} />
      </ContentWrapper>
    </ContentOuterWrapper>
  )
};

export default HelplineContainer;