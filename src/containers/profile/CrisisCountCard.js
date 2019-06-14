// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardSegment,
  Colors,
  Spinner
} from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const StrongWithSubtitle = styled.span`
  font-size: 24px;
  font-weight: 600;

  :after {
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

const CrisisCountCard = ({ count, isLoading } :Props) => {
  return (
    <Card>
      <CardSegment padding="sm">
        <Centered>
          { isLoading
            ? <Spinner size="2x" />
            : (
              <StrongWithSubtitle>
                {`${count} CRISIS CALLS`}
              </StrongWithSubtitle>
            )
          }
        </Centered>
      </CardSegment>
    </Card>
  );
};

export default CrisisCountCard;
