/* eslint-disable */

/**
 iZ³ | Izzzio blockchain - https://izzz.io
 */

/**
 * Blockchain validators object
 * Provide list of validators and modules for checking blocks
 */

class NodeMetaInfo {
  validators: any;
  modules: any;
  versions: any;
  messageBusAddress: string;


  constructor(config: any) {
    this.validators = config ? config.validators : [];
    this.modules = [];
    this.versions = {};
    this.messageBusAddress = config ? config.recieverAddress : '';
  }

  /**
   * Parse input meta message
   * @param {NodeMetaInfo} nodeMetaInfo
   * @return {NodeMetaInfo}
   */
  parse(nodeMetaInfo: any) {
    if (typeof nodeMetaInfo === 'string') {
      try {
        nodeMetaInfo = JSON.parse(nodeMetaInfo);
      } catch (e) {
        return this;
      }
    }

    this.validators = nodeMetaInfo.validators;
    this.modules = nodeMetaInfo.modules;
    this.versions = nodeMetaInfo.versions;
    this.messageBusAddress = nodeMetaInfo.messageBusAddress;

    return this;
  }


  /**
   * add new module description
   * @param {object} moduleName
   * @param {string} version = '0.0'
   */
  addModule(moduleName: string, version = '0.0') {
    this.modules.push(moduleName);
    this.versions[moduleName] = version;
  }

  /**
   * delete information about module
   * @param {string} moduleName
   */
  deleteModule(moduleName: string) {
    if (this.modules.indexOf(moduleName) !== -1) {
      this.modules.splice(this.modules.indexOf(moduleName), 1);
      delete this.versions[moduleName];
    }
  }

}

export default NodeMetaInfo;