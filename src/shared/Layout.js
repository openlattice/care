import React from 'react';
import styled from 'styled-components';
import { FormGroup, ControlLabel, Checkbox, Radio, Button, Row } from 'react-bootstrap';


  // background: #393F46;
  // #F4F4F4
  // FIX height to be %
export const Page = styled.div`
  position: relative;
  background: #393F46;
  width: 100%;
  height: 2000px;
  overflow: auto;
`;

// add wrapper to make relative placement of title?
export const PageHeader = styled.div`
  position: absolute;
  width: 100%;
  height: 50px;
  background: white;
  border-bottom: 1px solid darkgray;
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  color: #37454A;
  font-size: 24px;
  margin: 0 0 0 60px;
  font-weight: bold;

`;

export const FormWrapper = styled.div`
  display: block;
  position: absolute;
  padding: 60px;
  top: 200px;
  left: 50%;
  width: 900px;
  margin-left: -450px;
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
