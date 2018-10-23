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

const StyledFormViewWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  width: 960px;
`;

const StyledTitleWrapper = styled.div`
  align-items: center;
  color: #37454a;
  display: flex;
  font-size: 32px;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;
`;

const StyledSectionWrapper = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  width: 100%;
  border: solid 1px #e1e1eb;
`;

export {
  StyledFormWrapper,
  StyledFormViewWrapper,
  StyledSectionWrapper,
  StyledTitleWrapper
};
