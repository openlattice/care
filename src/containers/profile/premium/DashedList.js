// @flow
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { behaviorItemSkeleton } from '../../../components/skeletons';

const { NEUTRALS } = Colors;

type Props = {
  isLoading :boolean
};

const loadingSkeletonStyles = ({ isLoading } :Props) => (isLoading
  ? behaviorItemSkeleton
  : null
);


const DashedList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  > div {
    border-bottom: 1px dashed ${NEUTRALS[4]};
  }

  > div:last-child {
    border-bottom: 0;
  }

  ${loadingSkeletonStyles}
`;

export default DashedList;
