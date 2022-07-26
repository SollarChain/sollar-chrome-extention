import s from './currencyfied-input.module.scss'
import { Control, useController } from 'react-hook-form'

type Props = {
  className?: string
  control: Control<any>
  name: string
  currency: string
}


export const CurrencyfiedInput = ({ control, name, className, currency }: Props) => {
  const { field } = useController({ control, name })

  return (
    <label className={`${s.wrapper} ${className}`}>
      <input className={s.input} {...field} placeholder="Contacts, public addresses"/>
      <span className={s.currency}>{currency}</span>
    </label>
  )
}
