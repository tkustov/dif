export const DIScopes = {
  Singleton: 'singleton',
  Transient: 'transient'
} as const;

export type DIScope = (typeof DIScopes)[keyof typeof DIScopes];
