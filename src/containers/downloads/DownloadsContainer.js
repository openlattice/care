import React from 'react';

import { DownloadsContainer as HelplineDownloadsContainer } from '@openlattice/lattice-helpline-center';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import CrisisReportDownloadsContainer from './CrisisReportDownloadsContainer';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { DOWNLOADS_PATH } from '../../core/router/Routes';

const DownloadsContainer = () => {
  const settings = useAppSettings();
  const profileModule = settings.get('profileModule', 'crisis');
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  const match = useRouteMatch();

  let component = null;

  switch (profileModule) {
    case 'helpline': {
      component = <HelplineDownloadsContainer root={DOWNLOADS_PATH} match={match} organizationId={organizationId} />;
      break;
    }
    case 'crisis':
    default:
      component = <CrisisReportDownloadsContainer />;
      break;
  }

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        {component}
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default DownloadsContainer;
