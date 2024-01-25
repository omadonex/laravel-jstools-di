import { ServiceContainer } from './ServiceContainer';
import { ServiceProviderContract } from './contracts/ServiceProviderContract';

export class AppLocator {
  private globalData: any;
  private serviceContainer: ServiceContainer;
  private providerList: ServiceProviderContract[] = [];

  constructor(globalData: any) {
    this.globalData = globalData;
    this.serviceContainer = new ServiceContainer();
  }

  public registerProvider(provider: ServiceProviderContract): void {
    provider.setAppData(this.globalData);
    provider.register();
    this.providerList.push(provider);
    this.generateMaps();
  }

  public make(name: string, params: any = {}): any {
    return this.serviceContainer.make(name, params);
  }

  private generateMaps(): void {
    let classMap = {};
    let aliasMap = {};

    this.providerList.forEach((provider, i, arr) => {
      classMap = Object.assign(classMap, provider.getClassMap());
      aliasMap = Object.assign(aliasMap, provider.getAliasMap());
    });

    this.serviceContainer.setMaps(classMap, aliasMap);
  }
}
