import React from 'react';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

const NavWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
`;

const SubmitButton = styled(Button).attrs({
  type: 'submit'
})`
  margin: 0;
`;

const NavButton = styled(Button).attrs({
  type: 'button'
})`
  margin: 0 15px;
`;

const FormNav = ({
  handlePageChange,
  handleSubmit,
  nextPath,
  prevPath,
  submit
}) => {

  const onClickPrev = () => {
    handlePageChange(prevPath);
  };

  const onClickNext = () => {
    handlePageChange(nextPath);
  };

  const renderNav = () => (
    <NavWrapper>
      {
        prevPath && prevPath.length
          ? (
            <NavButton onClick={onClickPrev}>
              Prev
            </NavButton>
          )
          : null
      }
      {
        nextPath && nextPath.length
          ? (
            <NavButton onClick={onClickNext}>
              Next
            </NavButton>
          )
          : null
      }
    </NavWrapper>
  );

  const renderSubmit = () => (
    <NavWrapper>
      <SubmitButton mode="primary" onClick={handleSubmit}>
        Submit
      </SubmitButton>
    </NavWrapper>
  );

  if (submit) {
    return renderSubmit();
  }

  return renderNav();
};

export default FormNav;
