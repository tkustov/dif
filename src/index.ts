import { DIDepsBuilder } from './DIDepsBuilder';
import { DIFactory } from './DIFactory';
import { DISubject } from './DISubject';
import { DIScope, DIScopes } from './DIScope';
import { createDIDepsProxy, DIDepsProxy } from './DIDepsProxy';

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

export const Singleton = DIScopes.Singleton;
export const Transient = DIScopes.Transient;

export const dif = {
  scopes: DIScopes,
  ctor,
  factory,
  value,
};
