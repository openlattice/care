// @flow
import React, { useCallback } from 'react';

import styled from 'styled-components';
import {
  faDownload,
  faFileAlt,
  faFileExclamation,
  faHome,
  faQuestionCircle,
  faSignOut,
  faUserChart,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { AppHeaderWrapper, AppNavigationWrapper } from 'lattice-ui-kit';
import { NavLink } from 'react-router-dom';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import { useOrganization } from '../../components/hooks';
import {
  DASHBOARD_PATH,
  DOWNLOADS_PATH,
  HOME_PATH,
  ISSUES_PATH,
  LOGOUT_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';
import { media } from '../../utils/StyleUtils';

const StyledAppHeaderWrapper = styled(AppHeaderWrapper)`
  > div {
    min-width: 375px;
  }

  /* hide app title for smaller screens */
  .app-nav-root > h1 {
    ${media.tablet`
      display: none;
    `}
  }
`;

const NavLabel = styled.span`
  margin-left: 20px;
`;

type Props = {
  organizations :Map;
};

const AppHeaderContainer = (props :Props) => {
  const { organizations = Map() } = props;
  const [selectedOrganizationId, isLoading, switchOrganization] = useOrganization();

  const onChange = useCallback(({ value } :any) => {
    switchOrganization(value);
  }, [switchOrganization]);

  return (
    <StyledAppHeaderWrapper
        appIcon={OpenLatticeLogo}
        appTitle="Behavioral Health Report"
        organizationsSelect={{
          isLoading,
          onChange,
          organizations,
          selectedOrganizationId
        }}>
      <AppNavigationWrapper drawer>
        <NavLink to={HOME_PATH} />
        <NavLink to={HOME_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faHome} />
          <NavLabel>Home</NavLabel>
        </NavLink>
        <NavLink to={REPORTS_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faFileAlt} />
          <NavLabel>Reports</NavLabel>
        </NavLink>
        <NavLink to={DASHBOARD_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faUserChart} />
          <NavLabel>Dashboard</NavLabel>
        </NavLink>
        <NavLink to={DOWNLOADS_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faDownload} />
          <NavLabel>Downloads</NavLabel>
        </NavLink>
        <hr />
        <NavLink to={ISSUES_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faFileExclamation} />
          <NavLabel>Manage Issues</NavLabel>
        </NavLink>
        <a
            href="https://support.openlattice.com/servicedesk/customer/portal/1"
            rel="noopener noreferrer"
            target="_blank">
          <FontAwesomeIcon size="lg" fixedWidth icon={faQuestionCircle} />
          <NavLabel>Contact Support</NavLabel>
        </a>
        <NavLink to={LOGOUT_PATH}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faSignOut} />
          <NavLabel>Logout</NavLabel>
        </NavLink>
      </AppNavigationWrapper>
    </StyledAppHeaderWrapper>
  );
};

export default AppHeaderContainer;
