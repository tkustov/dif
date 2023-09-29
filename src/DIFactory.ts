export type FactoryCtx = Record<PropertyKey, any>;

export interface DIFactory<Value, Ctx extends FactoryCtx> {
  create(ctx?: Ctx): Value;
}

export type DIFactories<P extends [...any[]], Ctx extends FactoryCtx> = any[] & {
  [K in Exclude<keyof P, keyof never[]>]: DIFactory<P[K], Ctx>;
};
