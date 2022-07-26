import s from './modal.module.scss'
import { ReactComponent as CrossIcon } from '../../../assets/images/cross.svg'
import { FC } from 'react'
import { SvgButton } from '../buttons/svg-button/svg-button'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  isOpen: boolean
  closeModal: () => void
  className?: string
}


export const Modal: FC<Props> = ({ isOpen, closeModal, children, className }) => {
  return (
    <AnimatePresence>
      {
        isOpen &&
        <motion.div
          className={s.modal}
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          exit={{ x: '-100vw' }}
          transition={{ duration: .33, type: 'tween' }}
        >
          <SvgButton className={s.closeButton} onClick={closeModal}>
            <CrossIcon/>
          </SvgButton>

          <div className={`${s.content} ${className}`}>
            {children}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  )
}
