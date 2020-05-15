// @flow
import React from 'react';
import type { Node } from 'react';

import { Button } from 'lattice-ui-kit';

import { useGoToPath } from '../hooks';

type Props = {
  children :Node;
  className ? :string;
  disabled ? :boolean;
  isLoading ? :boolean;
  mode ? :string;
  size ? :string;
  state ? :any;
  to :string;
  fullWidth ? :boolean;
}

const LinkButton = (props :Props) => {
  const {
    children,
    className,
    disabled,
    fullWidth,
    isLoading,
    mode,
    size,
    state,
    to,
  } = props;

  const onClick = useGoToPath(to, state);

  return (
    <Button
        className={className}
        disabled={disabled}
        fullWidth={fullWidth}
        isLoading={isLoading}
        mode={mode}
        onClick={onClick}
        size={size}>
      {children}
    </Button>
  );
};

LinkButton.defaultProps = {
  className: undefined,
  disabled: false,
  fullWidth: false,
  isLoading: false,
  mode: undefined,
  size: undefined,
  state: undefined,
};

export default LinkButton;
