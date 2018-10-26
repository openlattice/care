import React from 'react';
import styled from 'styled-components';

import { APP_CONTAINER_WIDTH, MEDIA_QUERY_MD, MEDIA_QUERY_LG } from '../../core/style/Sizes';
import {
  BLACK,
  GRAY,
  INVALID_BACKGROUND,
  INVALID_BORDER,
  RED_PINK
} from '../../shared/Colors';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background: #ffffff;
  padding: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    font-size: 16px;
    padding: 15px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    font-size: 18px;
    padding: 20px;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;

  background-color: ${props => (props.invalid ? `${INVALID_BACKGROUND}` : 'transparent')};
  border: ${props => (props.invalid ? `1px solid ${INVALID_BORDER}` : 'none')};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  color: ${BLACK};

  h1 {
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 18px;
  }

  span {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const FormText = styled.div`
  font-size: 14px;
  color: ${props => (props.gray ? GRAY : BLACK)};
  margin: ${props => (props.noMargin ? 0 : 10)}px 0;
`;

export const IndentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${props => (props.extraIndent ? '5px 15px 5px 30px' : '5px 15px')};
  width: 100%;
`;


const RequiredFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-spart;
  align-items: flex-start;
`;

const RequiredAsterisk = styled.span`
  color: ${RED_PINK};
`;

export const RequiredField = ({ children }) => (
  <RequiredFieldWrapper>
    <span>{children}</span>
    <RequiredAsterisk>*</RequiredAsterisk>
  </RequiredFieldWrapper>
);
