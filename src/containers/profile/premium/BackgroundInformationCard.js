// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/pro-solid-svg-icons';

const IconWrapper = styled.span`
  vertical-align: middle;
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

type Props = {
  isLoading ? :boolean;
  backgroundInformation ? :Map;
};

const ResponsePlanCard = ({ isLoading } :Props) => (
  <Card>
    <CardHeader mode="primary" padding="sm">
      <H1>
        <IconWrapper>
          <FontAwesomeIcon icon={faAddressCard} fixedWidth />
        </IconWrapper>
        Background Information
      </H1>
    </CardHeader>
    <CardSegment vertical padding="sm">
      <IconSplash caption="No background information." />
    </CardSegment>
  </Card>
);


ResponsePlanCard.defaultProps = {
  isLoading: false,
  backgroundInformation: Map(),
};

export default ResponsePlanCard;
