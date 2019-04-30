// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

import { FormWrapper } from './FormComponents';
import { BLACK } from '../../shared/Colors';
import { CRISIS_PATH, HOME_PATH } from '../../core/router/Routes';

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

};

class SubmitSuccess extends Component<Props> {

  clearAndNavigate = (path :string) => () => {

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

export default SubmitSuccess;
