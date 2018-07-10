import React from 'react';
import PropTypes from 'prop-types';

import { NavBtnWrapper, StyledButton, SubmitButton } from '../shared/Layout';


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
    <NavBtnWrapper>
      {
        prevPath && prevPath.length
          ? (
            <StyledButton onClick={onClickPrev}>
              Prev
            </StyledButton>
          )
          : null
      }
      {
        nextPath && nextPath.length
          ? (
            <StyledButton onClick={onClickNext}>
              Next
            </StyledButton>
          )
          : null
      }
    </NavBtnWrapper>
  );

  const renderSubmit = () => (
    <NavBtnWrapper>
      <SubmitButton>
        Submit
      </SubmitButton>
    </NavBtnWrapper>
  );

  return (
    <NavBtnWrapper>
      { submit ? renderSubmit() : renderNav() }
    </NavBtnWrapper>
  );
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
