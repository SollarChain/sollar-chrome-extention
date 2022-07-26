// @ts-ignore
import Mnemonic from 'bitcore-mnemonic'
// @ts-ignore
import bitcore from 'bitcore-lib'

// const bitcore = Mnemonic.bitcore

export function sign(data: string, privateKey: string) {
    privateKey = String(privateKey)
    data = String(data)
    
    privateKey = new bitcore.PrivateKey(privateKey)
    let message = new bitcore.Message(data)

    return message.sign(privateKey).toString()
  }