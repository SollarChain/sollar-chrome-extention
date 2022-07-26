import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../../../shared/buttons/button/button'
import { passwordInputStore } from '../../../../store/password-input-store';
import { walletStore } from '../../../../store/wallet-store';
import s from './send-password-page-for-restore.module.scss'
import { observer } from 'mobx-react-lite';
import { contractAddressStorage } from 'store/contract-address-store';
import { toast } from 'react-toastify';

export const WritePasswordForRestore = observer(() =>  {
    const history = useHistory();

    const [state, setState] = useState("");

    function downloadFile(data: string, filename: string = 'Backup.json') {
      const a = document.createElement('a');
      const file = new Blob([data], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
      a.remove(); 
    }

    function sendNewKeyPairs() {
      if (!passwordInputStore.validatePassword(state)) {
        toast.error("Passwords not equals!");
        return;
      }

      const state_password = passwordInputStore.password;
      const pairKeys = walletStore.pairKey;
      const encode_private = walletStore.encryptData(pairKeys.privateKey,state_password);
      
      const data = JSON.stringify({ public: pairKeys.publicKey, private: encode_private});
      const publicKey = pairKeys.publicKey;
      const fileName = `${publicKey.slice(0, 6)}...${publicKey.slice(publicKey.length - 6)}.json`;

      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("encryptedPrivate", encode_private);

      contractAddressStorage.setContractAddressInList("1");
      const contractAddressList = contractAddressStorage.contractAddressList;

      const json = JSON.stringify(contractAddressList);
        
      localStorage.setItem("contractAddress", json);

      downloadFile(data, fileName);

      history.push("/wallet");
    }

    return (
        <div className="page container">
          <main>
            <h1 className={s.heading}>Input new password for your wallet</h1>
            <p className={`description ${s.description}`}>
            This password need you for login in wallet.
            </p>
            <input className={s.input} type="password" onChange={(e) => {passwordInputStore.setPassword(e.target.value)}} placeholder="Input password first time"/>
            <input className={s.input} type="password" value={state} onChange={(e) => {setState(e.target.value)}} placeholder="Confirm your password"/>
            <div className="buttons">
                <Button onClick = {() => history.push("/")} variant="secondary">Back</Button>
                <Button onClick = {sendNewKeyPairs} variant="primary">Next</Button>
            </div>
          </main>
    </div>
    )
})