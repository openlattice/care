// @flow
import React from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTheaterMasks } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardHeader,
  Colors
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';


import SpecificTechniques from './SpecificTechniques';
import EditLinkButton from '../../../components/buttons/EditLinkButton';
import { OFFICER_SAFETY_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { H1, IconWrapper, UL } from '../../../components/layout';

const { NEUTRALS } = Colors;


const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const DeescalationContentWrapper = styled.div`
  display: flex;

  > div {
    display: flex;
    flex-direction: column;
    flex: 0 0 50%;
    padding: 10px 20px;
  }

  > div:last-child {
    border-left: 1px solid ${NEUTRALS[4]}
  }
`;

type Props = {
  isLoading :boolean;
  match :Match;
  showEdit :boolean;
  techniques :List<Map>;
};

const DeescalationCard = (props :Props) => {
  const {
    isLoading,
    match,
    showEdit,
    techniques
  } = props;

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faTheaterMasks} fixedWidth />
          </IconWrapper>
          De-escalation
          { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${OFFICER_SAFETY_PATH}`} /> }
        </H1>
      </CardHeader>
      <DeescalationContentWrapper>
        <SpecificTechniques isLoading={isLoading} techniques={techniques} />
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

export default withRouter(DeescalationCard);
