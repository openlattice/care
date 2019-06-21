import React from 'react';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/pro-solid-svg-icons';

const { NEUTRALS, WHITE } = Colors;

const QuestionIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faQuestionCircle,
  fixedWidth: true,
}))`
  margin-right: 5px;
  font-size: 15px;
`;

const ButtonLink = styled.a.attrs(() => ({
  href: 'https://support.openlattice.com/servicedesk/customer/portal/1',
  target: '_blank'
}))`
  display: flex;
  position: fixed;
  bottom: 30px;
  right: 30px;
  align-items: center;
  background-color: ${WHITE};
  border-radius: 5px;
  border: 1px solid ${NEUTRALS[4]};
  color: ${NEUTRALS[1]};
  height: 38px;
  font-weight: 600;
  justify-content: center;
  padding: 0 10px;
  font-size: 12px;
  line-height: 17px;
  text-decoration: none;
  text-align: center;

  :hover {
    background-color: ${NEUTRALS[8]};
  }
`;

const SupportButton = () => (
  <ButtonLink>
    <QuestionIcon />
    <span>Contact Support</span>
  </ButtonLink>
);

export default SupportButton;
