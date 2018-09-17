import React from 'react';
import PropTypes from 'prop-types';
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
});

const NavButton = styled(Button).attrs({
  type: 'button'
})`
  margin: 0 15px;
`;

const FormNav = ({
  handlePageChange,
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
      <SubmitButton mode="primary">
        Submit
      </SubmitButton>
    </NavWrapper>
  );

  if (submit) {
    return renderSubmit();
  }

  return renderNav();
};

FormNav.defaultProps = {
  prevPath: '',
  nextPath: '',
  submit: false
};

FormNav.propTypes = {
  prevPath: PropTypes.string,
  nextPath: PropTypes.string,
  submit: PropTypes.bool,
  handlePageChange: PropTypes.func.isRequired
};

export default FormNav;
