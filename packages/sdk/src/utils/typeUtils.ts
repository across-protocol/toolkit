export type MakeOptional<T extends object, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type NoNullValuesOfObject<T extends object> = {
  [Property in keyof T]-?: NonNullable<T[Property]>;
};
