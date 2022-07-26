import s from './switch.module.scss'
import { Control, useController } from 'react-hook-form'

type Props = {
  control: Control<any>
  name: string
  className?: string
}

export const Switch = ({ control, name, className }: Props) => {
  const { field } = useController({ control, name })

  return (
    <label className={`${s.wrapper} ${className} ${field.value && s.active}`}>
      <input {...field} type="checkbox" hidden/>
      <span className={s.track}>
        <span className={s.thumb}/>
      </span>
    </label>
  )
}
