import { DIFactories, DIFactory } from './DIFactory.js';
import { DIScope, DIScopes } from './DIScope.js';
import { DISubject } from './DISubject.js';
import { InstanceInjection } from './InjectionConfig.js';
import { SingletonFactory } from './SingletonFactory.js';
import { TransientFactory } from './TransientFactory.js';

type MethodParams<S, M extends keyof S> = S[M] extends (...args: infer A) => any ? DIFactories<A, any> : never[];

export class DIDepsBuilder<Subject extends DISubject, I = ReturnType<Subject>> {
  private subjectArgs?: DIFactory<any, any>[];
  private instanceDeps: InstanceInjection[] = [];

  constructor(
    private subject: Subject,
    private scope: DIScope
  ) { }

  args<Args extends DIFactories<Parameters<Subject>, any>>(...argFactories: Args): this {
    this.subjectArgs = argFactories;
    return this;
  }

  method<M extends keyof I, Args extends MethodParams<I, M>>(name: M, ...args: Args): this {
    this.instanceDeps.push({
      type: 'method',
      name,
      factories: args
    });
    return this;
  }

  prop<P extends keyof I>(name: P, valueFactory: DIFactory<I[P], any>): this {
    this.instanceDeps.push({
      type: 'property',
      name,
      factory: valueFactory
    });
    return this;
  }

  end(): DIFactory<ReturnType<Subject>,any> {
    switch (this.scope) {
      case DIScopes.Singleton:
        return new SingletonFactory(this.subject, this.subjectArgs, this.instanceDeps);
      case DIScopes.Transient:
        return new TransientFactory(this.subject, this.subjectArgs, this.instanceDeps);
    }
  }
}
