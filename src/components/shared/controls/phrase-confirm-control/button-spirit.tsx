import { Word } from '../../../../store/phrase_input.store'
import { motion } from 'framer-motion'
import s from './phrase-confirm-control.module.scss'

type Props = {
  word: Word
}

export const ButtonSpirit = ({ word }: Props) => {
  return <motion.div
    layoutId={`word-spirit-${word.value}`}
    className={s.wordSpirit}
    initial={true}
  >
    {word.value}
  </motion.div>
}
