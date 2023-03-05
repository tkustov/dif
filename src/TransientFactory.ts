import { AbstractFactory } from './AbstractFactory.js';
import { DIFactory } from './DIFactory.js';
import { DISubject } from './DISubject.js';

export class TransientFactory<S extends DISubject>
  extends AbstractFactory<S>
  implements DIFactory<ReturnType<S>>
{
  create(): ReturnType<S> {
    const instance = this.resolveInstance();
    return instance;
  }
}
