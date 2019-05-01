// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import { FormWrapper } from './FormComponents';
import { BLACK } from '../../shared/Colors';
import { CRISIS_PATH, HOME_PATH } from '../../core/router/Routes';
import { clearCrisisTemplate } from '../../containers/crisis/CrisisActionFactory';
import { goToPath } from '../../core/router/RoutingActions';
import type { RoutingAction } from '../../core/router/RoutingActions';

const SubmittedView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  min-height: 230px;

  h1 {
    color: ${BLACK};
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 0;
  width: 100%;
`;

const StyledButton = styled(Button)`
  margin-bottom: 10px;
`;

type Props = {
  actions :{
    clearCrisisTemplate :() => {
      type :string;
    };
    goToPath :(path :string) => RoutingAction;
  };
};

class SubmitSuccess extends Component<Props> {

  clearAndNavigate = (path :string) => () => {
    const { actions } = this.props;
    actions.clearCrisisTemplate();
    actions.goToPath(path);
  };

  render() {
    return (
      <PageWrapper>
        <FormWrapper>
          <SubmittedView>
            <h1>Your report has been submitted!</h1>
            <StyledButton mode="primary" onClick={this.clearAndNavigate(HOME_PATH)}>Return to Home</StyledButton>
            <StyledButton onClick={this.clearAndNavigate(CRISIS_PATH)}>New Crisis Template</StyledButton>
          </SubmittedView>
        </FormWrapper>
      </PageWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  // $FlowFixMe
  actions: bindActionCreators({
    clearCrisisTemplate,
    goToPath,
  }, dispatch)
});

// $FlowFixMe
export default connect(null, mapDispatchToProps)(SubmitSuccess);
