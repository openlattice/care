// @flow
import React from 'react';
import styled from 'styled-components';

import { Button, CardSegment, IconSplash } from 'lattice-ui-kit';
import { List } from 'immutable';
import { UL } from '../../../components/layout';

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  triggers :List;
};

const Triggers = (props :Props) => {

  const { triggers } = props;
  return (
    <CardSegment padding="sm" vertical>
      <H2>
        Triggers
      </H2>
      {
        triggers.count()
          ? (
            <UL>
              <li>triggers</li>
            </UL>
          )
          : <IconSplash caption="No known triggers." />
      }
      <ActionRow>
        <Button mode="subtle">Suggest a Trigger</Button>
      </ActionRow>
    </CardSegment>
  );
};

export default Triggers;
