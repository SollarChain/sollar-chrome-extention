import s from './dashboard-header.module.scss'
import { ReactComponent as CopyIcon } from '../../../assets/images/copy.svg'
import { ReactComponent as Cross } from '../../../assets/images/cross_white.svg'
import { Button } from 'components/shared/buttons/button/button'
import { walletStore } from '../../../store/wallet-store'
import WalletModalPage from 'components/pages/wallet-modal-content/Wallet-modal-page'
// @ts-ignore
import Identicon from 'react-identicons';
import { toast, ToastContainer } from 'react-toastify'
import { useState } from 'react'

export const DashboardHeader = () => {
  const [statusExitModal, setStatusExit] = useState(false)

  const copy = () =>{
    navigator.clipboard.writeText(walletStore.pairKey.publicKey);
    toast.success("Copy adress to clipboard")
  }

  const exitWallet = () => {
    walletStore.exit();
  }

  return (
    <header className={s.header}>
      <div className={s.account}>
        <button className={`${s.avatarWrapper} vanished`}>
          <Identicon string={walletStore.pairKey.publicKey} size="20"/>
        </button>
        <div className={s.info}>
          <div className={s.name}>Account</div>
          <div className={s.addressInfo}>
            <div className={s.address}>{walletStore.pairKey.publicKey.slice(0,9) +"..."+ walletStore.pairKey.publicKey.slice(26)}</div>
            <CopyIcon className={s.copyIcon} onClick={copy}/>
          </div>
        </div>
      </div>
      <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  pauseOnHover={false}
                />
      {statusExitModal && 
        <WalletModalPage>
          <div className={s.container}>
            <span className={s.title}>Are you sure you want to log out?</span>
            <span className={s.description}>Please note that If you log out,<br /> you will need to re-enter the seed phrase.</span>
            <div className={s.buttons}>
              <Button variant='secondary' onClick={()=>{setStatusExit(false)}}>Back</Button>
              <Button variant='primary' onClick={exitWallet}>Log out</Button>
            </div>
          </div>
        </WalletModalPage>
      }
      <Cross className={s.exitButton} onClick={()=>{setStatusExit(true)}}/>
    </header>
  )
}
