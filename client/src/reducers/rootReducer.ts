import { combineReducers } from 'redux';

import bingo, { BingoDux } from './bingoDux';

export interface RootState {
  bingo: BingoDux;
}

const rootReducer = combineReducers({ bingo });

export default rootReducer;
