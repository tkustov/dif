export interface DIFactory<Value> {
  create(): Value;
}

export type DIFactories<P extends [...any[]]> = any[] & {
  [K in Exclude<keyof P, keyof never[]>]: DIFactory<P[K]>;
};
