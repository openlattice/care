import styled from 'styled-components';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_WIDTH}px;
  padding: 30px;
  width: 100vw;
`;
