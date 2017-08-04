import styled, { injectGlobal } from 'styled-components';
import { ControlLabel, FormControl } from 'react-bootstrap';

export const Row = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: start;
  margin-bottom: 16px;
`;


export const Label = styled(ControlLabel)`
  margin-right: 6px;
  color: #37454A;
`;

export const TextInput = styled(FormControl)`
  margin-top: 6px;
  width: 100%;
`;

export const SingleSelectInput = styled.span`
  margin-right: 6px;
`;

// TODO: take size parameter (flex ratio)
export const InputWrapper = styled.span`
  margin-right: 30px;
  display: inline-block;
  flex: 1 0 0;
  -webkit-box-flex: 1 0 0;
  -webkit-flex: 1 0 0;
  -ms-flex: 1 0 0;
`;


export const SelectInput = styled(FormControl)`
  margin-right: 20px;
`;
