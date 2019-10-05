// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import { faLockAlt } from '@fortawesome/pro-duotone-svg-icons';
import type { ComponentType, ElementConfig } from 'react';

import { IconSplash } from 'lattice-ui-kit';

const NOT_AUTHORIZED = 'You are not authorized to view this content. Please contact an administrator for access.';

type Props = ElementConfig<typeof Route> & {
  authorize :() => void;
  component :ComponentType<any>;
  isAuthorized ? :boolean;
};

const PrivateRoute = (props :Props) => {
  const {
    authorize,
    isAuthorized,
    component: Component,
    ...rest
  } = props;

  authorize();

  return (
    <Route
        {...rest} // eslint-disable-line indent
        render={(ownProps :any) => (
          isAuthorized
            ? <Component {...ownProps} />
            : <IconSplash caption={NOT_AUTHORIZED} icon={faLockAlt} />
        )} />
  );
};

PrivateRoute.defaultProps = {
  isAuthorized: false
};

export default PrivateRoute;
