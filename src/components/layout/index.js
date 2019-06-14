import styled from 'styled-components';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

export const ContentOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  align-self: center;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_WIDTH}px;
  padding: 30px;
  width: 100vw;
`;
