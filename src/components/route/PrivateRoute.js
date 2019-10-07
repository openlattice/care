// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import type { ComponentType } from 'react';

import { useAuthorization } from '../hooks';
import Unauthorized from '../warnings/Unauthorized';

type Props = {
  authorize :() => any;
  component :ComponentType<any>;
};

const PrivateRoute = (props :Props) => {
  const {
    authorize,
    component: Component,
    ...rest
  } = props;

  const isAuthorized = useAuthorization('profile', authorize);

  return (
    <Route
        {...rest} // eslint-disable-line indent
        render={(ownProps :any) => (
          isAuthorized
            ? <Component {...ownProps} />
            : <Unauthorized isLoading />
        )} />
  );
};

export default PrivateRoute;
