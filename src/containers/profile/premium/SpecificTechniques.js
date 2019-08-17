// @flow
import React from 'react';
import styled from 'styled-components';
import { Constants } from 'lattice';
import { List, Map } from 'immutable';
import {
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import LinkButton from '../../../components/buttons/LinkButton';
import { UL } from '../../../components/layout';
import { TECHNIQUES_FQN } from '../../../edm/DataModelFqns';
import { OFFICER_SAFETY_PATH } from '../../../core/router/Routes';

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
  techniques :List<Map>;
}

const SpecificTechniques = (props :Props) => {
  const { isLoading, match, techniques } = props;

  if (isLoading) {
    return (
      <div>
        <Spinner size="2x" />
      </div>
    );
  }

  let content = <IconSplash caption="No techniques." />;
  if (!techniques.isEmpty()) {
    content = (
      <UL>
        {
          techniques.map((technique) => {
            const value :string = technique.getIn([TECHNIQUES_FQN, 0], '');
            const entityKeyId :UUID = technique.getIn([OPENLATTICE_ID_FQN, 0]);
            return <li key={entityKeyId}>{value}</li>;
          })
        }
      </UL>
    );
  }

  return (
    <div>
      <H2>
        Specific Techniques
      </H2>
      { content }
      <ActionRow>
        <LinkButton mode="subtle" to={`${match.url}${OFFICER_SAFETY_PATH}`}>Suggest a Technique</LinkButton>
      </ActionRow>
    </div>
  );
};

export default withRouter(SpecificTechniques);
