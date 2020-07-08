// @flow
import React from 'react';
import type { Node } from 'react';

import { Button } from 'lattice-ui-kit';

import { useGoToPath } from '../hooks';

type Props = {
  children :Node;
  className ? :string;
  color ? :string;
  disabled ? :boolean;
  fullWidth ? :boolean;
  isLoading ? :boolean;
  size ? :string;
  startIcon ? :Node;
  state ? :any;
  to :string;
  variant ? :string;
}

const LinkButton = (props :Props) => {
  const {
    children,
    className,
    color,
    disabled,
    fullWidth,
    isLoading,
    size,
    startIcon,
    state,
    to,
    variant,
  } = props;

  const onClick = useGoToPath(to, state);

  return (
    <Button
        startIcon={startIcon}
        color={color}
        className={className}
        disabled={disabled}
        fullWidth={fullWidth}
        isLoading={isLoading}
        variant={variant}
        onClick={onClick}
        size={size}>
      {children}
    </Button>
  );
};

LinkButton.defaultProps = {
  className: undefined,
  color: undefined,
  disabled: false,
  fullWidth: false,
  isLoading: false,
  size: undefined,
  startIcon: undefined,
  state: undefined,
  variant: undefined,
};

export default LinkButton;
