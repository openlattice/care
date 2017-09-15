/*
 * @flow
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as RoutePaths from '../../core/router/RoutePaths';

import * as Auth0 from './Auth0';
import * as AuthActionFactory from './AuthActionFactory';
import * as AuthUtils from './AuthUtils';

function mapStateToProps(state :Map<*, *>) :Object {

  let authTokenExpiration :number = state.getIn(['auth', 'authTokenExpiration'], -1);
  if (AuthUtils.hasAuthTokenExpired(authTokenExpiration)) {
    authTokenExpiration = -1;
  }

  return {
    authTokenExpiration
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions :{ [string] :Function } = {};

  Object.keys(AuthActionFactory).forEach((action :string) => {
    actions[action] = AuthActionFactory[action];
  });

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

type Props = {
  actions :{
    authAttempt :Function,
    authExpired :Function,
    authSuccess :Function,
    hideLock :Function,
    showLock :Function
  },
  authTokenExpiration :number,
  component :Function
};

class AuthRoute extends React.Component<Props> {

  componentWillMount() {

    if (!AuthUtils.hasAuthTokenExpired(this.props.authTokenExpiration)) {
      this.props.actions.authSuccess(AuthUtils.getAuthToken());
    }
    else {
      this.props.actions.authAttempt();
    }
  }

  componentWillUnmount() {

    // TODO: minor edge case: lock.hide() only needs to be invoked if the lock is already showing
    // TODO: extreme edge case: lock.show() will not actually show the lock if invoked immediately after lock.hide()
    // TODO: https://github.com/auth0/lock/issues/1089
    Auth0.getAuth0LockInstance().hide();
  }

  componentWillReceiveProps(nextProps :Object) {

    if (AuthUtils.hasAuthTokenExpired(nextProps.authTokenExpiration)) {
      // if nextProps.authTokenExpiration === -1, we've already dispatched AUTH_EXPIRED
      if (nextProps.authTokenExpiration !== -1) {
        this.props.actions.authExpired();
      }
      Auth0.getAuth0LockInstance().show();
    }
    else {
      Auth0.getAuth0LockInstance().hide();
    }
  }

  render() {

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
