import { DIConfigBuilder } from './DIConfigBuilder';
import { createConfigProxy } from './configProxy';
import { Singleton } from './Sigleton';
import { Transient } from './Transient';
import { DIConfig, DIConfigProxied, DIFactory, Subject } from './Types';

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
  AsIs<T>(value: T): DIFactory<T> {
    return {
      create() {
        return value;
      }
    };
  }
};
