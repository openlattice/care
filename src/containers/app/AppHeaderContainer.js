/*
 * @flow
 */

import React, { Component } from 'react';

import Select from 'react-select';
import styled, { css } from 'styled-components';
import { Map } from 'immutable';
import { AuthActionFactory } from 'lattice-auth';
import { Button, Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';

import AppNavigationContainer from './AppNavigationContainer';
import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import * as Routes from '../../core/router/Routes';
import { switchOrganization } from './AppActions';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTAINER_WIDTH,
  APP_CONTENT_PADDING,
  MEDIA_QUERY_TECH_SM,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_LG
} from '../../core/style/Sizes';

const { logout } = AuthActionFactory;
const { NEUTRALS, PURPLES, WHITE } = Colors;

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
  max-width: ${APP_CONTAINER_MAX_WIDTH}px;
  min-width: ${MEDIA_QUERY_TECH_SM}px;
  padding: 0 10px;

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    min-width: ${MEDIA_QUERY_MD};
    padding: 0 20px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    min-width: ${MEDIA_QUERY_LG};
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
  margin-left: 30px;
  padding: 6px 29px;
`;

const orgSelectStyles = {
  container: styles => ({
    ...styles,
    width: '200px',
  }),
  control: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: (isFocused || isSelected) ? WHITE : NEUTRALS[8],
    borderColor: (isFocused || isSelected) ? PURPLES[1] : styles.borderColor,
    boxShadow: 'none',
    color: NEUTRALS[1],
    fontSize: '12px',
    lineHeight: 'normal',
    height: '30px',
    minHeight: '30px',
    ':hover': {
      borderColor: (isFocused || isSelected) ? PURPLES[1] : styles.borderColor,
    },
  }),
  menu: styles => ({ ...styles, width: '300px' }),
  option: styles => ({
    ...styles,
    backgroundColor: WHITE,
    color: NEUTRALS[0],
    fontSize: '12px',
    ':hover': {
      backgroundColor: PURPLES[6],
    },
  }),
};

type Props = {
  actions :{
    logout :() => void;
    switchOrganization :(orgId :string) => Object;
  };
  app :Map<*, *>;
};

class AppHeaderContainer extends Component<Props> {

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
      <AppNavigationContainer />
    </LeftSideContentWrapper>
  )

  renderRightSideContent = () => {

    const { actions } = this.props;
    return (
      <RightSideContentWrapper>
        { this.renderOrgSelect() }
        <DisplayControl min={MEDIA_QUERY_LG}>
          <LogoutButton onClick={actions.logout}>
            Log Out
          </LogoutButton>
        </DisplayControl>
        <DisplayControl max={MEDIA_QUERY_TECH_SM}>
          <FontAwesomeIcon icon={faBars} />
        </DisplayControl>
      </RightSideContentWrapper>
    );
  }

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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppHeaderContainer)
);
