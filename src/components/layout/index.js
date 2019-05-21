import styled from 'styled-components';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

export const ContentContainerOuterWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: center;
  margin: 0;
  padding: 0;
  position: relative;
`;

export const ContentContainerInnerWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_WIDTH}px;
  padding: 30px;
`;
