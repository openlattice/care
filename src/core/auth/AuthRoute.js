/*
 * @flow
 */

/* eslint-disable react/prefer-stateless-function */

import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import RoutePaths from '../../core/router/RoutePaths';

import { configureLattice } from './AuthActionFactory';

function mapStateToProps(state :Map<>) {

  return {
    isLoggedIn: state.getIn(['auth', 'isLoggedIn'], false)
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    configureLattice
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class AuthRoute extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      configureLattice: PropTypes.func.isRequired
    }).isRequired,
    component: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }

  componentWillMount() {

    // TODO: this is awkward. there must be another way to configure lattice when we're already logged in
    if (this.props.isLoggedIn) {
      this.props.actions.configureLattice();
    }
  }

  render() {

    const {
      component: Component,
      isLoggedIn,
      ...rest
    } = this.props;

    return (
      <Route
          {...rest}
          render={(props) => {
            if (isLoggedIn) {
              return (
                <Component {...props} />
              );
            }
            return (
              <Redirect to={{ pathname: 'auth' }} />
            );
          }} />
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
);
