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
  align-items: center;
  background-color: ${WHITE};
  border-radius: 5px;
  border: 1px solid ${NEUTRALS[4]};
  bottom: 30px;
  color: ${NEUTRALS[1]};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  height: 38px;
  justify-content: center;
  line-height: 17px;
  padding: 0 10px;
  position: fixed;
  left: 30px;
  text-align: center;
  text-decoration: none;

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
