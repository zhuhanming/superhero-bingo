import { Superhero } from './superhero';

export type Leaderboard = {
  [id: number]: number;
};

export type SuperheroResult = {
  superhero: Superhero;
  timeTakenToGetLastPowerSigned?: number; // undefined if no power signed
  numPowersInOwnBingoSigned: number;
  numPowersInOthersBingoSigned: number;
  numDifferentPowersInOthersBingoSigned: number;
};
