// @flow
import React, { useState } from 'react';

import { AppContainer } from '@openlattice/lattice-community-restorative-court';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import { usePeopleRoute } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { PROFILE_VIEW_PATH } from '../../../core/router/Routes';

const CRCContainer = () => {
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  const match = useRouteMatch();
  const [personId, setPersonId] = useState('');
  usePeopleRoute(setPersonId);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <AppContainer
            organizationId={organizationId}
            personId={personId}
            root={`${PROFILE_VIEW_PATH}`}
            match={match} />
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default CRCContainer;
