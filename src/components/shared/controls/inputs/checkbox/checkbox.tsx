import s from './checkbox.module.scss'
import { FC } from 'react'
import { Control, Controller } from 'react-hook-form'
import { ReactComponent as Tick } from '../../../../../assets/images/tick.svg'

type Props = {
  className?: string
  isDisabled?: boolean
  control: Control<any>
  name: string
}

export const Checkbox: FC<Props> = ({ children, className, isDisabled, name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <label className={`${s.wrapper} ${className || ''}`}>
        <div className={s.boxContainer}>
          <div className={`${s.box} ${field.value ? s.checked : s.unchecked} ${isDisabled ? s.disabled : ''}`}>
            {field.value && <Tick/>}
          </div>
          <input
            {...field}
            type="checkbox"
            disabled={isDisabled}
            hidden
          />
        </div>
        <div>
          {children}
        </div>
      </label>}
    />
  )
}

