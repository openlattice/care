// @flow
import React, { useCallback } from 'react';

import styled from 'styled-components';
import {
  faBell,
  faCampground,
  faCog,
  faDownload,
  faFileAlt,
  faFileExclamation,
  faFileUpload,
  faHome,
  faMapMarkedAlt,
  faQuestionCircle,
  faSearch,
  faSignOut,
  faUser,
  faUserChart,
  faUserNurse,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { AppHeaderWrapper, AppNavigationWrapper } from 'lattice-ui-kit';
import { NavLink } from 'react-router-dom';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import { useAppSettings, useOrganization } from '../../components/hooks';
import {
  DASHBOARD_PATH,
  DOCUMENTS_PATH,
  DOWNLOADS_PATH,
  EXPLORE_PATH,
  HOME_PATH,
  ISSUES_PATH,
  LOGOUT_PATH,
  REPORTS_PATH,
  SETTINGS_PATH,
  SUBSCRIPTIONS_PATH,
} from '../../core/router/Routes';
import {
  ENCAMPMENTS_PATH,
  LOCATION_PATH,
  PEOPLE_PATH,
  PROVIDER_PATH
} from '../../longbeach/routes';
import { media } from '../../utils/StyleUtils';

const StyledAppHeaderWrapper = styled(AppHeaderWrapper)`
  > div {
    min-width: 100vw;
  }

  /* hide app title for smaller screens */
  .app-nav-root > h1 {
    ${media.tablet`
      display: none;
    `}
  }
`;

const StyledNavLink = styled(NavLink)`
  display: ${(props) => (props.hidden ? 'none' : 'block')};
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

  /* <===== BEGIN LONG BEACH HACK =====> */
  const [appSettings] :Map = useAppSettings();

  const isLongBeach = appSettings.get('longBeach', false);
  const stayAway = isLongBeach || appSettings.get('stayAway', false);
  const providers = isLongBeach || appSettings.get('providers', false);
  const homelessEncampments = isLongBeach || appSettings.get('homelessEncampments', false);
  /* <===== END LONG BEACH HACK =====> */

  const hiddenFeatures = appSettings.get('hiddenFeatures', Map());

  const onChange = useCallback(({ value } :any) => {
    switchOrganization(value);
  }, [switchOrganization]);

  return (
    <StyledAppHeaderWrapper
        appIcon={OpenLatticeLogo}
        appTitle="CARE"
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
        <StyledNavLink to={REPORTS_PATH} hidden={isLongBeach || hiddenFeatures.get('reports')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faFileAlt} />
          <NavLabel>Reports</NavLabel>
        </StyledNavLink>
        {/* <===== BEGIN LONG BEACH HACK =====> */}
        <StyledNavLink to={PEOPLE_PATH} hidden={!isLongBeach}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faUser} />
          <NavLabel>People</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={LOCATION_PATH} hidden={!stayAway}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faMapMarkedAlt} />
          <NavLabel>Stay Away Locations</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={ENCAMPMENTS_PATH} hidden={!homelessEncampments}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faCampground} />
          <NavLabel>Encampments</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={PROVIDER_PATH} hidden={!providers}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faUserNurse} />
          <NavLabel>Providers</NavLabel>
        </StyledNavLink>
        {/* <===== END LONG BEACH HACK =====> */}
        <StyledNavLink to={SUBSCRIPTIONS_PATH} hidden={hiddenFeatures.get('subscriptions')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faBell} />
          <NavLabel>Subscriptions</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={DASHBOARD_PATH} hidden={isLongBeach || hiddenFeatures.get('dashboard')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faUserChart} />
          <NavLabel>Dashboard</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={DOWNLOADS_PATH} hidden={isLongBeach || hiddenFeatures.get('downloads')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faDownload} />
          <NavLabel>Downloads</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={EXPLORE_PATH} hidden={isLongBeach || hiddenFeatures.get('explore')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faSearch} />
          <NavLabel>Explore</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={DOCUMENTS_PATH} hidden={isLongBeach || hiddenFeatures.get('documents')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faFileUpload} />
          <NavLabel>Documents</NavLabel>
        </StyledNavLink>
        <hr />
        <StyledNavLink to={ISSUES_PATH} hidden={isLongBeach || hiddenFeatures.get('issues')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faFileExclamation} />
          <NavLabel>Manage Issues</NavLabel>
        </StyledNavLink>
        <StyledNavLink to={SETTINGS_PATH} hidden={isLongBeach || hiddenFeatures.get('settings')}>
          <FontAwesomeIcon size="lg" fixedWidth icon={faCog} />
          <NavLabel>Application Settings</NavLabel>
        </StyledNavLink>
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
