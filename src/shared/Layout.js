import styled, { injectGlobal } from 'styled-components';
import { ControlLabel, FormControl, Checkbox, Radio } from 'react-bootstrap';
import { FLEX } from './Consts';

export const Row = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  margin-bottom: 36px;
`;

export const Label = styled(ControlLabel)`
  margin: 0 8px 6px 4px;
  color: #37454A;
`;

export const TitleLabel = Label.extend`
  display: block;
`;

export const CheckboxLabel = Label.extend`
  line-height: 1.5;
`;

export const TextInput = styled(FormControl)`
  width: 100%;
  height: 24px;
  display: inline-block;
`;

export const InputWrapper = styled.span.attrs({
  flex: props => props.flex || FLEX['1_3'],
})`
  padding-right: 30px;
  flex: ${props => props.flex};
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
`;
