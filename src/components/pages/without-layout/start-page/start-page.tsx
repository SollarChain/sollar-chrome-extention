import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { walletStore } from 'store/wallet-store';
import solarLogo from '../../../../assets/images/sollar-big-logo.svg'
import { Button } from '../../../shared/buttons/button/button'
import s from './start-page.module.scss'


export const StartPage = observer(() => {
  const history = useHistory();

  useEffect(()=>{
    const publicKey = localStorage.getItem('publicKey');
    if (publicKey !== null){
      walletStore.pairKey.publicKey = publicKey;
    }
  })
  return (
    <div className={s.container}>
      <img className={s.logo} src={solarLogo} alt="#"/>
      <h1 className={s.heading}>Welcome to Sollar ID</h1>
      <p className={`${s.description} description`}>
        Your gateway to the decentralized web. Create a new wallet or restore from your seed phrase.
      </p>
      <div className={s.buttons}>
        <Button onClick = {() => history.push("/restore-seed-phrase")} variant="secondary">Import</Button>
        <Button onClick = {() => history.push("/get-secret-phrase")} variant="primary">Create account</Button>
      </div>
    </div>
  )
})
