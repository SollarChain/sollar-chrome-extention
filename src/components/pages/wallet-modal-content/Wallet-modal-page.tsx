import React from 'react'
import { Button } from '../../shared/buttons/button/button'
import s from '../wallet-modal-content/wallet-modal.module.scss'


const WalletModalPage:React.FC = ({children}) => {
  return (
    <div className={s.modal}>
        {children}  
    </div>
  )
}

export default WalletModalPage