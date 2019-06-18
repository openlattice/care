// @flow
import React from 'react';
import styled from 'styled-components';
import { List } from 'immutable';
import {
  Button,
  IconSplash
} from 'lattice-ui-kit';
import { UL } from '../../../components/layout';

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const ActionRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

type Props = {
  techniques :List;
}

const SpecificTechniques = (props :Props) => {
  const { techniques } = props;

  return (
    <div>
      <H2>
        Specific Techniques
      </H2>
      {
        techniques.count()
          ? (
            <UL>
              <li>Techniques</li>
            </UL>
          )
          : <IconSplash caption="No known techniques." />
      }
      <ActionRow>
        <Button mode="subtle">Suggest a Technique</Button>
      </ActionRow>
    </div>
  );
};

export default SpecificTechniques;
