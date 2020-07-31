// @flow

import { LangUtils } from 'lattice-utils';
import type { Map } from 'immutable';

import { IMAGE_DATA_FQN } from '../edm/DataModelFqns';

const DATA_URL_PREFIX_REGEX = new RegExp(/^data:image\/.*base64,/);

const { isNonEmptyArray, isNonEmptyString } = LangUtils;

const removeDataUriPrefix = (value :string) => {
  const match = value.match(DATA_URL_PREFIX_REGEX);

  if (isNonEmptyArray(match) && match.every(isNonEmptyString)) {
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

const formatFileSource = (imageData :string, mimeType :string) :string => {
  // if not valid base 64, trust
  if (isValidBase64(imageData)) {
    return `data:${mimeType};base64,${imageData}`;
  }

  if (typeof imageData === 'string') {
    return imageData;
  }

  return '';
};

const getImageDataFromEntity = (imageEntity :Map) => {
  const imageDataValue = imageEntity.getIn([IMAGE_DATA_FQN, 0]);
  return formatFileSource(imageDataValue, 'image/jpg');
};

export {
  DATA_URL_PREFIX_REGEX,
  formatFileSource,
  getImageDataFromEntity,
  isValidBase64,
  removeDataUriPrefix
};
