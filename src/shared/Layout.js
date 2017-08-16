import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { FormGroup, ControlLabel, Checkbox, Radio, Button, Row } from 'react-bootstrap';
import { FLEX } from './Consts';

export const Page = styled.div`
  background: #F4F4F4;
`;

export const PageHeader = styled.div`
  padding: 60px;
  background: white;
  border-bottom: 1px solid darkgray;
`;

export const Title = styled.h1`
  text-align: center;
  color: #37454A;
  font-size: 40px;
`;

export const Description = styled.div`
  text-align: center;
  font-size: 24px;
  color: #37454A;
`;

export const FormWrapper = styled.div`
  margin: 0 60px 0 60px;
  padding-bottom: 100px;
`;

export const PaddedRow = styled(Row)`
  margin-bottom: 38px;
`;

export const Label = styled(ControlLabel)`
  color: #37454A;
  font-size: 16px;
`;

export const TitleLabel = Label.extend`
  display: block;
  line-height: 1.5;
`;

export const InputWrapper = styled(({ flex, children, ...rest }) => {
  return (
    <FormGroup {...rest}>{children}</FormGroup>
  );
})`
  padding-right: 30px;
  flex: ${(props) => {
    return props.flex || FLEX.COL_1_3;
  }};
`;

export const OtherWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const InlineCheckbox = styled(Checkbox)`
  font-size: 16px;
  margin-right: 12px;
  margin-bottom: 10px;
  margin-left: 0px !important;
`;

export const InlineRadio = styled(Radio)`
  font-size: 16px;
`;

export const ButtonWrapper = styled.div`
  text-align: center;
`;

export const SubmitButtonWrapper = ButtonWrapper.extend`
  padding-top: 80px;
  width: 1520px;
`;

export const SubmitButton = styled(Button).attrs({
  type: (props) => {
    return props.type || 'submit';
  }
})`

`;
