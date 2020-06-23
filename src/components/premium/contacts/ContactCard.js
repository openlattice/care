// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  Label,
} from 'lattice-ui-kit';

import PhoneLink from '../../links/PhoneLink';

const H2 = styled.h2`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-word;
`;

const StyledCard = styled(Card)`
  width: 240px;
`;

type Props = {
  extension ? :string;
  name ? :string;
  phoneNumber ? :string;
  phoneType ? :string;
  relationship ? :string;
}

const ContactCard = (props :Props) => {
  const {
    extension,
    name,
    phoneNumber,
    phoneType,
    relationship,
  } = props;

  return (
    <StyledCard>
      <CardHeader padding="sm" noBleed>
        <H2>
          { name }
        </H2>
      </CardHeader>
      <CardSegment vertical padding="sm">
        {relationship}
        <ContentWrapper bottom>
          <Label subtle>{phoneType}</Label>
          <PhoneLink number={phoneNumber} extension={extension} />
        </ContentWrapper>
      </CardSegment>
    </StyledCard>
  );
};

ContactCard.defaultProps = {
  extension: '',
  name: '',
  phoneNumber: '',
  phoneType: '',
  relationship: '',
};

export default ContactCard;
