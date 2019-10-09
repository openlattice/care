// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import type { ComponentType } from 'react';

import { useAuthorization } from '../hooks';
import Unauthorized from '../warnings/Unauthorized';

type Props = {
  authorize :() => any;
  component :ComponentType<any>;
  feature :string;
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
    <Route
        {...rest} // eslint-disable-line indent
        render={(ownProps :any) => (
          isAuthorized
            ? <Component {...ownProps} />
            : <UnauthorizedComponent isLoading={isLoading} />
        )} />
  );
};

PrivateRoute.defaultProps = {
  unauthorizedComponent: Unauthorized
};

export default PrivateRoute;
