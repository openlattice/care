import { isNonEmptyString } from '../../../utils/LangUtils';

// @flow
const formatCityStateZip = (city ? :string, state ? :string, zip ? :string) => {
  let addressLine3 = '';
  if (isNonEmptyString(city)) {
    addressLine3 += city;
    if (isNonEmptyString(state)) {
      addressLine3 += `, ${state} `;
    }
  }
  else if (isNonEmptyString(state)) {
    addressLine3 += `${state} `;
  }

  if (isNonEmptyString(zip)) addressLine3 += zip;

  return addressLine3;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  formatCityStateZip
};
