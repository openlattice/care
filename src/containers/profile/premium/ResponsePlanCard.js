// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash
} from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardListCheck } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';

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
  responsePlans ? :List;
};

const ResponsePlanCard = ({ isLoading } :Props) => (
  <Card>
    <CardHeader mode="primary" padding="sm">
      <H1>
        <IconWrapper>
          <FontAwesomeIcon icon={faClipboardListCheck} fixedWidth />
        </IconWrapper>
        Response Plan
      </H1>
    </CardHeader>
    <CardSegment vertical padding="sm">
      <IconSplash caption="No response plan." />
    </CardSegment>
  </Card>
);

ResponsePlanCard.defaultProps = {
  isLoading: false,
  reponsePlans: List(),
};

export default ResponsePlanCard;
