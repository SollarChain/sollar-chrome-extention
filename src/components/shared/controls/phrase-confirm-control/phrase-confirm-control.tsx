import s from "./phrase-confirm-control.module.scss";
import {
  phraseInputStore,
  Word,
} from "../../../../store/phrase_input.store";
import { Button } from "../../buttons/button-control/button/button";
import { observer } from "mobx-react-lite";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useEffect, useState } from "react";
import { wait } from "../../../../functions/wait";
import { ButtonSpirit } from "./button-spirit";

export const PhraseConfirmControl = observer(() => {
  const [currentSelectedWords, setCurrentSelectedWords] = useState<Word[]>([]);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);

  const toggleWordSelection = async (word: Word) => {
    const addWord = (words: Word[]) => [...words, word];
    const removeWord = (words: Word[]) => words.filter((w) => w !== word);

    phraseInputStore.toggleWordSelection(word);

    if (!word.isSelected) {
      setCurrentSelectedWords(addWord);
      await wait(0);
      setCurrentWords(addWord);
      setCurrentSelectedWords(removeWord);
      await wait(500);
      setCurrentWords(removeWord);
    } else {
      setCurrentWords(addWord);
      await wait(0);
      setCurrentSelectedWords(addWord);
      setCurrentWords(removeWord);
      await wait(500);
      setCurrentSelectedWords(removeWord);
    }
  };

  useEffect(() => {
    setCurrentSelectedWords([]);
    setCurrentWords([]);
  }, []);

  return (
    <AnimateSharedLayout>
      <div className={s.wrapper}>
        <div className={s.selectedWords}>
          <AnimatePresence>
            {phraseInputStore.selectedWords.map((word) => (
              <Button
                buttonProps={{
                  onClick: () => toggleWordSelection(word),
                  className: s.word,
                }}
                type="secondary"
                size="medium"
                key={word.value}
              >
                <AnimatePresence>
                  {currentSelectedWords.includes(word) && (
                    <ButtonSpirit word={word} />
                  )}
                </AnimatePresence>
                {word.value}
              </Button>
            ))}
          </AnimatePresence>
        </div>
        <div className={s.unselectedWords}>
          {phraseInputStore.shuffledWords.map((word) => (
            <Button
              buttonProps={{
                onClick: () => toggleWordSelection(word),
                className: `${s.word} ${word.isSelected && s.active}`,
              }}
              type="secondary"
              size="medium"
              key={word.value + '-shuffledWords'}
            >
              {currentWords.includes(word) && <ButtonSpirit word={word} />}
              {word.value}
            </Button>
          ))}
        </div>
      </div>
    </AnimateSharedLayout>
  );
});
