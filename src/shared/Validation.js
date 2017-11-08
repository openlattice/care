import { FORM_ERRORS } from './Consts';

// Used for bootstrap input components. If error, input will show in red.
export const bootstrapValidation = (input, valid, required, didClickNav) => {
  // If input is required, show error ONLY after user has tried to navigate to next/prev section
  if (required && input.length < 1 && didClickNav) return 'error';

  // Show error if there is input and it is invalid
  if (input && input.length && !valid) return 'error';

  return null;
};

// Called in handleTextInput fn
export const validateOnInput = (name, input, fieldType, sectionFormatErrors, setErrorsFn) => {
  let inputValid = true;
  sectionFormatErrors = sectionFormatErrors.slice();
  
  switch(fieldType) {
    case 'number':
      const idx = sectionFormatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      if (input && isNaN(input)) {
        inputValid = false;
        if (idx === -1) {
          sectionFormatErrors.push(FORM_ERRORS.INVALID_FORMAT);
        }
      }
      else {
        inputValid = true;
        if (idx !== -1) {
          sectionFormatErrors.splice(idx);
        }
      }
      break;
    default:
      break;
  }

  setErrorsFn(name, inputValid, sectionFormatErrors);
};

// Called in handlePageChange fn
export const validateRequiredInput = (component, requiredFields, cb) => {
  let sectionRequiredErrors = component.state.sectionRequiredErrors.slice();
  let sectionValid = component.state.sectionValid;

  for (var i in requiredFields) {
    const requiredErrorIdx = sectionRequiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED);
    const field = requiredFields[i];
    let value = component.props.input[field];
    if (value.length < 1) {
      sectionValid = false;
      if (requiredErrorIdx === -1) {
        sectionRequiredErrors.push(FORM_ERRORS.IS_REQUIRED);
      }
      break;
    }
    else {
      sectionValid = true;
      if (requiredErrorIdx !== -1) {
        sectionRequiredErrors.splice(requiredErrorIdx);
      }
    }
  }

  component.setState({
    sectionValid,
    sectionRequiredErrors
  }, () => {
    cb();
  });
};
