// @flow
import React, { useCallback } from 'react';
import { Map } from 'immutable';
import styled, { css } from 'styled-components';
import { AppHeaderWrapper, AppNavigationWrapper } from 'lattice-ui-kit';
import { NavLink } from 'react-router-dom';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import { useOrganization, useLogout } from '../../components/hooks';
import { media } from '../../utils/StyleUtils';
import {
  DASHBOARD_PATH,
  DOWNLOADS_PATH,
  HOME_PATH,
  PEOPLE_PATH,
  REPORTS_PATH,
} from '../../core/router/Routes';

const StyledAppHeaderWrapper = styled(AppHeaderWrapper)`
  > div {
    min-width: 375px;
  }

  /* hide app title for smaller screens */
  .app-nav-root > h1 {
    ${media.tablet(css`
      display: none;
    `)}
  }
`;

type Props = {
  organizations :Map;
};

const NewAppHeaderContainer = (props :Props) => {
  const { organizations = Map() } = props;
  const [selectedOrganizationId, isLoading, switchOrganization] = useOrganization();
  const logout = useLogout();

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
        <NavLink to={REPORTS_PATH}>Reports</NavLink>
        <NavLink to={DASHBOARD_PATH}>Dashboard</NavLink>
        <NavLink to={PEOPLE_PATH}>People</NavLink>
        <NavLink to={DOWNLOADS_PATH}>Downloads</NavLink>
        <a onClick={logout}>Logout</a>
      </AppNavigationWrapper>
    </StyledAppHeaderWrapper>
  );
};

export default NewAppHeaderContainer;
