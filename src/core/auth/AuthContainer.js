/*
 * @flow
 */

import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import RoutePaths from '../../core/router/RoutePaths';

import { authenticate } from '../../core/auth/AuthActionFactory';

function mapStateToProps(state :Map<>) {

  return {
    isLoggedIn: state.getIn(['auth', 'isLoggedIn'])
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    authenticate
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class AuthContainer extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      authenticate: PropTypes.func.isRequired
    }).isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }

  componentWillMount() {

    if (!this.props.isLoggedIn) {
      // TODO: when we are redirected back, the lock starts fading in and is quickly hidden on "authenticated" event
      this.props.actions.authenticate();
    }
  }

  render() {

    if (this.props.isLoggedIn) {
      return (
        <Redirect to="/" />
      );
    }

    // nothing to render. Auth0 Lock does its own thing.
    return null;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthContainer)
);
