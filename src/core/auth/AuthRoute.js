/*
 * @flow
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as Auth0 from './Auth0';
import * as AuthUtils from './AuthUtils';
import * as Routes from '../../core/router/Routes';
import {
  authAttempt,
  authExpired,
  authSuccess
} from './AuthActionFactory';

/*
 * constants
 */

const EXPIRED :number = -1;

/*
 * types
 */

type Props = {
  actions :{
    authAttempt :Function,
    authExpired :Function,
    authSuccess :Function
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

  componentWillReceiveProps(nextProps :Props) {

    if (AuthUtils.hasAuthTokenExpired(nextProps.authTokenExpiration)) {
      // if nextProps.authTokenExpiration === -1, we've already dispatched AUTH_EXPIRED
      if (nextProps.authTokenExpiration !== EXPIRED) {
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
      // TODO: is there a way to definitively check if a prop is a Component?
      if (WrappedComponent !== null && WrappedComponent !== undefined && typeof WrappedComponent === 'function') {
        return (
          <WrappedComponent {...wrappedComponentProps} />
        );
      }
      // TODO: is the right action to take?
      return (
        <Redirect to={Routes.ROOT} />
      );
    }

    // TODO: perhpas render something at "/login" instead of an empty page
    return (
      <Switch>
        <Route exact strict path={Routes.LOGIN} />
        <Redirect to={Routes.LOGIN} />
      </Switch>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  let authTokenExpiration :number = state.getIn(['auth', 'authTokenExpiration'], EXPIRED);
  if (AuthUtils.hasAuthTokenExpired(authTokenExpiration)) {
    authTokenExpiration = EXPIRED;
  }

  return {
    authTokenExpiration
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    authAttempt,
    authExpired,
    authSuccess
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
);
