import validator from 'validator';

import { FORM_ERRORS } from './Consts';

// Used for bootstrap input components. If error, input will show in red.
export const bootstrapValidation = (input, valid, required, didClickNav) => {
  // If input is required, show error ONLY after user has tried to change page
  if (required && input.length < 1 && didClickNav) return 'error';

  // Show error if there is input and it is invalid
  if (input && input.length && !valid) return 'error';

  return null;
};

// Called in handleTextInput fn
export const validateOnInput = (
  name,
  input,
  fieldType,
  sectionFormatErrors,
  setErrorsFn
) => {
  let inputValid = true;
  const formatErrors = sectionFormatErrors.slice();

  switch (fieldType) {
    case 'number': {
      const idx = formatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      if (input && !validator.isInt(input)) {
        inputValid = false;
        if (idx === -1) {
          formatErrors.push(FORM_ERRORS.INVALID_FORMAT);
        }
      }
      else {
        inputValid = true;
        if (idx !== -1) {
          formatErrors.splice(idx);
        }
      }
      break;
    }
    default:
      break;
  }

  setErrorsFn(name, inputValid, formatErrors);
};

// Called in handlePageChange fn
export const validateRequiredInput = (input, requiredFields) => {
  return requiredFields.every((element) => {
    return input[element].length >= 1;
  });
};
