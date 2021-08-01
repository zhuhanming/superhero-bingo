// Type used for storage on frontend during initial create
export type Superpower = {
  description: string;
  order: number;
};

export type CreatedSuperpower = Superpower & {
  id: number;
};

// Type used for storage on frontend
export type UpdatedSuperpower = Superpower & {
  id?: number;
};

export const validateSuperpower = (
  superpower: Superpower | CreatedSuperpower | UpdatedSuperpower
): void => {
  if (superpower.description.length <= 0) {
    throw new Error('Superpower description cannot be empty!');
  }
  if (superpower.order < 0) {
    throw new Error('Superpower order cannot be negative!');
  }
};
