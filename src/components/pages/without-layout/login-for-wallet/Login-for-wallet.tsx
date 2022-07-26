import React from 'react'
import s from './login-wallet.module.scss'
import solarLogo from '../../../../assets/images/sollar-big-logo.svg'
import { Button } from '../../../shared/buttons/button/button'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { walletStore } from '../../../../store/wallet-store'
import { passwordInputStore } from "../../../../store/password-input-store";
import { observer } from 'mobx-react-lite'


export const LoginForWallet = observer(() => {
    const history = useHistory();
    const [state, setState] = useState("");

    function LogIn(){
        const password = state;
        const encryptedPrivate:any = localStorage.getItem("encryptedPrivate");
        const publicKey = localStorage.getItem("publicKey");
        const privateKey = walletStore.decryptData(encryptedPrivate, password);
        const pairKey = {
            privateKey,
            publicKey
        }
        passwordInputStore.setPassword(password);
        walletStore.setPairKeys(pairKey);

        history.push("/wallet");
    }

    return(
        <form action="submit">
        <div className={s.container}>
            <img className={s.logo} src={solarLogo} alt="#" />
            <h1 className={s.heading}>Welcome to Sollar ID</h1>
            <p className={`${s.description} description`}>
                Your gateway to the decentralized web. Login in your wallet witch password or restore him using seed phrase.
            </p>
            <p className={s.input_header}>
                
                <input className={s.input} type="password" onChange={(e) => {setState(e.target.value)}} id='password_login' placeholder="Input your password"/>
            </p>
            <div className={s.buttons}>
                <Button className={s.loginButton} onClick={LogIn} variant="primary">Log in</Button>
                <div className={s.restoreButton} onClick={() => history.push('/restore-seed-phrase')}>Do you want restore?</div>
            </div>
        </div>
        </form>
    )
})

