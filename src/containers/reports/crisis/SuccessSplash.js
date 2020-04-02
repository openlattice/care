// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileCheck } from '@fortawesome/pro-duotone-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardSegment,
  Colors,
  IconSplash,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import type { Map } from 'immutable';

import { BreadcrumbLink } from '../../../components/breadcrumbs';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../../core/router/Routes';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const { PURPLES, NEUTRALS } = Colors;

const StyledLink = styled(BreadcrumbLink)`
  color: ${NEUTRALS[0]};
`;

const LinkText = styled.span`
  margin-right: 0.5rem;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  color: ${NEUTRALS[0]};

  > p {
    font-weight: normal;
    margin: 0.625rem 0;
  }
`;

const Success = styled.h1`
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0;
`;

const FileCheck = (size) => <FontAwesomeIcon icon={faFileCheck} color={PURPLES[1]} size={size} />;

type Props = {
  selectedPerson :Map;
};

const SuccessSplash = ({ selectedPerson } :Props) => {

  const personEKID = getEntityKeyId(selectedPerson);
  const name = getFirstLastFromPerson(selectedPerson);
  const Message = (
    <MessageWrapper>
      <Success>Success!</Success>
      <p>{`You submitted a Crisis Report on ${DateTime.local().toLocaleString(DateTime.DATE_SHORT)} for ${name}`}</p>
      <StyledLink to={PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID)}>
        <LinkText>
          Visit profile
        </LinkText>
        <FontAwesomeIcon icon={faArrowRight} fixedWidth />
      </StyledLink>
    </MessageWrapper>
  );

  return (
    <Card>
      <CardSegment>
        <IconSplash
            icon={FileCheck}
            caption={Message} />
      </CardSegment>
    </Card>
  );
};

export default SuccessSplash;
