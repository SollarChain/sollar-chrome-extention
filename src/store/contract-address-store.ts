import { makeAutoObservable } from "mobx";

class ContractAddressStorage{

    contractAddressList:Array<any> = ['1',];

    constructor(){
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setContractAddressInList(contractAddress:any){ 
        this.contractAddressList.push(contractAddress);
        console.log(this.contractAddressList);
        
    }
}

export const contractAddressStorage = new ContractAddressStorage();