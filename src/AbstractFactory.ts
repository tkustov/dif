import { DIFactory, FactoryCtx } from './DIFactory.js';
import { DISubject } from './DISubject.js';
import { InstanceInjection } from './InjectionConfig.js';

export abstract class AbstractFactory<S extends DISubject> {
  constructor(
    private readonly subject: S,
    private readonly args?: DIFactory<any,any>[],
    private readonly config?: InstanceInjection[]
  ) { }

  protected resolveInstance(ctx?: FactoryCtx): ReturnType<S> {
    const args = this.args?.map(factory => factory.create(ctx)) ?? [];
    const instance = this.subject(...args);
    if (this.config) {
      for (const injection of this.config) {
        if (injection.type === 'property') {
          const { name, factory } = injection;
          instance[name] = factory.create();
        }
        if (injection.type === 'method') {
          const { name, factories } = injection;
          instance[name](...factories.map(f => f.create()));
        }
      }
    }
    return instance;
  }
}
