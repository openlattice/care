import styled, { injectGlobal } from 'styled-components';
import { FormGroup, ControlLabel, FormControl, Checkbox, Radio, Button } from 'react-bootstrap';
import { FLEX } from './Consts';

export const BtnWrapper = styled.div`
  padding-top: 80px;
  width: 1520px;
  text-align: center;
`;

export const Row = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  margin-bottom: 24px;
`;

export const Label = styled(ControlLabel)`
  color: #37454A;
  font-size: 16px;
`;

export const TitleLabel = Label.extend`
  display: block;
  line-height: 1.5;
`;

export const CheckboxLabel = Label.extend`
`;

export const TextInput = styled(FormControl)`
`;

export const InputWrapper = styled(FormGroup).attrs({
  flex: props => props.flex || FLEX['1_3']
})`
  padding-right: 30px;
  flex: ${props => props.flex};
`;

export const CheckboxWrapper = styled(FormGroup)`
`;

export const OtherWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const InlineCheckbox = styled(Checkbox)`
  font-size: 16px;
`;

export const InlineRadio = styled(Radio)`
  font-size: 16px;
`;

export const SelectInput = styled(FormControl)`
`;

export const SubmitButton = styled(Button).attrs({
  type: props => props.type || 'submit'
})`

`;
