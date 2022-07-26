import ethereumLogo from '../../../../../assets/images/ethereum-logo.svg'
import streamrLogo from '../../../../../assets/images/streamr-logo.svg'
import { AssetItem } from '../../../../../types/asset-item'


export const assetItems: AssetItem[] = [
  {
    id: 1,
    img: ethereumLogo,
    amount: 0.95,
    currency: 'ETH',
    usdPrice: 373.33
  },
  {
    id: 2,
    img: streamrLogo,
    amount: 616.875,
    currency: 'DATA',
    usdPrice: 30.85
  }
]
