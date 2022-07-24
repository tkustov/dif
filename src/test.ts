import { dif } from './index';

class C2 {
  a = 2;
}

interface C1ObjPort {
  a: number;
}

class C1 {
  private c2?: C1ObjPort;

  constructor(
    private obj: C1ObjPort,
    private str: string
  ) {}

  public setC2(c2: C1ObjPort) {
    this.c2 = c2;
  }

  log() {
    console.log(this.obj.a, this.str, this.c2?.a);
  }
}

const CC2 = dif.Transient(C2).complete();

const CC1 = dif.Singleton(C1)
  .ctor(CC2, dif.AsIs('my string'))
  .setC2(CC2)
  .complete();

const cc1 = CC1.create();

cc1.log();
