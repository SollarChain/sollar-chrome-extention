/* eslint-disable */

/**
 * Candy
 * Blockchain driven Web Applications
 * @Author: Andrey Nedobylsky
 */

/**
 * required nodemetainfo
 */

const MessageType: any = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
  MY_PEERS: 3,
  BROADCAST: 4,
  META: 5,
  SW_BROADCAST: 6,
  RESPONSE_BLOCKS_BLOCKCHAIN: 8
};

const MAX_CONNECTIONS = 30;

const BlockchainRequestors = {
  queryAllMsg: function (fromIndex: number, limit?: number) {
    limit = typeof limit === 'undefined' ? 1 : limit;
    return { 'type': MessageType.QUERY_ALL, data: typeof fromIndex === 'undefined' ? 0 : fromIndex, limit: limit }
  },
  queryBlocksMsg(fromIndex: number, limit: number, offset: number, hideEmptyBlocks: boolean) {
    limit = typeof limit === 'undefined' ? 1 : limit;
    return {
      type: MessageType.QUERY_ALL,
      data: typeof fromIndex === 'undefined' ? 0 : fromIndex,
      limit,
      offset,
      hideEmptyBlocks
    }
  }
};

import starwaveProtocol from './starwaveProtocol';
import NodeMetaInfo from './NodeMetaInfo';
import DigitalSignature from './digitalSignature';
import StarwaveCrypto from './starwaveCrypto';
import url from 'url';

class Candy {
  WebSocket: any = WebSocket;
  starwaveProtocol: any = starwaveProtocol;
  NodeMetaInfo: any = NodeMetaInfo;
  DigitalSignature: any = DigitalSignature;
  StarwaveCrypto: any = StarwaveCrypto;
  URL: any = url.URL;

  _resourceQueue: any = {};
  _lastMsgTimestamp = 0;
  _lastMsgIndex = 0;
  _requestQueue: any = {};
  _autoloader: any = undefined;

  maxConnections = MAX_CONNECTIONS;

  nodeList: any;

  sockets: any = [];

  blockHeight = 0;

  isFetchedAnyBlocks = false;

  messagesHandlers: any = [];

  routes: any = {};

  allowMultiplySocketsOnBus = false;

  secretKeys: any = {};

  starwave: any;

  recieverAddress: any;

  constructor(nodeList: any) {
    this.nodeList = nodeList;

    if (typeof this.starwaveProtocol === 'function') {
      this.starwave = new this.starwaveProtocol(this, MessageType);
    } else {
      console.log("Error: Can't find starwaveProtocol module");
    }

    this.recieverAddress = this.getid() + this.getid();
  }

  getid() {
    return (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '');
  }
  
  ondata = function (data: any) {
    return false;
  };

  onready = function () {

  };

  onmessage = function (message: any) {

  };

  _dataRecieved = (source: any, data: any) => {
    //prevent multiple sockets on one busaddress
    if (!this.allowMultiplySocketsOnBus && (this.starwave)) {
      if (this.starwave.preventMultipleSockets(source) === 0) {
        data = null;
        return;
      }
    }

    if (typeof this.ondata === 'function') {
      if (this.ondata(data)) {
        return;
      }
    }

    // console.log('GIGA DATA')
    // console.log(data)
    // console.log('GIGA DATA END')
    //Data block recived
    if (data.type === MessageType.RESPONSE_BLOCKCHAIN) {
      try {
        /**
         * @var {Block} block
         */
        let blocks = JSON.parse(data.data);
        for (let a in blocks) {
          let block = blocks[a];
          if (this.blockHeight < block.index) {
            const newBlocksCount = this.isFetchedAnyBlocks
              ? block.index - this.blockHeight
              : 0;
            // blocksStore.fetchNewBLocks(block.index, newBlocksCount).then();

            this.blockHeight = block.index;
            // candyEventsStore.onBlockHeightChange(this.blockHeight);
          }
          //Loading requested resource
          if (typeof this._resourceQueue[block.index] !== 'undefined') {
            this._resourceQueue[block.index](block.data, block);
            this._resourceQueue[block.index] = undefined;
          }
        }

      } catch (e) {
      }
    }

    //New peers recived
    if (data.type === MessageType.MY_PEERS) {
      for (let a in data.data) {
        if (data.data.hasOwnProperty(a)) {
          if (this.nodeList.indexOf(data.data[a]) == -1) {
            this.nodeList.push(data.data[a]);
            if (this.getActiveConnections().length < this.maxConnections - 1) {
              this.connectPeer(data.data[a]);
            }
          }
        }
      }
      this.nodeList = Array.from(new Set(this.nodeList));
      // candyEventsStore.onConnectionsCountChange(this.nodeList.filter(Boolean).length);
    }

    if (data.type === MessageType.BROADCAST) {
      /*if(that._lastMsgIndex < data.index) {*/
      if (data.reciver === this.recieverAddress) {

        if (data.id === 'CANDY_APP_RESPONSE') {
          if (typeof this._candyAppResponse === 'function') {
            this._candyAppResponse(data);
          }
        } else {
          if (typeof this.onmessage === 'function') {
            this.onmessage(data);
          }
        }
      } else {
        if (data.recepient !== this.recieverAddress) {
          data.TTL++;
        }
      }
      /*}*/
      this._lastMsgIndex = data.index;
      this._lastMsgTimestamp = data.timestamp;
    }

    //add meta info handling //required NodeMetaInfo.js included
    if (data.type === MessageType.META) {
      if (typeof this.NodeMetaInfo === 'function') {
        let ind = this.sockets.indexOf(source);
        if (ind > -1) {
          this.sockets[ind].nodeMetaInfo = (new this.NodeMetaInfo()).parse(data.data);
        } else {
          console.log('Error: Unexpected error occurred when trying to add validators');
        }
      } else {
        console.log('Error: NodeMetaInfo.js has not been included');
      }
    }

    if (data.type === MessageType.SW_BROADCAST) {
      if (this.starwave) {
        this._lastMsgIndex = this.starwave.handleMessage(data, this.messagesHandlers, source);
      }
    }

    if (data.type === MessageType.RESPONSE_BLOCKS_BLOCKCHAIN) {
      const blocks = JSON.parse(data.data)
      for (const block of blocks) {
        if (this.blockHeight < block.index) {
          this.blockHeight = block.index
          // candyEventsStore.onBlockHeightChange(this.blockHeight)
        }
        block.data = JSON.parse(block.data)
      }
      // candyEventsStore.onBlocksResponse(blocks)
      this.isFetchedAnyBlocks = true
    }

  };

  getActiveConnections = () => {
    let activeSockets = [];
    for (let a in this.sockets) {
      if (this.sockets[a]) {
        if (this.sockets[a].readyState === this.WebSocket.OPEN) {
          activeSockets.push(this.sockets[a]);
        }
      }
    }

    return activeSockets;
  };

  socket: any;

  connectPeer = (peer: any) => {
    let socket = null;
    try {
      for (let connection of this.getActiveConnections()) {
        if (connection.url === peer) {
          return;
        }
      }
      
      this.socket = new this.WebSocket(peer);

      this.socket.onopen = () => {
        setTimeout(() => {
          if (typeof this.onready !== 'undefined') {
            if (typeof this._autoloader !== 'undefined') {
              this._autoloader.onready();
            }
            this.onready();
            // this.onready = undefined;
          }
        }, 10);
      };

      this.socket.onclose = (event: any) => {
        this.sockets.splice(this.sockets.indexOf(event.socket), 1);
      };

      this.socket.onmessage = (event: any) => {
        try {
          let data = JSON.parse(event.data);
          this._dataRecieved(this.socket, data);
        } catch (e) {
        }
      };

      this.socket.onerror = (error: any) => {
        //console.log("Ошибка " + error.message);
      }
      this.sockets.push(socket);
    } catch (e) {
      return;
    }
  }

  broadcast = (message: any) => {
    let sended = false;
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    for (let a in this.sockets) {
      if (this.sockets.hasOwnProperty(a) && this.sockets[a] !== null) {
        try {
          this.sockets[a].send(message);
          sended = true;
        } catch (e) {
        }
      }
    }

    return sended;
  };

  broadcastMessage = (messageData: any, id: any, reciver: any, recipient: any) => {
    this._lastMsgIndex++;
    let message = {
      type: MessageType.BROADCAST,
      data: messageData,
      reciver: reciver,
      recepient: recipient,
      id: id,
      timestamp: (new Date().getTime()),
      TTL: 0,
      index: this._lastMsgIndex,
      mutex: this.getid() + this.getid() + this.getid()
    };

    if (!this.broadcast(message)) {
      this.autoconnect(true);
      return false;
    }

    return true;
  };

  connections: any = []
  
  autoconnect = (force?: any) => {
    if (this.getActiveConnections().length < 1 || force) {
      for (let a in this.nodeList) {
        if (this.nodeList.hasOwnProperty(a)) {
          if (this.getActiveConnections().length < this.maxConnections - 1) {
            this.connectPeer(this.nodeList[a]);
          }
        }
      }
    } else {
      this.sockets = Array.from(new Set(this.sockets));
      this.connections = this.getActiveConnections().length;
    }
  };

  start = () => {
    for (let a in this.nodeList) {
      if (this.nodeList.hasOwnProperty(a)) {
        if (this.getActiveConnections().length < this.maxConnections - 1) {
          this.connectPeer(this.nodeList[a]);
        }
      }
    }
    setInterval(() => {
      this.autoconnect();
    }, 5000);

    return this;
  };

  _candyAppRequest = (uri: any, requestData: any, backId: any, timeout: any) => {
    let url = new this.URL(uri.replace('candy:', 'http:'));
    let data = {
      uri: uri,
      data: requestData,
      backId: backId,
      timeout: timeout
    };
    this.broadcastMessage(data, 'CANDY_APP', url.host, this.recieverAddress);
  };

  _candyAppResponse = (message: any) => {
    if (typeof this._requestQueue[message.data.backId] !== 'undefined') {
      let request = this._requestQueue[message.data.backId];
      clearTimeout(request.timer);
      request.callback(message.err, typeof message.data.data.body !== 'undefined' ? message.data.data.body : message.data.data, message);
      this._requestQueue[message.data.backId] = undefined;
      delete this._requestQueue[message.data.backId];
    }
  };

  requestApp = (uri: any, data: any, callback: any, timeout: any) => {
    if (typeof timeout === 'undefined') {
      timeout = 10000;
    }
    let requestId = this.getid();

    let timer = setTimeout(() => {
      this._requestQueue[requestId].callback({ error: 'Timeout', request: this._requestQueue[requestId] });
      this._requestQueue[requestId] = undefined;
    }, timeout);

    this._requestQueue[requestId] = {
      id: requestId,
      uri: uri,
      data: data,
      timeout: timeout,
      callback: callback,
      timer: timer
    };

    this._candyAppRequest(uri, data, requestId, timeout);

    return this._requestQueue[requestId];
  };

  request = (uri: any, data: any, callback: any, timeout: any) => {
    let url = new this.URL(uri.replace('candy:', 'http:'));
    if (url.hostname === 'block') {
      this.loadResource(url.pathname.replace('/', ''), function (err: any, data: any) {
        callback(err, data.candyData, data);
      });
    } else {
      this.requestApp(uri, data, callback, timeout);
    }
  };

  blockHeigth: any = 0;

  loadResource = (blockId: any, callback: any) => {
    if (blockId > this.blockHeigth && blockId < 1) {
      callback(404);
    }
    this._resourceQueue[blockId] = function (data: any, rawBlock: any) {
      callback(null, JSON.parse(data), rawBlock);
    };
    let message = BlockchainRequestors.queryAllMsg(blockId);
    this.broadcast(JSON.stringify(message));
  };

  loadBlocks = (blockId: any, limit = 1, offset = 0, hideEmptyBlocks = false) => {
    let message = BlockchainRequestors.queryBlocksMsg(blockId, limit, offset, hideEmptyBlocks);
    this.broadcast(JSON.stringify(message));
  };

  registerMessageHandler = (id: any, handler: any) => {
    this.messagesHandlers.push({ id: id, handle: handler });
    this.messagesHandlers.sort((a: any, b: any) => a.id > b.id);
  };
}

export default Candy;
