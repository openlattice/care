/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import { NavBtnWrapper, StyledButton, SubmitButton } from '../shared/Layout';


const FormNav = ({prevPath, nextPath, submit, handlePageChange}) => {

  const renderNav = () => {
    return (
      <NavBtnWrapper> 
        {prevPath && prevPath.length ? <StyledButton onClick={() => handlePageChange(prevPath)}>Prev</StyledButton> : null}
        {nextPath && nextPath.length ? <StyledButton onClick={() => handlePageChange(nextPath)}>Next</StyledButton> : null}
      </NavBtnWrapper>
    );
  }

  const renderSubmit = () => {
    return (
      <NavBtnWrapper> 
        <SubmitButton>Submit</SubmitButton>
      </NavBtnWrapper>
    );
  }

  return (
    <NavBtnWrapper> 
      { submit ? renderSubmit() : renderNav() }
    </NavBtnWrapper>
  );
};

FormNav.propTypes = {
  prevPath: PropTypes.string,
  nextPath: PropTypes.string,
  submit: PropTypes.bool,
  handlePageChange: PropTypes.func
};

export default FormNav;
