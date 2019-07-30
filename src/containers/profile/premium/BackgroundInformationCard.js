// @flow
import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash,
  Spinner
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEdit } from '@fortawesome/pro-solid-svg-icons';

import LinkButton from '../../../components/buttons/LinkButton';
import { RESPONSE_PLAN_PATH } from '../../../core/router/Routes';

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

const EditButton = styled(LinkButton)`
  margin-left: auto;
  padding: 2px;
`;

type Props = {
  isLoading ? :boolean;
  backgroundInformation :Map;
  match :Match;
};

const ResponsePlanCard = ({ backgroundInformation, isLoading, match } :Props) => (
  <Card>
    <CardHeader mode="primary" padding="sm">
      <H1>
        <IconWrapper>
          <FontAwesomeIcon icon={faAddressCard} fixedWidth />
        </IconWrapper>
        Background Information
        <EditButton mode="primary" to={`${match.url}${RESPONSE_PLAN_PATH}`}>
          <FontAwesomeIcon icon={faEdit} fixedWidth />
        </EditButton>
      </H1>
    </CardHeader>
    <CardSegment vertical padding="sm">
      { isLoading && <Spinner size="2x" /> }
      { (!isLoading && backgroundInformation.isEmpty()) && <IconSplash caption="No background information." /> }
    </CardSegment>
  </Card>
);


ResponsePlanCard.defaultProps = {
  isLoading: false
};

export default withRouter(ResponsePlanCard);
