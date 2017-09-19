import React from 'react';
import styled from 'styled-components';
import { ControlLabel, Checkbox, Radio, Button, Row } from 'react-bootstrap';


export const Page = styled.div`
  background: #393F46;
  overflow: auto;
  min-height: 56.5vw;
`;

export const PageHeader = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  background: white;
  border-bottom: 1px solid darkgray;
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  color: #37454A;
  font-size: 20px;
  margin: 0 0 0 60px;
  font-weight: bold;

`;

export const FormWrapper = styled.div`
  position: relative;
  display: block;
  padding: 60px;
  top: 160px;
  left: 50%;
  width: 900px;
  margin-left: -450px;
  margin-bottom: 200px;
  background: #F4F4F4;
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

export const LabelDescription = Label.extend`
  color: light-gray;
  font-size: 12px;
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

export const SectionHeader = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  color: #37454A;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const NavBtnWrapper = styled.div`
  position: absolute;
  width: 300px;
  left: 50%;
  margin-left: -150px;
  text-align: center;
`;

export const StyledButton = styled(Button)`
  margin: 0 10px;
`;

export const ErrorMessage = styled.div`
  color: red;
`;
