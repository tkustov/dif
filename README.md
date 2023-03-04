## **DI factories**

**DI factories** is a simple, zero-dependencies toolkit designed to help organize your project's [Composition Root](https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/). It provides useful helpers for using [Pure DI](https://blog.ploeh.dk/2014/06/10/pure-di/), making it easier to define your project's dependency graph.

With **DI factories**, you can easily define and manage your project's dependencies in a clear and concise way. This allows you to focus on writing clean and maintainable code, without having to worry about the complexities of managing your project's dependencies.

Whether you're working on a small project or a large-scale application, **DI factories** can help you simplify your dependency management and ensure that your code remains organized and easy to maintain. So if you're looking for a lightweight, easy-to-use toolkit for managing your project's dependencies, give **DI factories** a try!

## **Install**

```sh
npm install --save @tkustov/dif
```

## **Getting started**

Desired way to use this toolkit in your project:

1. Write code units in way they depends only on abstractions (types, interfaces)
1. Using **dif** define code unit factories inside project's *Composition Root*.
1. Pass these factories to other factories to define dependency graph.
1. Instantiate main code unit(s) in project's entry point using factories created on previous step and use it.

```typescript
// file: src/root/units.ts

import { dif } from '@tkustov/dif';
import { service1, service2 } from './services';
import { Unit1 } from '../app/Unit1';

function resolveParam2(value?: string) {
  return value ?? 'default';
}

const param2 = dif.factory((v?: string): string => v ?? 'default', dif.scopes.Singleton)
  .args(process.env.MY_VAR2)
  .end();

export unit1 = dif.ctor(Unit1, dif.scopes.Transient)
  .args(service1, dif.value(process.env.MY_VAR1))
  .setService2(service2)
  .prop('param2', param2)
  .end();
```

```typescript
// file: src/app/Unit1.ts

export interface Service1 { }
export interface Service2 { }

export class Unit1 {
  private service2?: Service2;
  public param2?: Service3;

  constructor(
    private service1: Service1,
    private param1: string
  ) { }

  setService2(service2: Service2) {
    this.service2 = service2;
  }
}
```

## **Motivation**

I need a tool that can help me define dependencies for code units in a TypeScript project. This tool should verify that the types of the passed dependencies match the required types of the code unit. The code units should be written in isolation, depending only on types/interfaces.

After reviewing many DI libraries, I found that they all have drawbacks that I cannot accept, such as:

*   Weak type checking or no type checking during the unit definition process
*   Most of them are actually Service Locators rather than DI containers
*   The DI libraries that do use tokens can be helpful, but they are not very effective

To address these issues, I am developing a new library that provides a better solution for managing dependencies with type checking. With this library, you can easily define and manage your dependencies with confidence, knowing that your code units will have the correct dependencies with the correct types.

## **Reference**

### **Methods of creation (dif)**

There are several methods available for creating units:

| **Method** | **Parameters** | **Returns** | **Description** |
| --- | --- | --- | --- |
| **dif.ctor(\<ClassCtor>, scope: DIScope)** | **ClassCtor** - class constructor | **DIDepsBuilder** | Creates an instance of the passed class constructor. |
| **dif.factory(\<FactoryFn>, scope: DIScope)** | **FactoryFn** - factory function | **DIDepsBuilder** | Uses the result returned by the factory function. |
| **dif.value(\<Value>)** | **Value** - any value | **DIFactory** | Creates a DI factory that always returns the passed value. |

### **Dependency definition (DIDepsBuilder)**

| **Method** | **Parameters** | **Returns** | **Description** |
| --- | --- | --- | --- |
| **.args(...\<args>: DIFactory\[\])** | **args** - DI factories corresponding to constructor parameter types | **DIDepsBuilder** | Defines values that will be passed during unit creation. |
| **.method(\<name>: string, ...\<args>: DIFactory\[\])** | **name** - method name, **args** - method arguments | **DIDepsBuilder** | Defines method injection. |
| **.\<methodName>(...\<args>: DIFactory\[\])** | **methodName** - method name, **args** - method arguments | **DIDepsBuilder** | Alternative method injection (ES [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) used). |
| **.prop(\<name>: string, \<dep>: DIFactory)** | **name** - property name, **dep** - dependency DI factory | **DIDepsBuilder** | Defines property injection. |
| **.end()** |   | **DIFactory** | Completes unit definition. |

### **Scopes**

*   **Singleton**: same instance for all consumers.
*   **Transient**: each consumer will receive their own instance.
