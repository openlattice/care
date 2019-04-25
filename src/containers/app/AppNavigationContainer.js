/*
 * @flow
 */

import React, { Component } from 'react';

import styled, { css } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import {
  DASHBOARD_PATH,
  DOWNLOADS_PATH,
  HOME_PATH,
  PEOPLE_PATH,
  REPORTS_PATH,
  SUBSCRIBE_PATH
} from '../../core/router/Routes';

const { NEUTRALS, PURPLES } = Colors;

const NAV_LINK_ACTIVE_CLASSNAME :string = 'nav-link-active';

/*
 * styled components
 */

const NavLinkWrapper = styled(NavLink).attrs({
  activeClassName: NAV_LINK_ACTIVE_CLASSNAME
})`
  align-items: center;
  border-bottom: 3px solid transparent;
  color: ${NEUTRALS[1]};
  display: flex;
  font-size: 12px;
  letter-spacing: 0;
  margin-right: ${props => (props.dropdown ? 0 : 30)}px;
  outline: none;
  padding: 13px 2px 10px 2px;
  text-align: left;
  text-decoration: none;

  &:focus {
    text-decoration: none;
  }

  &:hover {
    color: ${NEUTRALS[0]};
    cursor: pointer;
    outline: none;
    text-decoration: none;
  }

  &.${NAV_LINK_ACTIVE_CLASSNAME} {
    border-bottom: 3px solid ${PURPLES[1]};
    color: ${PURPLES[1]};
  }
`;

const NavigationContentWrapper = styled.nav`
  display: flex;
  flex-direction: ${props => (props.dropdown ? 'column' : 'row')};
  flex: 0 0 auto;
  justify-content: flex-start;
  margin-left: ${props => (props.dropdown ? 0 : 30)}px;

  ${(props) => {
    if (props.dropdown) {
      return css`
        width: 100%;

        ${NavLinkWrapper} {
          width: 100%;
          padding: 20px 0;
          justify-content: center;

          &:hover {
            background-color: #e4d8ff;
          }

          &.${NAV_LINK_ACTIVE_CLASSNAME} {
            border-bottom: none !important;
          }
        }
      `;
    }
    return '';
  }}
`;

type Props = {
  dropdown? :boolean
};

const AppNavigationContainer = ({ dropdown } :Props) => (
  <NavigationContentWrapper dropdown={dropdown}>
    <NavLinkWrapper to={HOME_PATH}>Home</NavLinkWrapper>
    <NavLinkWrapper to={REPORTS_PATH}>Reports</NavLinkWrapper>
    <NavLinkWrapper to={DASHBOARD_PATH}>Dashboard</NavLinkWrapper>
    <NavLinkWrapper to={PEOPLE_PATH}>People</NavLinkWrapper>
    <NavLinkWrapper to={DOWNLOADS_PATH}>Downloads</NavLinkWrapper>
  </NavigationContentWrapper>
);

AppNavigationContainer.defaultProps = {
  dropdown: false
};

export default withRouter(AppNavigationContainer);
