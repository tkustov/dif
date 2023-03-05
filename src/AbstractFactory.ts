import { DIFactory } from './DIFactory.js';
import { DISubject } from './DISubject.js';

export abstract class AbstractFactory<S extends DISubject> {
  constructor(
    private subject: S,
    private args?: DIFactory<any>[],
    private methods?: Record<PropertyKey, DIFactory<any>[]>,
    private props?: Record<PropertyKey, DIFactory<any>>
  ) { }

  protected resolveInstance(): ReturnType<S> {
    const args = this.args?.map(factory => factory.create()) ?? [];
    const instance = this.subject(...args);
    if (this.methods) {
      for (const [name, args] of Object.entries(this.methods)) {
        instance[name](...args.map(factory => factory.create()));
      }
    }
    if (this.props) {
      for (const [name, value] of Object.entries(this.props)) {
        instance[name] = value.create();
      }
    }
    return instance;
  }
}
