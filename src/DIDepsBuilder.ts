import { DIFactories, DIFactory } from './DIFactory';
import { DIScope, DIScopes } from './DIScope';
import { DISubject } from './DISubject';
import { SingletonFactory } from './SingletonFactory';
import { TransientFactory } from './TransientFactory';

type MethodParams<S, M extends keyof S> = S[M] extends (...args: infer A) => any ? DIFactories<A> : never[];

export class DIDepsBuilder<Subject extends DISubject, I = ReturnType<Subject>> {
  private depArgs?: [...DIFactory<any>[]];
  private depMethods: Record<PropertyKey, DIFactory<any>[]> = {};
  private depProps: Record<PropertyKey, DIFactory<any>> = {};

  constructor(
    private subject: Subject,
    private scope: DIScope
  ) { }

  args<Args extends DIFactories<Parameters<Subject>>>(...argFactories: Args): this {
    this.depArgs = argFactories;
    return this;
  }

  method<M extends keyof I, Args extends MethodParams<I, M>>(name: M, ...args: Args): this {
    this.depMethods[name] = args;
    return this;
  }

  prop<P extends keyof I>(name: P, valueFactory: DIFactory<I[P]>): this {
    this.depProps[name] = valueFactory;
    return this;
  }

  end(): DIFactory<ReturnType<Subject>> {
    const methods = Object.keys(this.depMethods).length > 0 ? this.depMethods : undefined;
    const props = Object.keys(this.depProps).length > 0 ? this.depProps : undefined;
    switch (this.scope) {
      case DIScopes.Singleton:
        return new SingletonFactory(this.subject, this.depArgs, methods, props);
      case DIScopes.Transient:
        return new TransientFactory(this.subject, this.depArgs, methods, props);
    }
  }
}
