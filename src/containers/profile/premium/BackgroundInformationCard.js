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
import { faAddressCard } from '@fortawesome/pro-solid-svg-icons';

import EditLinkButton from '../../../components/buttons/EditLinkButton';
import { RESPONSE_PLAN_PATH } from '../../../core/router/Routes';
import { CONTEXT_FQN } from '../../../edm/DataModelFqns';
import { isNonEmptyString, isEmptyString } from '../../../utils/LangUtils';
import { H1, IconWrapper } from '../../../components/layout';

const Text = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

type Props = {
  isLoading ? :boolean;
  backgroundInformation :Map;
  match :Match;
};

const BackgroundInformationCard = ({ backgroundInformation, isLoading, match } :Props) => {
  const backgroundSummary :string = backgroundInformation.getIn([CONTEXT_FQN, 0]) || '';
  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faAddressCard} fixedWidth />
          </IconWrapper>
          Background Information
          <EditLinkButton mode="primary" to={`${match.url}${RESPONSE_PLAN_PATH}`} />
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        { isLoading && <Spinner size="2x" /> }
        { (!isLoading && isNonEmptyString(backgroundSummary)) && <Text>{backgroundSummary}</Text> }
        { (!isLoading && isEmptyString(backgroundSummary)) && <IconSplash caption="No background information." /> }
      </CardSegment>
    </Card>
  );
};

BackgroundInformationCard.defaultProps = {
  isLoading: false
};

export default withRouter(BackgroundInformationCard);
