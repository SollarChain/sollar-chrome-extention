import { DashboardHeader } from '../../../layout/dashboard-header/dashboard-header'
import { Tabs } from '../../../shared/tabs/tabs'
import { Button } from '../../../shared/buttons/button/button'
import { AssetList } from './asset-list/asset-list'
import { HistoryItemsList } from './history-items-list/history-items-list'
import s from './wallet-page.module.scss'
import WalletModalPage from '../../wallet-modal-content/Wallet-modal-page'
import { useEffect, useState } from 'react'
import { walletStore } from '../../../../store/wallet-store'
import { candyStore } from '../../../../store/candy.store'
import { SitesList } from './sites-list/sites-list'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { connectSite } from '../../../../functions/connectSite'
import { SiteStatus, siteStore } from 'store/site-store'
import { assetsStore } from 'store/assets-store'
import Select from 'react-select'
import { ReactComponent as Cross } from '../../../../assets/images/cross.svg'
import { observer } from 'mobx-react-lite'
import { passwordInputStore } from 'store/password-input-store'


export const WalletPage = observer(() => {
  const copy = () => {
    navigator.clipboard.writeText(walletStore.pairKey.publicKey);
    setStatusDeposit(false);
    toast.success("Address copy to clipboard!");
  }

  useEffect(()=>{
    const publicKey = localStorage.getItem("publicKey");
    walletStore.pairKey.publicKey = publicKey!;
  },[])

  const assetItems:any[] = assetsStore.assets;

  const [modalDeposit, setStatusDeposit] = useState(false);
  const [modalTransfer, setStatusTransfer] = useState(false);
  const [modalPassword, setStatusPasswordModal] = useState(false);
  const [modalHelper, setStatusModalHelper] = useState(false);


  const [isSiteCanConnect, setSiteConnect] = useState(false);
  const [isSiteConnected, setSiteConnected] = useState(false);
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const [sendler, setSendler] = useState("")

  const [password, setPassword] = useState("");

  useEffect(() => {
    candyStore.start();
  }, []);

  const transferMoney = () => {
    if(address === "" || amount === 0){
      toast.error("Error transfer: empty field");
      return;
    }
    else if(walletStore.isAuth){
      walletStore.transferTo(address, amount, Number(selecter.value));
      setStatusTransfer(false);
      toast.success("Success transfer");
    }
    else if(!walletStore.isAuth){
      setStatusTransfer(false);
      setSendler("Transfer");
      setStatusPasswordModal(true);
    }
    else{
      toast.error("Ivalid data!");
      return;
    }
  }

  useEffect(() => {
    const currentSite = siteStore.currentSite();
    if(currentSite?.status == SiteStatus.connected){
      setSiteConnected(true);
    }
  },[])

  useEffect(()=>{
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const bg: any = chrome.extension.getBackgroundPage();

      const currentId:any = tabs[0].id;
      // console.log('{bg, connects: bg.siteConnected}', {bg, connects: bg?.siteConnected});

      setSiteConnected(bg?.siteConnected?.[currentId]);


      if(bg?.frontendMethods?.[currentId]){
        setSiteConnect(true);
      }
    })
  },[])

  const connect = () => {
    if (siteStatus === SiteStatus.disabled) {
      setStatusModalHelper(true);
      return;
    }
    if(walletStore.isAuth){
      connectSite();
      setSiteConnected(true);
    }
    if(!walletStore.isAuth){
      setSendler("Connect");
      setStatusPasswordModal(true);
    }
  }

  const confirmConnect = () => {
    if(!password.trim()){
      toast.error("Invalid password!")
    }
    if(password.length >= 8){
      passwordInputStore.password = password;
      const encryptedPrivate = localStorage.getItem("encryptedPrivate");
      walletStore.pairKey.privateKey = walletStore.decryptData(encryptedPrivate!, password);
      walletStore.isAuth = true;
      connect();
      setStatusPasswordModal(false);
      toast.success("Success connect!");
    }
    else{
      toast.error("Invalid password!")
    }
  }

  const confirmTransfer = () => {
    if(!password.trim()){
      toast.error("Invalid password!")
    }
    if(password.length >= 8){
      const encryptedPrivate = localStorage.getItem("encryptedPrivate");
      walletStore.pairKey.privateKey = walletStore.decryptData(encryptedPrivate!, password);
      walletStore.isAuth = true;
      walletStore.transferTo(address, amount, Number(selecter.value));
      setStatusPasswordModal(false);
      toast.success("Success transfer");
    }
    else{
      toast.error("Invalid password!")
    }
  }

  let siteStatus = isSiteConnected ? SiteStatus.connected : isSiteCanConnect ? SiteStatus.connect : SiteStatus.disabled;
  const sollarAsset = assetsStore.getSollarAsset();
  const sollarBalance = sollarAsset?.balance ? Number(sollarAsset?.balance) : 0;

  const [selecter, setSelectorValue] = useState({label:"Select token...", value:""});


  return (
    <div>
      {modalHelper &&
      <WalletModalPage>
        <div className={s.container}>
          <div className={s.blockDeposit} >
          <Cross onClick={()=>setStatusModalHelper(false)} className={s.closeDeposit}/>
            <div className={s.mainContent}>
              <span className={s.titleHelper}>Sollar ID is not connected to this site.</span>
            </div>
            <div className={s.mainContent}>
              <span className={s.description}>Please contact the site administrator.</span>
            </div>
            </div>
        </div>
      </WalletModalPage>
      }
      {modalDeposit &&
      <WalletModalPage>
        <div className={s.container}>
          <div className={s.blockDeposit} >
          <Cross onClick={()=>setStatusDeposit(false)} className={s.closeDeposit}/>
            <div className={s.mainContent}>
              <span className={s.title}>Your address for deposit: <br /> <span className={s.Address}>{walletStore.pairKey.publicKey}</span></span>
            </div>
            <div className={s.buttonCopyContainer}>
              <Button className={s.copyButton} onClick={copy} variant="secondary">
                Copy address to clipboard
              </Button>
            </div>
            </div>
        </div>
      </WalletModalPage>
      }
      {modalPassword &&
      <WalletModalPage>
        <div className={s.containerPassword}>
          <div className={s.blockDeposit} >
          <Cross onClick={() => setStatusPasswordModal(false)} className={s.closeDeposit}/>
            <div className={s.mainContent}>
              <span className={s.titlePassword}>Write your password:</span>
            </div>
            <div className={s.inputContainer}>
              <input className={s.inputPassword} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' />
            </div>
            <div className={s.buttons}>
                  <Button className={s.btnSend} onClick={() => sendler == 'Transfer' ? confirmTransfer() : confirmConnect()} variant="primary">Confirm</Button>
            </div>
            </div>
        </div>
      </WalletModalPage>
      }
      {modalTransfer &&
      <WalletModalPage>
          <div className={s.container}>
            <div className={s.blockTransfer} >
            <Select className={s.selector} onChange={setSelectorValue} placeholder={selecter.label} options={assetItems?.map(
                ({balance, info })=>{
                  let option:any = [{ value:info.contractAddress, label:info.name}];
                  return Object.assign([], ...option);
                })||[]}/>
                <div className={s.toBlock}>
                <span className={s.toTitle}>To:</span> <input className={s.input} onChange={(e) => {setAddress(e.target.value)}} type="text" placeholder='Enter the recipient' />
                </div>
                <div className={s.amountBlock}>
                  Amount: <input className={s.input} onChange={(e) => {setAmount(Number(e.target.value))}} type="text" placeholder='Enter the number of money' />
                </div>
                <div className={s.buttons}>
                  <Button className={s.btnClose} onClick={() => setStatusTransfer(false)} variant="secondary">Close</Button>
                  <Button className={s.btnSend} onClick={transferMoney} variant="primary">Send</Button>
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
          </div>
      </WalletModalPage>
      }
      <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  pauseOnHover={false}
                />
      <DashboardHeader/>
      <div className={s.caption}>
        <h2 className={s.usdBalance}>${sollarBalance.toFixed(2)}</h2>
        <h3 className={s.ethBalance}>{sollarBalance.toFixed(8)} SOL</h3>
        <h4 className={s.siteConnect}>
          <span>{siteStore.currentUrl}</span>
          <span onClick={connect}
            className={siteStatus === SiteStatus.disabled ? s.connectRedIndicator :
            siteStatus === SiteStatus.connect ? s.connectIndicator : s.connectingIndicator}>
            {siteStatus}
          </span>
        </h4>
      </div>
          <Tabs tabs={[
            { text: 'Assets', element: <AssetList/> },
            { text: 'History', element: <HistoryItemsList/>},
            { text: 'Connections', element: <SitesList/>}
          ]}/>
      <div className={s.buttonsWallet}>
        <Button style={{position:'fixed', bottom:10, marginRight:180}} onClick={() => {setStatusDeposit(true)}} variant="secondary">Deposit</Button>
        <Button style={{position:'fixed', bottom:10, marginLeft:180}} onClick={() => {setStatusTransfer(true)}} variant="primary">Transfer</Button>
      </div>
    </div>
  )
})
