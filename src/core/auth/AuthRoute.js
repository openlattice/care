/*
 * @flow
 */

import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as RoutePaths from '../../core/router/RoutePaths';

import * as Auth0 from './Auth0';
import * as AuthActionFactory from './AuthActionFactory';
import * as AuthUtils from './AuthUtils';

function mapStateToProps(state :Map<>) {

  // console.log('AuthyRoute : mapStateToProps()');

  let authTokenExpiration :number = state.getIn(['auth', 'authTokenExpiration'], -1);
  if (AuthUtils.hasAuthTokenExpired(authTokenExpiration)) {
    authTokenExpiration = -1;
  }

  return {
    authTokenExpiration
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    authenticated: AuthActionFactory.authenticated,
    authTokenExpired: AuthActionFactory.authTokenExpired
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class AuthRoute extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      authenticated: PropTypes.func.isRequired,
      authTokenExpired: PropTypes.func.isRequired
    }).isRequired,
    authTokenExpiration: PropTypes.number.isRequired,
    component: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    }).isRequired
  }

  componentWillMount() {

    // console.log('AuthyRoute : componentWillMount() - ', this.props.authTokenExpiration);

    if (!AuthUtils.hasAuthTokenExpired(this.props.authTokenExpiration)) {
      this.props.actions.authenticated(AuthUtils.getAuthToken());
      return;
    }

    // TODO: race condition currently causes the lock to start showing even after being logged in, though it is hidden
    // almost immediately in componentWillReceiveProps(). we need a way to guarantee we are showing the lock ONLY
    // when the user is not logged in, and not while authentication is in progress.
    Auth0.getAuth0LockInstance().show();
  }

  // componentDidMount() {
  //
  //   // console.log('AuthyRoute : componentDidMount() - ', this.props.authTokenExpiration);
  //   // Auth0.getAuth0LockInstance().show();
  // }

  componentWillUnmount() {

    // console.log('AuthyRoute : componentWillUnmount() - ', this.props.authTokenExpiration);

    // TODO: lock.show() will not actually show the lock if invoked immediately after lock.hide()
    // TODO: https://github.com/auth0/lock/issues/1089
    Auth0.getAuth0LockInstance().hide();
  }

  componentWillReceiveProps(nextProps :Object) {

    // console.log('AuthyRoute : componentWillReceiveProps() - ', nextProps.authTokenExpiration);

    if (AuthUtils.hasAuthTokenExpired(nextProps.authTokenExpiration)) {
      // if nextProps.authTokenExpiration === -1, we've already dispatched AUTH_TOKEN_EXPIRED
      if (nextProps.authTokenExpiration !== -1) {
        this.props.actions.authTokenExpired();
      }
      Auth0.getAuth0LockInstance().show();
    }
    else {
      Auth0.getAuth0LockInstance().hide();
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //
  //   console.log('AuthyRoute : componentWillUpdate() - ', this.props.authTokenExpiration);
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //
  //   console.log('AuthyRoute : shouldComponentUpdate() - ', nextProps.authTokenExpiration);
  //   return true;
  // }

  render() {

    // console.log('AuthyRoute : render() - ', this.props.authTokenExpiration);

    const {
      component: WrappedComponent,
      ...wrappedComponentProps
    } = this.props;

    if (!AuthUtils.hasAuthTokenExpired(this.props.authTokenExpiration)) {
      return (
        <WrappedComponent {...wrappedComponentProps} />
      );
    }

    // TODO: perhpas render something at "/login" instead of an empty page
    return (
      <Switch>
        <Route exact strict path={RoutePaths.LOGIN} />
        <Redirect to={RoutePaths.LOGIN} />
      </Switch>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
);
