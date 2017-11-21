/*
 * @flow
 */

import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logout } from '../../core/auth/AuthActionFactory';

const StyledLogoutButtonWrapper = styled.span`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const StyledLogoutButton = styled(Button)`
`;

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    logout
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

const LogoutButton = ({ actions }) => {
  return (
    <StyledLogoutButtonWrapper>
      <StyledLogoutButton onClick={actions.logout}>Logout</StyledLogoutButton>
    </StyledLogoutButtonWrapper>
  );
};

LogoutButton.propTypes = {
  actions: PropTypes.shape({
    logout: PropTypes.func.isRequired
  }).isRequired
};

export default connect(null, mapDispatchToProps)(LogoutButton);
