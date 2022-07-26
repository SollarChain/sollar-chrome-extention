import s from './select.module.scss'
import { ReactComponent as DropDownTick } from '../../../../../assets/images/dropdown-tick.svg'
import { Control, useController } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useIsActive } from './use-is-active'

export type Option = {
  value: string
  text: string
}

type Props = {
  options: Option[]
  control: Control<any>
  name: string
  className?: string
}


export const Select = ({ className, options, name, control }: Props) => {
  const { field } = useController({ name, control })
  const { isActive } = useIsActive()

  return (
    <div className={`${s.wrapper} ${className}`}>
      <select {...field} hidden>
        {options.map(({ value, text }, i) => <option key={i} value={value}>{text}</option>)}
      </select>

      <div className={s.text}>
        {field.value}
      </div>

      <div className={`${s.tick} ${isActive && s.active}`}>
        <DropDownTick/>
      </div>

      {
        isActive && <motion.div
          className={s.options}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {
            options.map(({ value, text }, i) =>
              <div
                className={`${s.option} ${value === field.value && s.selected}`}
                onClick={() => field.onChange(value)}
                key={i}
              >
                {text}
              </div>
            )
          }
        </motion.div>
      }
    </div>
  )
}
