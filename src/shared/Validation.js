import { FORM_ERRORS } from './Consts';


export const bootstrapValidation = (component, name, required) => {
  const inputValid = component.state[`${name}Valid`];
  const input = component.props.input[name];
  // If input is required, show error ONLY after user has tried to navigate to next/prev section
  if (required && input.length < 1 && component.state.didClickNav) return 'error';
  // Show error if there is input and it is invalid
  if (input && input.length && !inputValid) return 'error';
  // TODO: CHECK THAT THIS IS REQUIRED conditional
  // If input format is invalid, show error
  if (!inputValid && component.state.didClickNav) return 'error';
};

export const validateOnInput = (component, input, name, fieldType, requiredFields) => {
  const validStateKey = `${name}Valid`;
  let inputValid = component.state[validStateKey];
  let sectionFormatErrors = component.state.sectionFormatErrors.slice();
  let sectionRequiredErrors = component.state.sectionRequiredErrors.slice();

  switch(fieldType) {
    case 'number':
      const idx = sectionFormatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      // console.log('idx:', idx);
      if (input && isNaN(input)) {
        inputValid = false;
        if (idx === -1) {
          sectionFormatErrors.push(FORM_ERRORS.INVALID_FORMAT);
        }
      } else {
        inputValid = true;
        if (idx !== -1) {
          sectionFormatErrors.splice(idx);
        }
      }
      break;
    default:
      break;
  }

  component.setState({
    sectionFormatErrors,
    sectionRequiredErrors,
    [validStateKey]: inputValid
  });
};

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
    } else {
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
