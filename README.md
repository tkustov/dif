# dif
Factory-based DI lib


## Install

```sh
npm install --save @tkustov/dif
```


## Getting started

This lib can be used in the project's composition root to bundle code units (classes) into factories that will inject dependecies to it.

That is what dependency injection should do: isolate your code unit from
it's dependecies implementations, but use dependency interface instead.


```typescript
// src/root/MyUnit1.ts

import { dif } from '@tkustov/dif';
import { MyUnit1 } from './path/to/MyUnit1';
import { MyUnit2 } from './another/path/to/MyUnit2';

const MyUnit2Factory = dif.Transient(MyUnit2)
  .ctor(dif.Const(process.env.MY_ENV_VAR))
  .complete();

export const MyUnit1Factory = dif.Singleton(MyUnit1)
  .ctor(MyUnit2Factory, dif.Const(process.env.MY_TOKEN))
  .setDep(dif.Const(process.env.MY_DEP))
  .complete();
```

```typescript
// src/index.ts

import { MyUnit1Factory } from './root/MyUnit1';

const unit1 = MyUnit1Factory.create();
unit1.start();
```
