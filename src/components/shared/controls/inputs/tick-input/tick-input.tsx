import s from './tick-input.module.scss'
import { ReactComponent as TickIcon } from '../../../../../assets/images/green-tick.svg'
import { Control, useController } from 'react-hook-form'

type Props = {
  className?: string
  control: Control<any>
  name: string
}


export const TickInput = ({ control, name, className }: Props) => {
  const { field } = useController({ control, name })

  return (
    <label className={`${s.wrapper} ${className}`}>
      <TickIcon className={s.icon}/>
      <input className={s.input} {...field} placeholder="Contacts, public addresses"/>
    </label>
  )
}
