import { Route } from 'react-router-dom'
import { StartPage } from './components/pages/without-layout/start-page/start-page'
import { WalletPage } from './components/pages/without-layout/wallet-page/wallet-page'
import { ConfirmPhrasePage } from './components/pages/without-layout/confirm-phrase-page/Confirm-phrase-page'
import { GetSecretPhrasePage } from './components/pages/without-layout/get-secret-phrase/get-secret-phrase-page'
import { WritePassword } from './components/pages/without-layout/write-password-for-registration/Write-password'
// import { LoginLayout } from './components/layout/login-layout/login-layout'
// import { LoginPage1 } from './components/pages/login-layout/login-page-1'
// import { LoginPage2 } from './components/pages/login-layout/login-page-2'
import { RestoreSeedPhrasePage } from './components/pages/without-layout/restor-seed-phrase-page/restore-seed-phrase-page'
import { WritePasswordForRestore } from './components/pages/without-layout/write-password-for-restore/Write-password-for-restore'
import { LoginForWallet } from './components/pages/without-layout/login-for-wallet/Login-for-wallet'

export const useAppRoutes = (isLogin:boolean) => {
  return (
    <div style={{
      width:450
    }}>
      {
        isLogin ? 
        <Route path="/" exact component={WalletPage} /> : 
        <Route path="/" exact component={StartPage} />
      }
      
      <Route path="/wallet" component={WalletPage}/>
      <Route path="/get-secret-phrase" component={GetSecretPhrasePage}/>
      <Route path="/confirm-seed-phrase" component={ConfirmPhrasePage}/>
      <Route path="/restore-seed-phrase" component={RestoreSeedPhrasePage}/>
      <Route path="/write-new-restore-password" component={WritePasswordForRestore}/>
      <Route path="/write-password" component={WritePassword}/>
      <Route path="/login-wallet" component={LoginForWallet}/>

      {/* <Route path="/login" component={LoginLayout}>
        <Route path="/1" component={LoginPage1}/>
        <Route path="/2" component={LoginPage2}/>
      </Route> */}

      
    </div>
  )
}
