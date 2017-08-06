import styled, { injectGlobal } from 'styled-components';
import { ControlLabel, FormControl, Checkbox, Radio, Button } from 'react-bootstrap';
import { FLEX } from './Consts';

export const Row = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  margin-bottom: 36px;
`;

export const Label = styled(ControlLabel)`
  margin: 0 8px 4px 4px;
  color: #37454A;
`;

export const TitleLabel = Label.extend`
  display: block;
  line-height: 1.5;
`;

export const CheckboxLabel = Label.extend`
  margin: 0 8px 0 4px;
  line-height: 2;
`;

export const TextInput = styled(FormControl)`
  width: 100%;
  height: 24px;
  display: inline-block;
`;

export const InputWrapper = styled.span.attrs({
  flex: props => props.flex || FLEX['1_3']
})`
  padding-right: 30px;
  flex: ${props => props.flex};
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const OtherWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const InlineCheckbox = styled(Checkbox)`
  display: inline-block;
`;

export const InlineRadio = styled(Radio)`
  display: inline-block;
`;

export const SelectInput = styled(FormControl)`
  margin-right: 20px;
  width: 100%;
  height: 30px;
`;

export const SubmitButton = styled(Button).attrs({
  type: props => props.type || 'submit'
})`
`;
