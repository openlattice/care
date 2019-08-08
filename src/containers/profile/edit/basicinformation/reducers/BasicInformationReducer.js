// @flow

import { combineReducers } from 'redux-immutable';

import appearance from './AppearanceReducer';
import basics from './BasicsReducer';
import address from './AddressReducer';

const basicInformationReducer = combineReducers({
  address,
  appearance,
  basics,
});

export default basicInformationReducer;
