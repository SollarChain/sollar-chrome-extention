import s from './asset-list.module.scss'
import { useEffect, useState } from 'react'
import WalletModalPage from '../../../wallet-modal-content/Wallet-modal-page'
import { Button } from '../../../../shared/buttons/button/button'
import { assetsStore } from '../../../../../store/assets-store'
import { contractAddressStorage } from '../../../../../store/contract-address-store'
import { observer } from 'mobx-react-lite'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


export const AssetList = observer(() => {
  const assetItems:any[] = assetsStore.assets;


  useEffect(()=>{
    setTimeout(() => assetsStore.loadAssetsWallet(), 10)
  },[])

  const [contractAddress, setContractAddress] = useState("");

  const [modalStatus, setStatus] = useState(false);

  const getAssetOnClick = async (contractAddress:string) => {
    if(assetsStore.isUniqueAsset(contractAddress)){
      const Asset = await assetsStore.loadNewAsset(contractAddress);

      assetsStore.setAsset(Asset);
      // console.log(contractAddressStorage.contractAddressList);

      contractAddressStorage.setContractAddressInList(contractAddress)

      const contractAddressList = contractAddressStorage.contractAddressList;
      // console.log(contractAddressList);

      const json = JSON.stringify(contractAddressList);
      localStorage.setItem("contractAddress", json);

      setStatus(false);
      toast.success("Succsess add token");
    }
    else{

      setStatus(false);
      toast.error("This token already have in wallet!");
    }
  }

  return (
    <div className={s.list}>
      {modalStatus &&
      <WalletModalPage>
        <div className={s.container}>
          <div className={s.block} >
            <div className={s.inputContainer}>
              <input className={s.input} onChange={(e) => {setContractAddress(e.target.value)}} type="text" placeholder='Input contract address' />
            </div>
            <div className={s.buttons}>
              <Button className={s.btn_add_confirm} onClick={() => setStatus(false)} variant="secondary" >Close</Button>
              <Button type='submit' className={s.btn_add_confirm} onClick={() => getAssetOnClick(contractAddress)} variant="primary" >Add token</Button>
            </div>
            </div>
        </div>

      </WalletModalPage>
      }
      {
        assetItems.map(({ balance, info }) =>
          <div key={info.ticker} className={s.item}>
            {/* <img className={s.img} src={img} alt=""/> */}
            <div className={s.info}>
              <div className={s.amount}>{info.name}</div>
            </div>
            <div className={s.priceBlock}>
              <div className={s.amountPrice}>{balance} {info.ticker}</div>
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
      }
      <Button className={s.add_btn} onClick={() => {setStatus(true)}} variant="secondary" >Add token</Button>
    </div>

  )
})
