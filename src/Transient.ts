import { DIFactory, Factorize, Subject } from './Types';

export class Transient<S extends Subject> implements DIFactory<S> {
  constructor(
    private subject: S,
    private ctorParams: Factorize<ConstructorParameters<S>>,
    private methods: Map<PropertyKey, DIFactory<any>>
  ) { }

  create(): InstanceType<S> {
    // @ts-ignore
    const args = this.ctorParams?.map(f => f.create()) ?? [];
    const instance = new this.subject(...args);
    for (const [method, factory] of this.methods.entries()) {
      instance[method](factory.create());
    }
    return instance;
  }
}
