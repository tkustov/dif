import { DIFactory, FactoryInstances } from './Types';

export function instantFactories<F extends DIFactory<any>[]>(factories: [...F]): FactoryInstances<F> {
  const instances: unknown = factories.map(<V>(factory: DIFactory<V>): V => factory.create());
  return instances as FactoryInstances<F>;
}
