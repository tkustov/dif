import { Transient } from './Transient';
import { DIFactory, Subject } from './Types';

export class Singleton<S extends Subject>
  extends Transient<S>
  implements DIFactory<S>
{
  private instance?: InstanceType<S>;

  create(): InstanceType<S> {
    if (!this.instance) {
      this.instance = super.create();
    }
    return this.instance!;
  }
}
