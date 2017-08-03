import styled, { injectGlobal } from 'styled-components';
import { ControlLabel, FormControl } from 'react-bootstrap';

export const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export const Label = styled(ControlLabel)`
  margin-right: 6px;
  color: #37454A;
`;

export const TextInput = styled(FormControl)`
  margin-right: 20px;
`;

export const RadioInput = styled.div`
  margin-right: 6px;
`;

export const SelectInput = styled(FormControl)`
  margin-right: 20px;
`;
