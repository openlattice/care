// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
} from 'lattice-ui-kit';

import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import Portrait from '../../../components/portrait/Portrait';
import * as FQN from '../../../edm/DataModelFqns';
import { getDobFromPerson } from '../../../utils/PersonUtils';

const CenteredSegment = styled(CardSegment)`
  align-items: center;
  border-bottom: 0 !important;
`;

const WordBreakSegment = styled(CardSegment)`
  word-break: break-word;
`;

type Props = {
  imageUrl :string;
  isLoading :boolean;
  person :Map;
  personDetails :Map;
};

const PortraitCard = (props :Props) => {
  const {
    imageUrl,
    isLoading,
    person,
    personDetails,
  } = props;

  const dob = getDobFromPerson(person);
  const first = person.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = person.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
  const veteran = personDetails.getIn([FQN.VETERAN_STATUS_FQN, 0], '');

  return (
    <Card>
      <CenteredSegment vertical>
        <Portrait imageUrl={imageUrl} />
      </CenteredSegment>
      <WordBreakSegment noBleed padding="0 0 10px" vertical>
        <LabeledDetail content={first} isLoading={isLoading} label="First Name" />
      </WordBreakSegment>
      <WordBreakSegment noBleed padding="sm" vertical>
        <LabeledDetail content={last} isLoading={isLoading} label="Last Name" />
      </WordBreakSegment>
      <WordBreakSegment noBleed padding="sm" vertical>
        <LabeledDetail content={dob} isLoading={isLoading} label="Date of Birth" />
      </WordBreakSegment>
      <WordBreakSegment noBleed padding="10px 0 30px" vertical>
        <LabeledDetail content={veteran} isLoading={isLoading} label="Veteran" />
      </WordBreakSegment>
    </Card>
  );
};

export default PortraitCard;
