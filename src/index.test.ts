import { dif, Singleton, Transient } from '.';

class Dummy {
  public isDummy: boolean = true;
}

describe('dif', () => {
  it('should create Const factory', () => {
    const factory = dif.value('my_value');
    const value = factory.create();
    expect(value).toBe('my_value');
  });

  it('should create Singleton factory', () => {
    const factory = dif.ctor(Dummy, Singleton).end();

    const instance1 = factory.create();
    const instance2 = factory.create();
    expect(instance1).toBeInstanceOf(Dummy);
    expect(instance2).toBe(instance1);
  });

  it('should create Transient factory', () => {
    const factory = dif.ctor(Dummy, Transient).end();
    const instance1 = factory.create();
    const instance2 = factory.create();
    expect(instance1).toBeInstanceOf(Dummy);
    expect(instance2).not.toBe(instance1);
  });

  it('shoud inspect constructor types', () => {
    interface IDep1 {
      execute(value: number): string;
    }
    interface IDep2 {
      execute(value: string): number;
    }

    class Unit1 {
      constructor(
        private dep1: IDep1,
        private dep2: IDep2
      ) { }
    }

    class Dep1 implements IDep1 {
      execute(value: number): string {
        return value.toString(10);
      }
    }

    class Dep2 implements IDep2 {
      execute(value: string): number {
        return parseFloat(value);
      }
    }

    const dep1Factory = dif.ctor(Dep1, Transient).end();
    const dep2Factory = dif.ctor(Dep2, Transient).end();
    const uni1Factory = dif.ctor(Unit1, Transient)
      .args(dep1Factory, dep2Factory)
      .end();
  });

  it('should be able to pass deps through the constructor', () => {
    interface IsDummy {
      isDummy: boolean;
    }

    class Unit2 {
      constructor(
        public dummy: IsDummy
      ) { }
    }

    const dummy = dif.ctor(Dummy, Singleton).end();
    const unit2 = dif.ctor(Unit2, Singleton)
      .args(dummy)
      .end();
    const instance = unit2.create();
    expect(instance).toBeInstanceOf(Unit2);
    expect(instance.dummy).toBeInstanceOf(Dummy);
  });

  it('should be able to pass deps through the setter method', () => {
    interface IsDummy {
      isDummy: boolean;
    }

    class Unit2 {
      public dummy?: IsDummy;
      setDummy(dummy: IsDummy) {
        this.dummy = dummy;
      }
    }

    const dummy = dif.ctor(Dummy, Singleton).end();
    const unit2 = dif.ctor(Unit2, Singleton)
      .method('setDummy', dummy)
      .end();
    const instance = unit2.create();
    expect(instance).toBeInstanceOf(Unit2);
    expect(instance.dummy).toBeInstanceOf(Dummy);
  });

  it('should be able to pass deps through the setter method proxy syntax', () => {
    interface IsDummy {
      isDummy: boolean;
    }

    class Unit2 {
      public dummy?: IsDummy;
      setDummy(dummy: IsDummy) {
        this.dummy = dummy;
      }
    }

    const dummy = dif.ctor(Dummy, Singleton).end();
    const unit2 = dif.ctor(Unit2, Singleton)
      .setDummy(dummy)
      .end();
    const instance = unit2.create();
    expect(instance).toBeInstanceOf(Unit2);
    expect(instance.dummy).toBeInstanceOf(Dummy);
  });

  it('should be able to derive factory', () => {
    const f1 = dif.value('f1');
    const f2 = dif.factory((v1) => `${v1} f2`, Singleton)
      .args(f1)
      .end();
    expect(f1.create()).toBe('f1');
    expect(f2.create()).toBe('f1 f2');
  });

  it('should transform factory function to DIFactory', () => {
    const f1 = dif.factory(() => 'f1', Singleton).end();
    expect(f1.create()).toBe('f1');
  });

  it('should memorize value w/ Memo constructor', () => {
    let count = 0;
    const counterFn = () => {
      count += 1;
      return count;
    };
    const counter = dif.factory(counterFn, Transient).end();
    const dummy = dif.ctor(Dummy, Transient).end();
    const memoCounter = dif.factory(counterFn, Singleton).end();
    const memoDummy = dif.ctor(Dummy, Singleton).end();
    expect(counter.create()).not.toBe(counter.create());
    expect(memoCounter.create()).toBe(memoCounter.create());
    expect(dummy.create()).not.toBe(dummy.create());
    expect(memoDummy.create()).toBe(memoDummy.create());
  });

  it('should compose values from few factories', () => {
    const dummy = dif.ctor(Dummy, Singleton).end();
    const f1 = dif.value('f1');
    const f3 = dif.factory((f1, dummy) => `${f1} ${dummy.isDummy}`, Singleton)
      .args(f1, dummy)
      .end();
    expect(f3.create()).toBe('f1 true');
  });
});
