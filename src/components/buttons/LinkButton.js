// @flow
import React, { Component } from 'react';
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
  to :string;
}

class LinkButton extends Component<Props> {

  handleOnClick = () => {
    const { to, actions } = this.props;
    actions.goToPath(to);
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
