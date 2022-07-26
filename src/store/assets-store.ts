import { makeAutoObservable } from "mobx";
import { api } from "../api/axios-instanse";
import {walletStore} from "./wallet-store";
import getFromStorage from "../functions/get-from-storage";


class AssetsStore {
    assets: any[] = [];
    
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    getAssetByContractAddress(contractAddress: string) {
        const pairKey = walletStore.pairKey;

        const url = `contracts/ecma/getAssetInfo/${pairKey.publicKey}/${contractAddress}`;
        
        return api.get(url);
    }

    getSollarAsset() {     
        return this.assets.find(_ => _.info.ticker == 'SOL');
    }

    setAsset(asset:Array<any>) {
        this.assets.push(asset);  
    }

    async loadNewAsset(contractAddress:string) {
        let result = await this.getAssetByContractAddress(contractAddress);
        return result.data;
    }

    async loadAssetsWallet() {
        const contractAddressList = getFromStorage('contractAddress', []);

        let assets = contractAddressList.map(async (contractAddress: string) => {
            const result = await this.getAssetByContractAddress(contractAddress);
            const data = result.data;

            data.info.contractAddress = contractAddress;

            return data;
        });

        this.assets = await Promise.all(assets);
        
        return this.assets;
    }

    isUniqueAsset(contractAddress: string) {
        const contractAddressList = getFromStorage('contractAddress', []);
     
        return !contractAddressList.includes(contractAddress);
    }

}

export const assetsStore = new AssetsStore();