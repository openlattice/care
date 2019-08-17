// @flow
import React from 'react';
import styled from 'styled-components';
import { Constants } from 'lattice';
import {
  IconSplash,
  Spinner
} from 'lattice-ui-kit';
import { List, Map } from 'immutable';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import LinkButton from '../../../components/buttons/LinkButton';
import { OFFICER_SAFETY_PATH } from '../../../core/router/Routes';

import { UL } from '../../../components/layout';
import { TRIGGER_FQN } from '../../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
`;

type Props = {
  isLoading :boolean;
  match :Match;
  triggers :List<Map>;
};

const Triggers = (props :Props) => {

  const { isLoading, match, triggers } = props;

  if (isLoading) return <Spinner size="2x" />;

  let content = <IconSplash caption="No triggers." />;
  if (!triggers.isEmpty()) {
    content = (
      <UL>
        {
          triggers.map((trigger) => {
            const value :string = trigger.getIn([TRIGGER_FQN, 0], '');
            const triggerEKID :UUID = trigger.getIn([OPENLATTICE_ID_FQN, 0]);
            return <li key={triggerEKID}>{value}</li>;
          })
        }
      </UL>
    );
  }

  return (
    <>
      <H2>
        Triggers
      </H2>
      { content }
      <ActionRow>
        <LinkButton mode="subtle" to={`${match.url}${OFFICER_SAFETY_PATH}`}>Suggest a Trigger</LinkButton>
      </ActionRow>
    </>
  );
};

export default withRouter(Triggers);
