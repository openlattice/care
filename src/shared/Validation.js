
export const getRequiredValidation = (value) => {
  // if (arguments.length > 1) {
  //   const extraValidations = arguments.slice(1);
  //   extraValidations
  // }
  if (value && value.length > 0) return 'success';
  else return 'error';
}

export const getNumberValidation = (value) => {
  if (value && isNaN(value)) return 'error';
}

// TODO: make sure date isn't in the future
export const getDateValidation = (value) => {

}
