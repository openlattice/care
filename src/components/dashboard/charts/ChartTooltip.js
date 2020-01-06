// @flow

import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';

const TooltipCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 3px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: 1px solid #e1e1eb;
  padding: 10px 15px;

  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #2e2e34;

  span {
    margin: 5px 0;
  }
`;

type Props = {
  children :Node;
}

const ChartTooltip = ({ children } :Props) => (
  <TooltipCard>
    {children}
  </TooltipCard>
);

export default ChartTooltip;
