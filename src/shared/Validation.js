import { FORM_ERRORS } from './Consts';


export const bootstrapValidation = (component, name, required) => {
  const inputValid = component.state[`${name}Valid`];
  const input = component.props.input[name];
  // If required, show error for invalid input only if user has tried to navigate to next/prev section
  if (!inputValid && component.state.didClickNav || required && input.length < 1 && component.state.didClickNav) return 'error';
  // Show error if there is input and it is invalid 
  if (input && input.length && !inputValid) return 'error';
}

export const validateOnInput = (component, input, name, fieldType, requiredFields) => {
  const validStateKey = `${name}Valid`;
  let inputValid = component.state[validStateKey];
  let sectionFormatErrors = component.state.sectionFormatErrors.slice();
  let sectionRequiredErrors = component.state.sectionRequiredErrors.slice();

  switch(fieldType) {
    case 'number':
      const idx = sectionFormatErrors.indexOf(FORM_ERRORS.INVALID_FORMAT);
      console.log('idx:', idx);
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

  let allRequiredFieldsAreValid = true;
  if (requiredFields.indexOf(name) !== -1) {
    const idx = sectionRequiredErrors.indexOf(FORM_ERRORS.IS_REQUIRED);
    if (!input) {
      if (idx === -1) {
        sectionRequiredErrors.push(FORM_ERRORS.IS_REQUIRED);
      }
      inputValid = false;
    } else {
      requiredFields.forEach((name) => {
        const valid = component.state[`${name}Valid`];
        if (!valid) {
          allRequiredFieldsAreValid = false;
          return;
        };
      });
      if (allRequiredFieldsAreValid) {
        sectionRequiredErrors.splice(idx);
      }
    }
  }

  component.setState({
    sectionFormatErrors,
    sectionRequiredErrors,
    [validStateKey]: inputValid
  }, () => {
    if (allRequiredFieldsAreValid && !component.state.sectionFormatErrors.length) {
      component.setState({ sectionValid: true });
    } else {
      component.setState({ sectionValid: false });
    }
  });
}
