// @flow
import React from 'react';

import styled from 'styled-components';
import { faPhoneAlt } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardHeader,
  CardSegment,
  Label,
} from 'lattice-ui-kit';

const H2 = styled.h2`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  align-items: center;
`;

const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 10px;
`;

const Telephone = styled.a`
  font-weight: 600;
  font-size: 0.875rem;
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

  const formattedNumber = (phoneNumber && extension) ? `${phoneNumber} ext. ${extension}` : phoneNumber;
  const telHref = (phoneNumber && extension) ? `tel:${phoneNumber};ext=${extension}` : `tel:${phoneNumber}`;

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
          <Telephone href={telHref}>
            <IconWrapper>
              <FontAwesomeIcon icon={faPhoneAlt} />
            </IconWrapper>
            {formattedNumber}
          </Telephone>
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
