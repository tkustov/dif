import { Subject, DIFactory, Factorize, DIConfig, DIFactoryCtor } from './Types';

export class DIConfigBuilder<S extends Subject> implements DIConfig<S> {
  private ctorFactories?: Factorize<ConstructorParameters<S>>;
  private methods: Map<PropertyKey, DIFactory<any>> = new Map();

  constructor(
    private subject: S,
    private subjectFactory: DIFactoryCtor<S>
  ) { }

  ctor<A extends Factorize<ConstructorParameters<S>>>(
    ...factories: A extends any[] ? A : never
  ): this {
    this.ctorFactories = factories;
    return this;
  }

  method<M extends (keyof InstanceType<S>)>(
    name: M,
    factory: (
      InstanceType<S>[M] extends (dep: any) => void
      ? DIFactory<Parameters<InstanceType<S>[M]>[0]>
      : never
    )
  ): this {
    this.methods.set(name, factory);
    return this;
  }

  complete(): DIFactory<InstanceType<S>> {
    const factory = new this.subjectFactory(
      this.subject,
      // @ts-ignore
      this.ctorFactories,
      this.methods
    );
    return factory;
  }
}
