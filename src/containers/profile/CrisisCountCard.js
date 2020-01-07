// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Colors
} from 'lattice-ui-kit';

import { crisisCountSkeleton } from '../../components/skeletons';

const { NEUTRALS } = Colors;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 24px;
  ${(props) => props.isLoading && crisisCountSkeleton};
`;

const StrongWithSubtitle = styled.span`
  font-weight: 600;

  ::after {
    content: 'IN THE LAST YEAR';
    color: ${NEUTRALS[1]};
    font-size: 16px;
    margin-left: 10px;
  }
`;

type Props = {
  count :number;
  isLoading :boolean;
}

const CrisisCountCard = ({ count, isLoading } :Props) => (
  <Card>
    <CardSegment padding="sm">
      <Centered isLoading={isLoading}>
        {
          !isLoading
            && (
              <StrongWithSubtitle>
                {`${count} CRISIS CALLS`}
              </StrongWithSubtitle>
            )
        }
      </Centered>
    </CardSegment>
  </Card>
);

export default CrisisCountCard;
