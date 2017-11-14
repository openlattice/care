import React from 'react';
import { ErrorMessage } from '../shared/Layout';
import { bootstrapValidation, validateRequiredInput } from '../shared/Validation';
import { FORM_PATHS, FORM_ERRORS } from '../shared/Consts';

export const setDidClickNav = () => {
  return {
    didClickNav: true
  };
};

export const setRequiredErrors = (state, props) => {
  const requiredErrors = state.sectionRequiredErrors.slice();
  const areRequiredInputsValid = validateRequiredInput(
    props.input,
    state.requiredFields
  );

  if (areRequiredInputsValid) {
    if (requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED) !== -1) {
      requiredErrors.splice(requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED));
    }
  }
  else if (requiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED) === -1) {
    requiredErrors.push(FORM_ERRORS.IS_REQUIRED);
  }

  return {
    sectionRequiredErrors: requiredErrors
  };
}

export const renderErrors = (sectionFormatErrors, sectionRequiredErrors, didClickNav) => {
    const formatErrors = sectionFormatErrors.map((error) => {
      return <ErrorMessage key={error}>{error}</ErrorMessage>;
    });
    let requiredErrors = [];
    if (didClickNav) {
      requiredErrors = sectionRequiredErrors.map((error) => {
        return <ErrorMessage key={error}>{error}</ErrorMessage>;
      });
    }

    return (
      <div>
        {formatErrors}
        {requiredErrors}
      </div>
    );
  }
