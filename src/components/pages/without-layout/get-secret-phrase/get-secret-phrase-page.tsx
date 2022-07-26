import { useHistory } from 'react-router-dom';
import { Button } from '../../../shared/buttons/button/button'
import { phraseInputStore } from "../../../../store/phrase_input.store"
import s from './get-secret-phrase-page.module.scss'
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { walletStore } from 'store/wallet-store';

export const GetSecretPhrasePage = observer(() => {
  useEffect(()=>{
    walletStore.setPairKeysOnPhrase();
  },[])

  const secretPhrase = phraseInputStore.mnemonic.split(" ");
  
  const history = useHistory();

  return (
    <div className="page container">
      <main>
        <h1 className={s.heading}>Save your seed phrase</h1>
        <p className={`description ${s.description}`}>
          This seed phrase allows you to recover your account.
          Write down the twelve word phrase below and keep it in a safe place.
        </p>
        <h2 className={s.smallHeading}>Seed phrase</h2>
        <div className={s.seedPhrase}>
          {secretPhrase.map((word, i) =>
            <div key={word} className={s.word}>
              <div className={s.number}>{i + 1}</div>
              <div className={s.text}>{word}</div>
            </div>
          )}
        </div>
      </main>
      <div className={s.buttons}>
        <Button onClick = {() => history.push("/")} variant="secondary">Back</Button>
        <Button onClick = {() => history.push("/confirm-seed-phrase")} variant="primary">Next</Button>
      </div>
    </div>
  )
})
