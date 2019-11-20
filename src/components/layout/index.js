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
  ${(props) => (props.isLoading ? bulletsSkeleton : null)};
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

  ${(props) => (props.isLoading ? behaviorItemSkeleton : null)};
`;

export const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

export const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 10px;
`;

export const HeaderActions = styled.div`
  display: flex;
  margin-left: auto;
`;
