import validator from 'validator';

import {
  FORM_ERRORS,
  INT_16_MAX_VALUE,
  INT_16_MIN_VALUE,
  INT_64_MAX_VALUE,
  INT_64_MIN_VALUE
} from './Consts';

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
    case 'int16': {
      const idx = formatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      const isValid = validator.isInt(input, {
        max: INT_16_MAX_VALUE,
        min: INT_16_MIN_VALUE
      });

      try {
        if (!isValid) {
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
      }
      catch(err) {
        // do something
      }
      break;
    }

    case 'int64': {
      const idx = formatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      const isValid = validator.isInt(input, {
        max: INT_64_MAX_VALUE,
        min: INT_64_MIN_VALUE
      });

      try {
        if (!isValid) {
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
      }
      catch(err) {
        // do something
      }
      break;
    }

    case 'alphanumeric': {
      const idx = formatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      const isValid = validator.isAlphanumeric(input);

      try {
        if (!isValid) {
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
      }
      catch(err) {
        // do something
      }
      break;
    }

    case 'date': {
      const idx = formatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      const currentDate = (new Date()).toISOString();
      const isValid = validator.isISO8601(input)
        && validator.isBefore(input, currentDate);

      try {
        if (!isValid) {
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
      }
      catch(err) {
        // do something
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
