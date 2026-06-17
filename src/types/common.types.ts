export type Id = string;
export type EntityBase = {
  id: Id;
  createdAt?: string;
  updatedAt?: string;
};

export type NamedEntity = EntityBase & {
  name?: string;
  title?: string;
  code?: string;
  word?: string;
  email?: string;
  country?: string;
  [key: string]: unknown;
};
