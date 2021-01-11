import React from 'react';

import { DownloadsContainer as HelplineDownloadsContainer } from '@lattice-works/lattice-helpline-center';
import { DownloadsContainer as CRCDownloadsContainer } from '@openlattice/lattice-community-restorative-court';
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
    case 'crisis':
      component = <CrisisReportDownloadsContainer />;
      break;
    case 'crc':
      component = <CRCDownloadsContainer root={DOWNLOADS_PATH} match={match} organizationId={organizationId} />;
      break;
    case 'helpline':
      component = <HelplineDownloadsContainer root={DOWNLOADS_PATH} match={match} organizationId={organizationId} />;
      break;
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
