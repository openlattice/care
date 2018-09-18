/*
 * @flow
 */

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRALS, WHITE } = Colors;

/**
 * @deprecated
 */
const StyledCard = styled.div`
  background-color: ${WHITE};
  border: 1px solid ${NEUTRALS[4]};
  border-radius: 4px;
  box-shadow: 0 2px 8px -2px rgba(17, 51, 85, 0.15);
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  padding: 30px;
  position: relative;
`;

export default StyledCard;
