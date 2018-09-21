import styled from 'styled-components';
import { ControlLabel, Checkbox, Radio, Button, Row } from 'react-bootstrap';


export const Page = styled.div`
  background: #393f46;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 100%;
`;

export const PageHeader = styled.div`
  align-items: center;
  background: white;
  border-bottom: 1px solid darkgray;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  margin-bottom: 100px;
  padding: 20px 55px;
  width: 100%;
`;

export const TitleWrapper = styled.span`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const Title = styled.h1`
  color: #37454a;
  font-size: 20px;
  font-weight: bold;
`;

export const FormWrapper = styled.div`
  padding: 60px;
  width: 900px;
  margin-bottom: 100px;
  background: #f4f4f4;
`;

export const PaddedRow = styled(Row)`
  margin-bottom: 38px;
`;

export const Label = styled(ControlLabel)`
  color: #37454a;
  font-size: 16px;
`;

export const TitleLabel = Label.extend`
  display: block;
  line-height: 1.5;
`;

export const LabelDescription = Label.extend`
  color: light-gray;
  font-size: 12px;
`;

export const OtherWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const InlineCheckbox = styled(Checkbox)`
  font-size: 16px;
  margin-right: 12px;
  margin-bottom: 10px;
  margin-left: 0 !important;
`;

export const InlineRadio = styled(Radio)`
  font-size: 16px;
`;

export const ButtonWrapper = styled.div`
  text-align: center;
`;

export const SubmitButtonWrapper = ButtonWrapper.extend`
  padding-top: 80px;
  width: 1520px;
`;

export const SubmitButton = styled(Button).attrs({
  type: (props) => {
    return props.type || 'submit';
  }
})``;

export const SectionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  width: 100%;
`;

export const SectionHeader = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  color: #37454a;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const NavBtnWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 300px;
  text-align: center;
`;

export const StyledButton = styled(Button)`
  margin: 0 10px;
`;

export const ErrorMessage = styled.div`
  color: rgb(169, 68, 66);
`;

export const ContainerOuterWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

export const ContainerInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  margin-top: 50px;
  width: 900px;
`;
