export function sortByOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}
