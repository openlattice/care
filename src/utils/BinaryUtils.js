// @flow
import { isNonEmptyStringArray } from './LangUtils';

const DATA_URL_PREFIX_REGEX = new RegExp(/^data:image\/.*base64,/);

const removeDataUriPrefix = (value :string) => {
  const match = value.match(DATA_URL_PREFIX_REGEX);

  // $FlowFixMe
  if (isNonEmptyStringArray(match) && Array.isArray(match)) {
    const dataUri = match[0];
    return value.slice(dataUri.length);
  }

  return value;
};

const isValidBase64 = (value :string) :boolean => {
  if (typeof value !== 'string') return false;
  try {
    return btoa(atob(value)) === value;
  }
  catch (error) {
    return false;
  }
};

export {
  DATA_URL_PREFIX_REGEX,
  isValidBase64,
  removeDataUriPrefix
};
