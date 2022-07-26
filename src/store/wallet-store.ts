// @ts-ignore
import Mnemonic from 'bitcore-mnemonic'
import { AES, enc } from 'crypto-ts'
import { makeAutoObservable } from 'mobx'
import { api } from '../api/axios-instanse'
import { assetsStore } from './assets-store'
import { candyStore } from './candy.store'
import { phraseInputStore } from './phrase_input.store'


const WALLET_PREFIX = process.env.REACT_APP_WALLET_PREFIX;

type KeyPair = {
    privateKey: string
    publicKey: string | null
}

class WalletStore {

    pairKey:any = {
        privateKey: "",
        publicKey: ""
    }

    isAuth = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async loadHistory(){
        const {data:result} = await api.post('/transfer-history/all/', { wallet: this.pairKey.publicKey, limit: 5, offset: 0 });
      
        return result;
    }

    async authToSite(contractAddress: number, sign: string) {
        const data = await api.post(`/site/auth/${contractAddress}`, { wallet: this.pairKey.publicKey, sign });

        return data;
    }

    get isLogin(){
        return !!this.pairKey.publicKey && !!localStorage.getItem("publicKey")
    }

    updateWallet(){
        assetsStore.loadAssetsWallet();   
    }
    
    public2address(publicKey: string | null) {
        let address = publicKey;
        if (publicKey && !publicKey?.startsWith(WALLET_PREFIX!)) {
            address = `${WALLET_PREFIX}${address?.slice(1)}`;
        }
        return String(address);
    }

    transferTo(address: string, amount: number, contractAddress: number) {
        candyStore.send('transferFromTo', [this.pairKey.publicKey, address, amount], contractAddress).then();       
    }

    setPairKeys(pairKey: KeyPair) {
        this.pairKey.publicKey = this.public2address(pairKey.publicKey);
        this.pairKey.privateKey = pairKey.privateKey;
    }

    setPairKeysOnPhrase() {
        let secretsPhrase = phraseInputStore.mnemonic;
        let pairKeys = this.generatePairKey(secretsPhrase);
        this.setPairKeys(pairKeys);
    }

    generatePairKey(phrase:string) {
        const seed_phrase = new Mnemonic(phrase);
        phraseInputStore.setMnemonic(seed_phrase.toString())
        const hdPrivateKey = seed_phrase.toHDPrivateKey();
        const derived = hdPrivateKey.derive("m/0'");
        const privateKey = derived.privateKey.toString();
        const publicKey = derived.privateKey.toAddress().toString();
        const data = {
            privateKey,
            publicKey
        }
    
        return data
    }

    encryptData(data:string, password:string) {
        const encrypted = AES.encrypt(data, password);   
        return encrypted.toString()
    }

    decryptData(data:string, password:string) {
        const encryptedPrivate = AES.decrypt(data, password);
        const utf = encryptedPrivate.toString(enc.Utf8);
        
        return utf
    }

    exit(){
        this.pairKey.publicKey = null;
        this.pairKey.privateKey = null;
        localStorage.clear();
        candyStore.exit();
        console.log(walletStore.isLogin);
        
    }
}

export const walletStore = new WalletStore();