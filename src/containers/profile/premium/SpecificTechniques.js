// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Button
} from 'lattice-ui-kit';

const Header = styled.header`
  font-weight: 600;
  margin-bottom: 10px;
`;

const UL = styled.ul`
  padding-inline-start: inherit;
`;

const ActionRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

type Props = {}

class SpecificTechniques extends Component<Props> {
  render() {
    return (
      <div>
        <Header>
          Specific Techniques
        </Header>
        <UL />
        <ActionRow>
          <Button>Suggest a Technique</Button>
        </ActionRow>
      </div>
    );
  }
}

export default SpecificTechniques;
