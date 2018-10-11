import styled from 'styled-components';
import { Button, Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const FormGridWrapper = styled.div`
  color: ${NEUTRALS[0]};
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr;
  position: relative;

  h1 {
    font-size: 32px;
    font-weight: normal;
    margin: 0;
    text-align: center;
  }

  label {
    font-size: 14px;
    font-weight: normal;
    margin-right: 20px;
  }

  label input {
    margin-right: 5px;
  }
`;

const FullWidthItem = styled.div`
  grid-column: span 2;
`;

const HalfWidthItem = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 1;
`;

const FlexyWrapper = styled.div`
  display: flex;
  flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
`;

const EditButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;

export {
  EditButton,
  FlexyWrapper,
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
};
