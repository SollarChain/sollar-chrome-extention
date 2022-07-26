import { makeAutoObservable } from 'mobx';
import Candy from '../blockchain/candy/candy';
import { whenCandyIsReady } from './when-candy-is-ready';
import { walletStore } from './wallet-store';
import { debounce } from '../functions/debounce';

export const MASTER_CONTRACT_ADDRESS = 1;

class CandyStore {
  candy: Candy = null as any;
  isReady = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  start() {
    this.candy = new Candy([process.env.REACT_APP_BLOCKCHAIN_WS_URL]).start();
    this.candy.recieverAddress = `${walletStore.pairKey.publicKey}`;
    this.candy.starwave!.registerMessageHandler(
      'transfers',
      debounce((message) => {        
        walletStore.updateWallet();
      }, 300)
    );

    this.candy.onready = () => {
      this.isReady = true;
    };
  }

  async send(messageType: string, args: any[], contractAddress = MASTER_CONTRACT_ADDRESS) {
   await whenCandyIsReady();
    const message = this.candy.starwave!.createMessage(
      args,
      'node1',
      walletStore.pairKey.publicKey,
      messageType
    ) as any;
    message['contractAddress'] = contractAddress;
    this.candy.starwave!.sendMessage(message);
  }

  getFreeCoins() {
    return this.send('getFreeCoins', [walletStore.pairKey.publicKey, 60]);
  }

  exit() {
    this.isReady = false;
    this.candy.sockets.forEach((socket: WebSocket) => !socket.CLOSED && socket.close());
  }
}

export const candyStore = new CandyStore();

