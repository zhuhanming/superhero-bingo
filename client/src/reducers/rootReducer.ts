import { combineReducers } from 'redux';

import bingo, { BingoDux } from './bingoDux';
import game, { GameDux } from './gameDux';
import misc, { MiscDux } from './miscDux';

export interface RootState {
  bingo: BingoDux;
  game: GameDux;
  misc: MiscDux;
}

const rootReducer = combineReducers({ bingo, game, misc });

export default rootReducer;
