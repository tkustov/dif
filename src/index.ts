import { createConfigProxy } from './configProxy';
import { DIConfigBuilder } from './DIConfigBuilder';
import { Singleton } from './Sigleton';
import { Transient } from './Transient';
import { DIConfigProxied, DIFactory, Subject } from './Types';

export const dif = {
  Singleton<S extends Subject>(subject: S): DIConfigProxied<S> {
    const builder = new DIConfigBuilder(subject, Singleton);
    const proxied = createConfigProxy(builder);
    return proxied;
  },
  Transient<S extends Subject>(subject: S): DIConfigProxied<S> {
    const builder = new DIConfigBuilder(subject, Transient);
    const proxied = createConfigProxy(builder);
    return proxied;
  },
  Const<T>(value: T): DIFactory<T> {
    return {
      create() {
        return value;
      }
    };
  },
  Derive<S, R>(
    factory: DIFactory<S>,
    mapper: (subject: S) => R
  ): DIFactory<R> {
    return {
      create() {
        const subject = factory.create();
        const derived = mapper(subject);
        return derived;
      }
    };
  }
};
