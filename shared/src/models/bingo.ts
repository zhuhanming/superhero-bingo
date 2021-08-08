import {
  CreatedSuperpower,
  Superpower,
  UpdatedSuperpower,
  validateSuperpower,
} from './superpower';

// Type used for storage on frontend during initial create
export type Bingo = {
  name: string;
  superpowers: Superpower[];
};

export type CreatedBingo = Omit<Bingo, 'superpowers'> & {
  id: number;
  ownerCode: string;
  superpowers: CreatedSuperpower[];
};

// Type used for storage on frontend after initial create
export type UpdatedBingo = Omit<CreatedBingo, 'superpowers'> & {
  superpowers: UpdatedSuperpower[];
};

export const validateBingo = (
  bingo: Bingo | CreatedBingo | UpdatedBingo
): void => {
  if (bingo.name.length <= 0) {
    throw new Error('Bingo name cannot be empty!');
  }
  bingo.superpowers.forEach(validateSuperpower);
  const orders = new Set(bingo.superpowers.map((s) => s.order));
  for (let i = 0; i < bingo.superpowers.length; i++) {
    if (!orders.has(i)) {
      throw new Error('Superpower orders are invalid!');
    }
  }
  const descriptions = new Set(bingo.superpowers.map((s) => s.description));
  if (descriptions.size !== bingo.superpowers.length) {
    throw new Error('Superpower descriptions must be unique!');
  }
};
