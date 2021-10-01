// @flow
import React from 'react';
import type { ComponentType } from 'react';

import { Route } from 'react-router-dom';

import Unauthorized from '../warnings/Unauthorized';
import { useAuthorization } from '../hooks';
import type { PrivateSetting } from '../../containers/settings/constants';

type Props = {
  authorize :() => any;
  component :ComponentType<any>;
  feature :PrivateSetting;
  unauthorizedComponent :ComponentType<any>;
};

const PrivateRoute = (props :Props) => {
  const {
    authorize,
    feature,
    component: Component,
    unauthorizedComponent: UnauthorizedComponent,
    ...rest
  } = props;

  const [isAuthorized, isLoading] = useAuthorization(feature, authorize);

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    // $FlowIgnore
    <Route
        {...rest} // eslint-disable-line indent
        render={(ownProps :any) => (
          isAuthorized
            ? <Component {...ownProps} />
            : <UnauthorizedComponent isLoading={isLoading} />
        )} />
    /* eslint-enable */
  );
};

PrivateRoute.defaultProps = {
  unauthorizedComponent: Unauthorized
};

export default PrivateRoute;
