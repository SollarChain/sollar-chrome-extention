import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../../../shared/buttons/button/button'
import { passwordInputStore } from '../../../../store/password-input-store';
import { walletStore } from '../../../../store/wallet-store';
import s from './send_password_page.module.scss'
import { observer } from 'mobx-react-lite';
import { contractAddressStorage } from '../../../../store/contract-address-store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const WritePassword = observer(() =>  {
  
    const history = useHistory();
    const a = document.createElement('a');

    const [state, setState] = useState("");

    function createAndSendFile(publicKey:any, encode_private:any){
        const fileName = `${publicKey.slice(0, 6)}_${publicKey.slice(publicKey.length - 6)}`;
        const data = JSON.stringify({ public: publicKey, private: encode_private});
        const file = new Blob([data], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = fileName + '.json';
        a.click();
        a.remove();
    }

    function sendPairKey(){
      if (!passwordInputStore.validatePassword(state)) {
        toast.error("Passwords not equals!");
        return;
      }
      const state_password = passwordInputStore.password;
      const pairKeys = walletStore.pairKey;

      const encode_private = walletStore.encryptData(pairKeys.privateKey, state_password); 
      createAndSendFile(pairKeys.publicKey, encode_private);

      localStorage.setItem("publicKey", pairKeys.publicKey);
      localStorage.setItem("encryptedPrivate", encode_private);

      const contractAddressList = contractAddressStorage.contractAddressList;
    
      const json = JSON.stringify(contractAddressList);
      
      localStorage.setItem("contractAddress", json);

      history.push("/wallet");
    }

    return (
        <div className="page container">
          <main>
            <h1 className={s.heading}>Input password for your wallet</h1>
            <p className={`description ${s.description}`}>
            This password need you for login in wallet.
            </p>
            <input className={s.input} type="password" onChange={(e) => passwordInputStore.setPassword(e.target.value)} id='password_field' placeholder="Input password first time"/>
            <input className={s.input} type="password" value={state} onChange={(e) => setState(e.target.value)} id='password_field_repeat' placeholder="Confirm your password"/>
            <div className="buttons">
                <Button onClick = {() => history.push("/confirm-seed-phrase")} variant="secondary">Back</Button>
                <Button onClick = {sendPairKey} variant="primary">Next</Button>
            </div>
          </main>
          <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  pauseOnHover={false}
                />
    </div>
    )
})