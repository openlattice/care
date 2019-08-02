// @flow

import { combineReducers } from 'redux-immutable';

import appearance from './AppearanceReducer';
import basics from './BasicsReducer';

const basicInformationReducer = combineReducers({
  appearance,
  basics,
});

export default basicInformationReducer;
