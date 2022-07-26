import s from './address-input.module.scss'
import { Control, useController } from 'react-hook-form'
import {ReactComponent as QRScanIcon} from '../../../../../assets/images/qr-scan.svg'

type Props = {
  className?: string
  control: Control<any>
  name: string
}


export const AddressInput = ({ control, name, className }: Props) => {
  const { field } = useController({ control, name })

  return (
    <label className={`${s.wrapper} ${className}`}>
      <input className={s.input} {...field} placeholder="Contacts, public addresses"/>
      <QRScanIcon className={s.icon}/>
    </label>
  )
}
