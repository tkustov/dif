import { DIDepsBuilder } from './DIDepsBuilder.js';
import { DIFactory } from './DIFactory.js';
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

function value<V extends unknown>(value: V): DIFactory<V, {}> {
  return {
    create(): V {
      return value;
    }
  };
}

function param<V, K extends PropertyKey>(paramName: K): DIFactory<V, { [P in K]: V }> {
  return {
    create(ctx?: { [P in K]: V }): V {
      if (!ctx) {
        throw new TypeError(`Create context expected to be object w/ property "${String(paramName)}"`);
      }
      return ctx[paramName];
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
  param,
};
