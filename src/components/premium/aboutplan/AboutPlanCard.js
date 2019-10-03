// @flow
import React from 'react';
import {
  Card,
  CardSegment,
  CardHeader,
  Label
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoSquare } from '@fortawesome/pro-solid-svg-icons';
import type { Match } from 'react-router-dom';

import EditLinkButton from '../../buttons/EditLinkButton';
import { ABOUT_PATH } from '../../../core/router/Routes';
import { PERSON_ID_FQN } from '../../../edm/DataModelFqns';
import { H1, IconWrapper } from '../../layout';
import Detail from '../styled/Detail';

type Props = {
  isLoading :boolean;
  responsibleUser :Map;
  match :Match;
}

const AboutPlanCard = (props :Props) => {
  const { isLoading, match, responsibleUser } = props;
  const content = responsibleUser.getIn([PERSON_ID_FQN, 0]) || '---';
  return (
    <Card>
      <CardHeader mode="default" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoSquare} fixedWidth />
          </IconWrapper>
          About Plan
          <EditLinkButton mode="neutral" to={`${match.url}${ABOUT_PATH}`} />
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Label subtle>Assigned Officer</Label>
        <Detail isLoading={isLoading} content={content} />
      </CardSegment>
    </Card>
  );
};

export default withRouter(AboutPlanCard);
