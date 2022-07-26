import s from './history-items-list.module.scss'
// @ts-ignore
import Identicon from 'react-identicons';
import { useEffect, useState } from 'react';
import { walletStore } from '../../../../../store/wallet-store';
import { observer } from 'mobx-react-lite';

export const HistoryItemsList = observer(() => {

  let [result, setData] = useState<any>({data:[]})
  
  useEffect(()=>{
    walletStore.loadHistory().then((res)=>{
      setData(res);    
    });   
  },[]);
  
  return (
    <div className={s.list}>
      {
      result.data.filter((item:any) => item.event == 'Transfer').map(({ id, v4, v5, v3, v1, v2 }:any) =>

        <div key={id} className={s.item}>
          <Identicon string={v3} size="300" className={s.img}/>
          <div className={s.title}>{v3.slice(0, 9) + "..." + v3.slice(26, 36)}</div>
          {v3 === walletStore.pairKey.publicKey ?
            <div className={s.status} >Deposit</div> : 
            <div className={s.status} >Transfer</div>
          }
          {v3 === walletStore.pairKey.publicKey ?
            <div className={s.income}>{v4} {v1}</div> : 
            <div className={s.incoming}>-{v4} {v1}</div> 
          }
          <div className={s.usdPrice}>{v5}</div>
        </div>
      )}
    </div>
  )
})
