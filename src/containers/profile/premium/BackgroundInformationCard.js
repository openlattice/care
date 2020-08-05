// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  IconSplash,
  Spinner
} from 'lattice-ui-kit';
import { LangUtils } from 'lattice-utils';

import { Header } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';
import { CONTEXT_FQN } from '../../../edm/DataModelFqns';

const { isEmptyString, isNonEmptyString } = LangUtils;

const Text = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

type Props = {
  isLoading ? :boolean;
  backgroundInformation :Map;
};

const BackgroundInformationCard = (props :Props) => {
  const {
    backgroundInformation,
    isLoading,
  } = props;
  if (isLoading) {
    return <CardSkeleton />;
  }
  const backgroundSummary :string = backgroundInformation.getIn([CONTEXT_FQN, 0]) || '';
  return (
    <Card>
      <CardSegment vertical>
        <Header>Background</Header>
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

export default BackgroundInformationCard;
