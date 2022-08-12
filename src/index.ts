import { createConfigProxy } from './configProxy';
import { DIConfigBuilder } from './DIConfigBuilder';
import { instantFactories } from './instantFactories';
import { Singleton as SingletonFactory } from './Sigleton';
import { Transient as TransientFactory } from './Transient';
import { DIConfigProxied, DIFactory, Factorize, FactoryInstances, Subject } from './Types';

export type { DIFactory } from './Types';

/**
 * Creates singleton factory
 * @param subject subject constructor, to create factory for
 * @returns DI config builder
 */
function Singleton<S extends Subject>(subject: S): DIConfigProxied<S> {
  const builder = new DIConfigBuilder(subject, SingletonFactory);
  const proxied = createConfigProxy(builder);
  return proxied;
}

/**
 * Creates transient factory
 * @param subject subject constructor, to create factory for
 * @returns DI config builder
 */
function Transient<S extends Subject>(subject: S): DIConfigProxied<S> {
  const builder = new DIConfigBuilder(subject, TransientFactory);
  const proxied = createConfigProxy(builder);
  return proxied;
}

/**
 * Creates constant value factory
 * @param value - value to return
 * @returns factory, that instantiate value
 */
function Const<T>(value: T): DIFactory<T> {
  return {
    create() {
      return value;
    }
  };
}

const noInstance = Symbol('@tkustov/dif:Memo:noInstance');
/**
 * Creates factory that memoizes value of passed factory
 * @param factory - dif factory to memoize
 * @returns memoized value of factory
 */
function Memo<T>(factory: DIFactory<T>): DIFactory<T> {
  let value: T | (typeof noInstance) = noInstance;
  return {
    create() {
      if (value === noInstance) {
        value = factory.create();
      }
      return value;
    }
  };
}

/**
 * Creates DIFactory from factory function
 * @param factory - value factory function
 * @returns DIFactory from factory function
 */
function Factory<T>(factory: () => T): DIFactory<T> {
  return {
    create() {
      return factory();
    }
  };
}

/**
 * Creates factory, that returns value, derived from another factory
 * @param factory - factory to derive from
 * @param mapper - value mapper
 * @returns factory, that instantiate value
 */
function Derive<S, R>(
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

/**
 * Useful for composing values from few factories
 * @param factories - factories to get inputs from
 * @param composer - function that consumes factories values and compose it to output
 * @returns factory of composed value
 */
function Compose<F extends DIFactory<any>[], R>(
  factories: [...F],
  composer: (...values: FactoryInstances<F>) => R
): DIFactory<R> {
  return {
    create() {
      const values = instantFactories(factories);
      const result: R = composer(...values);
      return result;
    }
  };
}

export const dif = {
  Const,
  Compose,
  Derive,
  Factory,
  Memo,
  Singleton,
  Transient
};
