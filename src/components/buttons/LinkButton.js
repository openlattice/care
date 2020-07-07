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
  state ? :any;
  to :string;
  variant ? :string;
}

const LinkButton = (props :Props) => {
  const {
    color,
    children,
    className,
    disabled,
    fullWidth,
    isLoading,
    variant,
    size,
    state,
    to,
  } = props;

  const onClick = useGoToPath(to, state);

  return (
    <Button
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
  color: 'primary',
  disabled: false,
  fullWidth: false,
  isLoading: false,
  size: undefined,
  state: undefined,
  variant: 'text',
};

export default LinkButton;
