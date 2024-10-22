export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export type Compute<type> = { [key in keyof type]: type[key] } & unknown;
