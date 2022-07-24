export type DIFactory<S> = {
  create(): S;
};

export type DIFactoryCtor<S extends Subject> = {
  new (
    subject: S,
    ctorParams: Factorize<ConstructorParameters<S>>,
    methods: Map<PropertyKey, DIFactory<any>>
  ): DIFactory<InstanceType<S>>;
}

export type DIConfig<S extends Subject> = {
  ctor<A extends Factorize<ConstructorParameters<S>>>(
    ...factories: A extends any[] ? A : never
  ): DIConfig<S>;

  method<M extends (keyof InstanceType<S>)>(
    name: M,
    factory: (
      InstanceType<S>[M] extends (dep: any) => void
        ? DIFactory<Parameters<InstanceType<S>[M]>[0]>
        : never
    )
  ): DIConfig<S>;

  complete(): DIFactory<InstanceType<S>>;
};

export type DIConfigProxied<S extends Subject> = {
  ctor<A extends Factorize<ConstructorParameters<S>>>(
    ...factories: A extends any[] ? A : never
  ): DIConfig<S> & SubjectMethodsProxy<S>;

  method<M extends (keyof InstanceType<S>)>(
    name: M,
    factory: (
      InstanceType<S>[M] extends (dep: any) => void
        ? DIFactory<Parameters<InstanceType<S>[M]>[0]>
        : never
    )
  ): DIConfig<S> & SubjectMethodsProxy<S>;

  complete(): DIFactory<InstanceType<S>>;
} & SubjectMethodsProxy<S>;

type SubjectMethodsProxy<S extends Subject> = {
  [M in (keyof InstanceType<S>)]: (
    InstanceType<S>[M] extends (dep: any) => void
      ? (dep: DIFactory<Parameters<InstanceType<S>[M]>[0]>) => DIConfigProxied<S>
      : never
  );
}

export type Subject = new (...args: any) => any;

export type Factorize<A extends any[]> = {
  [K in (keyof A)]: DIFactory<A[K]>;
};
