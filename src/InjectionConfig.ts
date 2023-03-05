import { DIFactory } from './DIFactory.js';

interface PropertyInjection {
  type: 'property';
  name: PropertyKey;
  factory: DIFactory<any>;
}

interface MethodInjection {
  type: 'method';
  name: PropertyKey;
  factories: DIFactory<any>[]
}

export type InstanceInjection = PropertyInjection | MethodInjection;
