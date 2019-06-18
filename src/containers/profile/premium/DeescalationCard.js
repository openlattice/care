import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTheaterMasks } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  Colors
} from 'lattice-ui-kit';

import SpecificTechniques from './SpecificTechniques';
import { UL } from '../../../components/layout';

const { NEUTRALS } = Colors;

const IconWrapper = styled.div`
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  margin-right: 10px;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const DeescalationContentWrapper = styled.div`
  display: flex;
  min-height: 150px;

  > div {
    flex: 0 0 50%;
    padding: 10px 20px;
  }

  > div:last-child {
    border-left: 1px solid ${NEUTRALS[4]}
  }
`;

const DeescalationCard = () => {
  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faTheaterMasks} fixedWidth />
          </IconWrapper>
          De-escalation
        </H1>
      </CardHeader>
      <DeescalationContentWrapper>
        <SpecificTechniques />
        <div>
          <H2>
            General Best Practices
          </H2>
          <UL>
            <li>Make one request at a time</li>
            <li>Attempt to re-orient to current place and time - Grounding Techniques</li>
          </UL>
        </div>
      </DeescalationContentWrapper>
    </Card>
  );
};

export default DeescalationCard;
