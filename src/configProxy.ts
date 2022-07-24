import { DIConfig, DIConfigProxied, Subject } from './Types';

export function createConfigProxy<S extends Subject>(
  configBuilder: DIConfig<S>
  // @ts-ignore
): DIConfigProxied<S> {
  const proxy = new Proxy(configBuilder, {
    get(target, prop) {
      if (
        prop === 'ctor'
        || prop === 'method'
      ) {
        return (...args: any[]): DIConfigProxied<S> => {
          // @ts-ignore
          target[prop](...args);
          // @ts-ignore
          return proxy;
        };
      }
      if (prop === 'complete') {
        return target.complete.bind(target);
      }
      return (dep: any): DIConfigProxied<S> => {
        target.method(prop, dep);
        // @ts-ignore
        return proxy;
      }
    }
  });
  // @ts-ignore
  return proxy;
}
