// @flow
import React from 'react';

import styled from 'styled-components';
import { faPhoneAlt } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 5px;
`;

const Telephone = styled.a`
  font-weight: 600;
  font-size: 0.875rem;
`;

type Props = {
  number :string;
  extension :string;
};

const PhoneLink = (props :Props) => {
  const {
    extension,
    number,
  } = props;

  const formattedNumber = (number && extension) ? `${number} ext. ${extension}` : number;
  const telHref = (number && extension) ? `tel:${number};ext=${extension}` : `tel:${number}`;

  return (
    <Telephone href={telHref}>
      <IconWrapper>
        <FontAwesomeIcon icon={faPhoneAlt} />
      </IconWrapper>
      {formattedNumber}
    </Telephone>
  );
};

export default PhoneLink;
