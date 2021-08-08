import { combineReducers } from 'redux';

import bingo, { BingoDux } from './bingoDux';
import misc, { MiscDux } from './miscDux';

export interface RootState {
  bingo: BingoDux;
  misc: MiscDux;
}

const rootReducer = combineReducers({ bingo, misc });

export default rootReducer;
