import { dif } from '.';

class Dummy {
  public isDummy: boolean = true;
}

describe('dif', () => {
  it('should create Const factory', () => {
    const factory = dif.Const('my_value');
    const value = factory.create();
    expect(value).toBe('my_value');
  });

  it('should create Singleton factory', () => {
    const factory = dif.Singleton(Dummy).complete();
    const instance1 = factory.create();
    const instance2 = factory.create();
    expect(instance1).toBeInstanceOf(Dummy);
    expect(instance2).toBe(instance1);
  });

  it('should create Transient factory', () => {
    const factory = dif.Transient(Dummy).complete();
    const instance1 = factory.create();
    const instance2 = factory.create();
    expect(instance1).toBeInstanceOf(Dummy);
    expect(instance2).not.toBe(instance1);
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

    const dummy = dif.Singleton(Dummy).complete();
    const unit2 = dif.Singleton(Unit2)
      .ctor(dummy)
      .complete();
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

    const dummy = dif.Singleton(Dummy).complete();
    const unit2 = dif.Singleton(Unit2)
      .method('setDummy', dummy)
      .complete();
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

    const dummy = dif.Singleton(Dummy).complete();
    const unit2 = dif.Singleton(Unit2)
      .setDummy(dummy)
      .complete();
    const instance = unit2.create();
    expect(instance).toBeInstanceOf(Unit2);
    expect(instance.dummy).toBeInstanceOf(Dummy);
  });

  it('should be able to derive factory', () => {
    const f1 = dif.Const('f1');
    const f2 = dif.Derive(f1, (v1) => `${v1} f2`);
    expect(f1.create()).toBe('f1');
    expect(f2.create()).toBe('f1 f2');
  });

  it('should transform factory function to DIFactory', () => {
    const f1 = dif.Factory(() => 'f1');
    expect(f1.create()).toBe('f1');
  });

  it('should memorize value w/ Memo constructor', () => {
    let count = 0;
    const counter = dif.Factory(() => {
      count += 1;
      return count;
    });
    const dummy = dif.Transient(Dummy).complete();
    const memoCounter = dif.Memo(counter);
    const memoDummy = dif.Memo(dummy);
    expect(counter.create()).not.toBe(counter.create());
    expect(memoCounter.create()).toBe(memoCounter.create());
    expect(dummy.create()).not.toBe(dummy.create());
    expect(memoDummy.create()).toBe(memoDummy.create());
  });

  it('should compose values from few factories', () => {
    const dummy = dif.Singleton(Dummy).complete();
    const f1 = dif.Const('f1');
    const f3 = dif.Compose([f1, dummy], (f1, dummy) => `${f1} ${dummy}`);
    expect(f3.create()).toBe('f1 f2');
  });
});
