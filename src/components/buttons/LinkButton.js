// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'lattice-ui-kit';

import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import { goToPath } from '../../core/router/RoutingActions';

type Props = {
  actions :{
    goToPath :RequestSequence;
  };
  children :Node;
  className ? :string;
  disabled ? :boolean;
  isLoading ? :boolean;
  mode ? :string;
  state ? :any;
  to :string;
}

class LinkButton extends Component<Props> {

  static defaultProps = {
    className: undefined,
    disabled: false,
    isLoading: false,
    mode: undefined,
    state: undefined,
  };

  handleOnClick = () => {
    const { to, actions, state } = this.props;
    actions.goToPath(to, state);
  }

  render() {
    const {
      children,
      className,
      disabled,
      isLoading,
      mode,
    } = this.props;
    return (
      <Button
          className={className}
          disabled={disabled}
          isLoading={isLoading}
          mode={mode}
          onClick={this.handleOnClick}>
        {children}
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  actions: bindActionCreators({ goToPath }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(LinkButton);
