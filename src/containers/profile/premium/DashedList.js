import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

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
`;

export default DashedList;
