import { makeAutoObservable, runInAction } from 'mobx'
// @ts-ignore
import Mnemomic from 'bitcore-mnemonic'
import { wait } from 'functions/wait'
import { deepEqual } from 'functions/deep-equal'

export type Word = {
    value: string
    isSelected: boolean
}

class PhraseInputStore {
    phrase = "";
    
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    generateSeedPhrase(){
        let seed_phrase = new Mnemomic(Mnemomic.Words.English);
        return seed_phrase.toString(); 
    }

    setPhrase(phrase: string) {
        this.phrase = phrase;
    }

  words: Word[] = []
  selectedWords: Word[] = []

  get mnemonic() {
    return this.words.map(word => word.value).join(' ')
  }

  get shuffledWords() {
    return this.words?.slice()?.sort(() => 0.5 - Math.random());
  }

  get isPhraseEnteredRight() {
    return deepEqual(
      this.words,
      this.selectedWords
    )
  }

  setMnemonic(mnemonic: string) {
    this.words = mnemonic.split(' ')
      .map(word => ({ value: word, isSelected: false }))
  }

  addToSelectedWords(word: Word) {
    word.isSelected = true 
    this.selectedWords.push(word)
  }

  clearSecretWord() {
    runInAction(() => this.selectedWords = [])
  }

  async removeFromSelectedWords(word: Word) {
    word.isSelected = false
    await wait(0)
    runInAction(() => this.selectedWords = this.selectedWords.filter(w => w !== word))
  }

  toggleWordSelection(word: Word) {
    if (word.isSelected) {
      this.removeFromSelectedWords(word).then()
    } else {
      this.addToSelectedWords(word)
    }
  }

}

export const phraseInputStore = new PhraseInputStore();