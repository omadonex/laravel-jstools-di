import { AbstractNotBindToConcreteException } from './exceptions/AbstractNotBindToConcreteException';
import { ClassInfoInterface } from './interfaces/ClassInfoInterface';
import { ServiceListInterface } from './interfaces/ServiceListInterface';
import { Service } from './Service';

export class ServiceContainer {
  private classMap: any;
  private aliasMap: any;
  private data: any;

  constructor() {
    this.classMap = {};
    this.aliasMap = {};
    this.data = {};
  }

  public setMaps(classMap: any, aliasMap: any): void {
    this.classMap = classMap;
    this.aliasMap = aliasMap;
  }

  private createInstance(className: string, params: any): any {
    if (className in this.classMap) {
      const classInfo: ClassInfoInterface = this.classMap[className];
      const instance = classInfo.closure(params);

      if (Object.getPrototypeOf(instance) === Service) {
        const dependsList: string[] = instance.getServiceDependsList();
        const serviceList: ServiceListInterface = {};
        dependsList.forEach((item, i, arr) => {
          serviceList[item] = this.createInstance(item, params);
        });

        instance.setServiceList(serviceList);
      }

      return instance;
    }

    throw AbstractNotBindToConcreteException(`Can't create instance of "${className}"! Abstract is not bind!`);
  }

  private getInstance(className: string, params: any): any {
    const classInfo = this.classMap[className];

    if (classInfo && classInfo.singleton) {
      if (!(className in this.data)) {
        this.data[className] = this.createInstance(className, params);
      }

      return this.data[className];
    }

    return this.createInstance(className, params);
  }

  public make(name: string, params: any = {}): any {
    if (name in this.aliasMap) {
      return this.getInstance(this.aliasMap[name], params);
    }

    return this.getInstance(name, params);
  }
}
