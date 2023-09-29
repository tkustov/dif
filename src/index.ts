import { DIDepsBuilder } from './DIDepsBuilder.js';
import { DIFactories, DIFactory } from './DIFactory.js';
import { DISubject } from './DISubject.js';
import { DIScope, DIScopes } from './DIScope.js';
import { createDIDepsProxy, DIDepsProxy } from './DIDepsProxy.js';

interface Ctor {
  new (...args: any[]): any;
}

function ctor<C extends Ctor>(
  subject: C,
  scope: DIScope
): DIDepsProxy<(...args: ConstructorParameters<C>) => InstanceType<C>> {
  type Subject = (...args: ConstructorParameters<C>) => InstanceType<C>;
  const builder = new DIDepsBuilder<Subject>((...args) => new subject(...args), scope);
  const proxy = createDIDepsProxy(builder);
  return proxy;
}

function factory<F extends DISubject>(
  subject: F,
  scope: DIScope
): DIDepsProxy<F> {
  const builder = new DIDepsBuilder(subject, scope);
  const proxy = createDIDepsProxy(builder);
  return proxy;
}

function value<V extends unknown>(value: V): DIFactory<V> {
  return {
    create(): V {
      return value;
    }
  };
}

function derive<V, R>(subject: DIFactory<V>, deriveFn: (subject: V) => R): DIFactory<R> {
  return {
    create(): R {
      const instance = subject.create();
      const derived = deriveFn(instance);
      return derived;
    }
  };
}

function compose<V extends [...DIFactory<any>[]], R>(
  subjects: [...V],
  composeFn: (...subject: { [K in keyof V]: V[K] extends DIFactory<infer S> ? S : V[K]; }) => R
): DIFactory<R> {
  return {
    create(): R {
      const instances = subjects.map(subject => subject.create());
      // @ts-ignore
      const composed = composeFn(...instances);
      return composed;
    }
  };
}

export type { DIFactory };

export const Singleton = DIScopes.Singleton;
export const Transient = DIScopes.Transient;

export const dif = {
  scopes: DIScopes,
  ctor,
  factory,
  value,
  derive,
  compose
};
