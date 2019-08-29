import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';
import { bulletsSkeleton, behaviorItemSkeleton } from '../skeletons';

const { NEUTRALS } = Colors;

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

export const UL = styled.ul`
  padding-inline-start: 20px;
  ${props => (props.isLoading ? bulletsSkeleton : null)};
`;

export const DashedList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  > div {
    border-bottom: 1px dashed ${NEUTRALS[4]};
  }

  > div:last-child {
    border-bottom: 0;
  }

  ${props => (props.isLoading ? behaviorItemSkeleton : null)};
`;
