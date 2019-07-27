// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'lattice-ui-kit';

import type { Dispatch } from 'redux';

import { goToPath } from '../../core/router/RoutingActions';

type Props = {
  to :string;
}

class LinkButton extends Component<Props> {

  handleOnClick = () => {
    const { to } = this.props;
    goToPath(to);
  }

  render() {
    const { to, ...rest } = this.props;
    return <Button {...rest} onClick={this.handleOnClick} />;
  }
}

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  actions: bindActionCreators({ goToPath }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(LinkButton);
