import { useHistory } from 'react-router-dom';
import { Button } from '../../../shared/buttons/button/button'
import { walletStore } from '../../../../store/wallet-store';
import s from './restore-phrase-page.module.scss'
import { observer } from 'mobx-react-lite';
import { InputControl, phrase } from 'components/shared/controls/input-control/input-control';
import { toast, ToastContainer } from 'react-toastify';

export const RestoreSeedPhrasePage = observer(() => {
  const history = useHistory();

  const nextStep = () => {
    if(phrase.length !== 12){
      toast.error('Fields should not be empty!')
      return
    }
    let secretPhrase = phrase.map((word) => word).join(' ');

    try {
      const pairKey = walletStore.generatePairKey(secretPhrase);
      walletStore.setPairKeys(pairKey); 
      history.push("/write-new-restore-password");
    } catch (error) {
      toast.error('Invalid seed phrase!')
    }
  }
  return (
    <div className="page container">
      <main>
        <h1 className={s.heading}>Restore your wallet</h1>
        <p className={`description ${s.description}`}>
          Restore wallet
        </p>
      </main>
      <InputControl/>
      <div className={s.buttons}>
          <Button onClick = {() => history.push("/")} variant="secondary">Back</Button>
          <Button onClick = {nextStep} variant="primary">Next</Button>
        </div>
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
