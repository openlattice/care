import styled, { injectGlobal } from 'styled-components';
import { ControlLabel, FormControl, Checkbox, Radio } from 'react-bootstrap';

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

export const TextInput = styled(FormControl)`
  width: 100%;
  height: 24px;
  display: inline-block;
`;

// TODO: take size parameter (flex ratio)
export const InputWrapper = styled.span.attrs({
  flex: props => props.flex || '0 0 490px',
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

// NEXT: pass props to styled component (inputwrapper's width)
