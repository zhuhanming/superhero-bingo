import { SuperheroResult } from 'shared';

export function sortByOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

export function sortByNumPowersSigned(
  a: SuperheroResult,
  b: SuperheroResult
): number {
  return b.numPowersInOthersBingoSigned - a.numPowersInOthersBingoSigned;
}

export function sortByNumUniquePowersSigned(
  a: SuperheroResult,
  b: SuperheroResult
): number {
  return (
    b.numDifferentPowersInOthersBingoSigned -
    a.numDifferentPowersInOthersBingoSigned
  );
}

export function sortByBingoCompletion(
  a: SuperheroResult,
  b: SuperheroResult
): number {
  const compareByNumSignedResult =
    b.numPowersInOwnBingoSigned - a.numPowersInOwnBingoSigned;
  if (compareByNumSignedResult !== 0) {
    return compareByNumSignedResult;
  }
  const aTime = a.timeTakenToGetLastPowerSigned ?? Infinity;
  const bTime = b.timeTakenToGetLastPowerSigned ?? Infinity;

  return aTime - bTime;
}
