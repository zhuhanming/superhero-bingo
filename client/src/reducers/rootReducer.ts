import { combineReducers } from 'redux';

import bingo, { BingoDux } from './bingoDux';
import game, { GameDux } from './gameDux';
import misc, { MiscDux } from './miscDux';
import owner, { OwnerDux } from './ownerDux';

export interface RootState {
  bingo: BingoDux;
  game: GameDux;
  misc: MiscDux;
  owner: OwnerDux;
}

const rootReducer = combineReducers({ bingo, game, misc, owner });

export default rootReducer;
