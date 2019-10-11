// @flow
import React from 'react';
import {
  Card,
  CardSegment,
  CardHeader,
  Label
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { useRouteMatch } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoSquare } from '@fortawesome/pro-solid-svg-icons';

import EditLinkButton from '../../buttons/EditLinkButton';
import { ABOUT_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { PERSON_ID_FQN } from '../../../edm/DataModelFqns';
import { H1, IconWrapper } from '../../layout';
import Detail from '../styled/Detail';

type Props = {
  isLoading :boolean;
  responsibleUser :Map;
  showEdit :boolean;
}

const AboutPlanCard = (props :Props) => {
  const match = useRouteMatch();
  const { isLoading, responsibleUser, showEdit } = props;
  const content = responsibleUser.getIn([PERSON_ID_FQN, 0]) || '---';
  return (
    <Card>
      <CardHeader mode="default" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoSquare} fixedWidth />
          </IconWrapper>
          About Plan
          { showEdit && <EditLinkButton mode="subtle" to={`${match.url}${EDIT_PATH}${ABOUT_PATH}`} /> }
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Label subtle>Assigned Officer</Label>
        <Detail isLoading={isLoading} content={content} />
      </CardSegment>
    </Card>
  );
};

export default AboutPlanCard;
