import { AbstractFactory } from './AbstractFactory.js';
import { DIFactory } from './DIFactory.js';
import { DISubject } from './DISubject.js';

const NoInstance = Symbol('@tkustov/dif:SingletonFactory::NoValue');

export class SingletonFactory<S extends DISubject>
  extends AbstractFactory<S>
  implements DIFactory<ReturnType<S>>
{
  private instance: ReturnType<S> | typeof NoInstance = NoInstance;

  create(): ReturnType<S> {
    if (this.instance !== NoInstance) {
      return this.instance;
    }
    const instance = this.resolveInstance();
    this.instance = instance;
    return instance;
  }
}
