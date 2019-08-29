// @flow

import { combineReducers } from 'redux-immutable';

import address from './AddressReducer';
import appearance from './AppearanceReducer';
import basics from './BasicsReducer';
import photos from './PhotosReducer';

const basicInformationReducer = combineReducers({
  address,
  appearance,
  basics,
  photos,
});

export default basicInformationReducer;
