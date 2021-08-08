import { Superhero } from './superhero';

export type Game = {
  id: number;
  bingoId: number;
  joinCode: string;
  hasStarted: boolean;
  hasEnded: boolean;
  heroes: Superhero[];
};
