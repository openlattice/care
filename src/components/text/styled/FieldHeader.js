/*
 * @flow
 */

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const FieldHeader = styled.span`
  color: ${NEUTRALS[0]};
  display: block;
  font-size: 14px;
  font-weight: normal;
  margin: 0 0 10px 0;
`;

export default FieldHeader;
