// @flow
import React from 'react';
import styled from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { aboutDetailSkeleton } from '../../../components/skeletons';

const Detail = styled.div`
  margin: 5px 0;
  ${props => (props.isLoading ? aboutDetailSkeleton : null)}
`;

const IconWrapper = styled.span`
  align-items: center;
  margin-right: 10px;
`;

type Props = {
  icon :IconDefinition;
  content :string;
}

const AboutDetail = ({ icon, content } :Props) => (
  <Detail>
    <IconWrapper>
      <FontAwesomeIcon icon={icon} fixedWidth />
    </IconWrapper>
    <span>{content}</span>
  </Detail>
);

export default AboutDetail;
