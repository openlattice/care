// @flow

import React from 'react';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const BehaviorItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr 1fr;
  grid-gap: 5px;
  padding: 5px 0;
  align-items: center;
`;

const Percentage = styled.span`
  color: ${NEUTRALS[1]};
`;

type Props = {
  name :string;
  count :number;
  total :number;
};

const BehaviorItem = (props :Props) => {
  const { name, count, total } = props;
  const percentage = Math.round((count / total) * 100);
  return (
    <BehaviorItemWrapper>
      <strong>{name}</strong>
      <strong>{count}</strong>
      <Percentage>{`(${percentage}%)`}</Percentage>
    </BehaviorItemWrapper>
  );
};

export default BehaviorItem;
