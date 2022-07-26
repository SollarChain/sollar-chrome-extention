import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../../../shared/buttons/button/button'
import { walletStore } from '../../../../store/wallet-store';
import { phraseInputStore } from '../../../../store/phrase_input.store';
import s from './confirm-phrase-page.module.scss'
import { observer } from 'mobx-react-lite';
//@ts-ignore
import { WithContext as ReactTags } from 'react-tag-input';
import { PhraseConfirmControl } from 'components/shared/controls/phrase-confirm-control/phrase-confirm-control';
import { toast, ToastContainer } from 'react-toastify';

export const ConfirmPhrasePage = observer(() => {
  
  const history = useHistory();
  let phrase = "";

  function onGenerateKeys(){
    phraseInputStore.setPhrase(phrase);

    if(phraseInputStore.isPhraseEnteredRight){
      walletStore.setPairKeysOnPhrase();
      history.push("/write-password");
    }
    else{
      toast.error("Invalid seed phrase!")
    }
  }

  const backHandler = () => {
    history.push("/get-secret-phrase")
    phraseInputStore.clearSecretWord();
  }
  return (
    <div className="page container">
      <main>
        <h1 className={s.heading}>Confirm your seed phrase</h1>
        <p className={`description ${s.description}`}>
          This seed phrase allows you to recover your account.
        </p>
        <div className={s.divTest} >
          <PhraseConfirmControl/>
        </div>
      </main>
      <div className="buttons">
          <Button onClick = {backHandler} variant="secondary">Back</Button>
          <Button onClick = {onGenerateKeys} variant="primary">Next</Button>
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
