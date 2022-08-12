import { DIFactory, Factorize, Subject } from './Types';

export class Transient<S extends Subject> implements DIFactory<S> {
  constructor(
    private subject: S,
    private ctorParams: Factorize<ConstructorParameters<S>> | undefined,
    private methods: Map<PropertyKey, DIFactory<any>>
  ) { }

  create(): InstanceType<S> {
    const args = Array.isArray(this.ctorParams) ? this.ctorParams.map(f => f.create()) : [];
    const instance = new this.subject(...args);
    for (const [method, factory] of this.methods.entries()) {
      instance[method](factory.create());
    }
    return instance;
  }
}
