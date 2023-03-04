import { DIDepsBuilder } from './DIDepsBuilder'
import { DIFactories } from './DIFactory';
import { DISubject } from './DISubject'

export type DIDepsProxy<S extends DISubject, I = ReturnType<S>> = DIDepsBuilder<S, I> & {
  [K in keyof I]: (
    I[K] extends (...args: infer A) => any
      ? (...args: DIFactories<A>) => DIDepsProxy<S>
      : never
  );
};

export function createDIDepsProxy<S extends DISubject, I extends ReturnType<S>>(
  builder: DIDepsBuilder<S, I>
): DIDepsProxy<S, I> {
  const proxy: unknown = new Proxy(builder, {
    get(target, prop) {
      if (
        prop === 'args'
        || prop === 'method'
        || prop === 'prop'
      ) {
        return (...args: any[]): DIDepsProxy<S, I> => {
          // @ts-ignore
          target[prop](...args);
          return proxy as DIDepsProxy<S, I>;
        };
      }
      if (prop === 'end') {
        return target.end.bind(target);
      }
      return (...args: any[]): DIDepsProxy<S, I> => {
        // @ts-ignore
        target.method(prop, ...args);
        return proxy as DIDepsProxy<S, I>;
      };
    }
  });
  return proxy as DIDepsProxy<S, I>;
}
