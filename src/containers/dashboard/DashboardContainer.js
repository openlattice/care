// @flow
import React from 'react';

import { DashboardContainer as CRCDashboardContainer } from '@openlattice/lattice-community-restorative-court';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import CrisisReportDashboardContainer from './CrisisReportDashboardContainer';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper } from '../../components/layout';
import { DASHBOARD_PATH } from '../../core/router/Routes';
import { CRC, CRISIS } from '../../shared/ModuleConstants';

const DashboardContainer = () => {
  const [settings] = useAppSettings();
  const profileModule = settings.get('profileModule', CRISIS);
  const organizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  const match = useRouteMatch();

  let component = null;

  switch (profileModule) {
    case CRC:
      component = <CRCDashboardContainer root={DASHBOARD_PATH} match={match} organizationId={organizationId} />;
      break;
    default:
      component = <CrisisReportDashboardContainer />;
      break;
  }

  return (
    <ContentOuterWrapper>
      {component}
    </ContentOuterWrapper>
  );
};

export default DashboardContainer;
