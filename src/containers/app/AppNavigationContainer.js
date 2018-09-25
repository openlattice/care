/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import { HOME_PATH, REPORTS_PATH } from '../../core/router/Routes';

const { NEUTRALS, PURPLES } = Colors;

const NAV_LINK_ACTIVE_CLASSNAME :string = 'nav-link-active';

/*
 * styled components
 */

const NavigationContentWrapper = styled.nav`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
  margin-left: 30px;
`;

const NavLinkWrapper = styled(NavLink).attrs({
  activeClassName: NAV_LINK_ACTIVE_CLASSNAME
})`
  align-items: center;
  border-bottom: 3px solid transparent;
  color: ${NEUTRALS[1]};
  display: flex;
  font-size: 12px;
  letter-spacing: 0;
  margin-right: 30px;
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

type Props = {};

class AppNavigationContainer extends Component<Props> {

  render() {

    return (
      <NavigationContentWrapper>
        <NavLinkWrapper to={HOME_PATH}>Home</NavLinkWrapper>
        <NavLinkWrapper to={REPORTS_PATH}>Reports</NavLinkWrapper>
      </NavigationContentWrapper>
    );
  }
}

export default withRouter(AppNavigationContainer);
