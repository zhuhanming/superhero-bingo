import { Superhero } from './superhero';

export type Leaderboard = {
  [id: number]: number;
};

export type SuperheroResult = {
  superhero: Superhero;
  timeWhenLastPowerInOwnBingoWasSigned?: Date; // undefined if no power signed
  numPowersInOwnBingoSigned: number;
  numPowersInOthersBingoSigned: number;
  numDifferentPowersInOthersBingoSigned: number;
};
