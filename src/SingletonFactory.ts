import { DIFactory } from './DIFactory.js';
import { DISubject } from './DISubject.js';
import { TransientFactory } from './TransientFactory.js';

const NoInstance = Symbol('@tkustov/dif:SingletonFactory::NoValue');

export class SingletonFactory<S extends DISubject>
  extends TransientFactory<S>
  implements DIFactory<ReturnType<S>>
{
  private instance: ReturnType<S> | typeof NoInstance = NoInstance;

  create(): ReturnType<S> {
    if (this.instance !== NoInstance) {
      return this.instance;
    }
    const instance = super.create();
    this.instance = instance;
    return instance;
  }
}
