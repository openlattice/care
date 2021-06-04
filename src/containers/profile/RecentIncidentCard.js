// @flow
import React from 'react';

import styled from 'styled-components';
import { faBullhorn } from '@fortawesome/pro-solid-svg-icons';
import {
  Banner,
  Card,
} from 'lattice-ui-kit';

const StyledBanner = styled(Banner)`
  color: inherit;
`;

type Props = {
  count :number;
  isLoading ?:boolean;
};

const RecentIncidentCard = (props :Props) => {

  const { count, isLoading } = props;

  if (!count || isLoading) return null;

  return (
    <Card>
      <StyledBanner
          isOpen
          icon={faBullhorn}>
        <span>
          {`${count} incident(s) within the last 7 days.`}
        </span>
      </StyledBanner>
    </Card>
  );
};

RecentIncidentCard.defaultProps = {
  isLoading: false
};

export default RecentIncidentCard;
