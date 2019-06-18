// @flow
import React from 'react';
import styled from 'styled-components';

import { CardSegment, IconSplash } from 'lattice-ui-kit';
import { List } from 'immutable';
import { UL } from '../../../components/layout';

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
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
    </CardSegment>
  );
};

export default Triggers;
