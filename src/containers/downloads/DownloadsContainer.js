import React from 'react';

import { DownloadsContainer as CRCDownloadsContainer } from '@openlattice/lattice-community-restorative-court';
import { DownloadsContainer as HelplineDownloadsContainer } from '@openlattice/lattice-helpline-center';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import CrisisReportDownloadsContainer from './CrisisReportDownloadsContainer';

import ExportBulkContainer from '../reports/export/ExportBulkContainer';
import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { DOWNLOADS_PATH } from '../../core/router/Routes';
import { CRC, CRISIS, HELPLINE } from '../../shared/ModuleConstants';

const DownloadsContainer = () => {
  const [settings] = useAppSettings();
  const profileModule = settings.get('profileModule', 'crisis');
  const v2 = settings.get('v2', false);
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  const match = useRouteMatch();

  let component = null;

  switch (profileModule) {
    case CRISIS:
      component = <CrisisReportDownloadsContainer />;
      break;
    case CRC:
      component = <CRCDownloadsContainer root={DOWNLOADS_PATH} match={match} organizationId={organizationId} />;
      break;
    case HELPLINE:
      component = <HelplineDownloadsContainer root={DOWNLOADS_PATH} match={match} organizationId={organizationId} />;
      break;
    default:
      component = <CrisisReportDownloadsContainer />;
      break;
  }

  if (v2) component = <ExportBulkContainer />;

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        {component}
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default DownloadsContainer;
