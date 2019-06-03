/*
 * @flow
 */

import React, { Component } from 'react';

import Select from 'react-select';
import styled, { css } from 'styled-components';
import isFunction from 'lodash/isFunction';
import { Map } from 'immutable';
import { AuthActions } from 'lattice-auth';
import { Button, Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';

import AppNavigationContainer from './AppNavigationContainer';
import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import DropdownButtonWrapper from '../../components/buttons/DropdownButtonWrapper';
import * as Routes from '../../core/router/Routes';
import { GOOGLE_TRACKING_ID } from '../../core/tracking/google/GoogleAnalytics';
import { switchOrganization } from './AppActions';
import { orgSelectStyles } from './OrgSelectStyles';
import {
  APP_CONTENT_PADDING,
  MEDIA_QUERY_TECH_SM,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_LG
} from '../../core/style/Sizes';

declare var gtag :?Function;

const { logout } = AuthActions;
const { NEUTRALS } = Colors;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_HEADER_BORDER :string = '#e6e6eb';

const AppHeaderOuterWrapper = styled.header`
  border-bottom: 1px solid ${APP_HEADER_BORDER};
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
`;

const AppHeaderInnerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
  max-width: calc(100% - 20px);
  padding: 0 10px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    min-width: ${MEDIA_QUERY_MD - 40}px;
    padding: 0 20px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    min-width: ${MEDIA_QUERY_LG - (2 * APP_CONTENT_PADDING)}px;
    padding: 0 ${APP_CONTENT_PADDING}px;
  }
`;

const LeftSideContentWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
`;

const RightSideContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-end;
`;

const LogoTitleWrapperLink = styled(Link)`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  padding: 15px 0;
  text-decoration: none;

  &:focus {
    text-decoration: none;
  }

  &:hover {
    outline: none;
    text-decoration: none;
  }
`;

const shouldDisplay = (size, props) => {
  const { min, max } = props;
  return !((min && min > size) || (max && max < size));
};

const DisplayControl = styled.div`
  display: ${props => (shouldDisplay(0, props) ? 'inherit' : 'none')};
  ${props => (props.fullWidth ? css`width: 100%;` : '')}

  @media only screen and (min-width: ${MEDIA_QUERY_TECH_SM}px) {
    display: ${props => (shouldDisplay(MEDIA_QUERY_TECH_SM, props) ? 'inherit' : 'none')};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    display: ${props => (shouldDisplay(MEDIA_QUERY_MD, props) ? 'inherit' : 'none')};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    display: ${props => (shouldDisplay(MEDIA_QUERY_LG, props) ? 'inherit' : 'none')};
  }
`;

const AppLogoIcon = styled.img.attrs({
  alt: 'OpenLattice Logo Icon',
  src: OpenLatticeLogo,
})`
  height: 26px;
`;

const AppTitle = styled.h1`
  color: ${NEUTRALS[0]};
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  margin: 0 0 0 10px;
`;

const LogoutButton = styled(Button)`
  font-size: 12px;
  line-height: 16px;
  padding: 20px 0;
  width: 100%;

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 6px 29px;
    margin-left: 30px;
    width: auto;
  }
`;

const DropdownMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

type Props = {
  actions :{
    logout :() => void;
    switchOrganization :(orgId :string) => Object;
  };
  app :Map<*, *>;
};

class AppHeaderContainer extends Component<Props, {}> {

  handleOnClickLogOut = () => {

    const { actions } = this.props;
    actions.logout();

    if (isFunction(gtag)) {
      gtag('config', GOOGLE_TRACKING_ID, { user_id: undefined, send_page_view: false });
    }
  }

  renderLeftSideContent = () => (
    <LeftSideContentWrapper>
      <LogoTitleWrapperLink to={Routes.ROOT}>
        <AppLogoIcon />
        <DisplayControl min={MEDIA_QUERY_LG}>
          <AppTitle>
            Behavioral Health Report
          </AppTitle>
        </DisplayControl>
      </LogoTitleWrapperLink>
      <DisplayControl min={MEDIA_QUERY_MD}>
        <AppNavigationContainer />
      </DisplayControl>
    </LeftSideContentWrapper>
  )

  renderLogoutButton = () => (
    <LogoutButton onClick={this.handleOnClickLogOut}>
      Log Out
    </LogoutButton>
  )

  renderRightSideContent = () => (
    <RightSideContentWrapper>
      { this.renderOrgSelect() }
      <DisplayControl min={MEDIA_QUERY_LG}>
        {this.renderLogoutButton()}
      </DisplayControl>
      <DisplayControl max={MEDIA_QUERY_MD}>
        <DropdownButtonWrapper
            title={<FontAwesomeIcon icon={faBars} />}
            transparent
            fullSize
            hideOnClick
            relativeToPage>
          <DropdownMenuWrapper>
            <DisplayControl fullWidth max={MEDIA_QUERY_TECH_SM}>
              <AppNavigationContainer dropdown />
            </DisplayControl>
            {this.renderLogoutButton()}
          </DropdownMenuWrapper>
        </DropdownButtonWrapper>
      </DisplayControl>
    </RightSideContentWrapper>
  )

  renderOrgSelect = () => {

    const { app, actions } = this.props;
    const isLoadingApp :boolean = app.get('isLoadingApp', false);
    const selectedOrganizationId :string = app.get('selectedOrganizationId', '');
    const organizationOptions = app.get('organizations', Map())
      .valueSeq()
      .map((organization :Map<*, *>) => ({
        label: organization.get('title'),
        value: organization.get('id'),
      }))
      .toJS();

    const handleOnChange = ({ value: orgId }) => {
      if (orgId !== selectedOrganizationId) {
        actions.switchOrganization(orgId);
      }
    };

    return (
      <Select
          value={organizationOptions.find(option => option.value === selectedOrganizationId)}
          isClearable={false}
          isLoading={isLoadingApp}
          isMulti={false}
          onChange={handleOnChange}
          options={organizationOptions}
          placeholder="Select..."
          styles={orgSelectStyles} />
    );
  }

  render() {

    return (
      <AppHeaderOuterWrapper>
        <AppHeaderInnerWrapper>
          { this.renderLeftSideContent() }
          { this.renderRightSideContent() }
        </AppHeaderInnerWrapper>
      </AppHeaderOuterWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    app: state.get('app', Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  return {
    actions: bindActionCreators({ logout, switchOrganization }, dispatch)
  };
}

// $FlowFixMe
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppHeaderContainer)
);
