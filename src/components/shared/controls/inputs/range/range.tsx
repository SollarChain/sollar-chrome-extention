import s from './range.module.scss'
import { Control, useController } from 'react-hook-form'

type Props = {
  min: number
  max: number
  control: Control<any>
  name: string
  className: string
}


const FULL_WIDTH = 248 - 24

export const Range = ({ min, max, control, name, className }: Props) => {

  const { field } = useController({ control, name })

  const rangeLength = max - min
  const filledValue = field.value - min

  const percent = filledValue / rangeLength

  const fillLength = percent * FULL_WIDTH + 28

  return (
    <div className={`${s.wrapper} ${className}`}>
      <input
        min={min} max={max} step={0.01} {...field} className={s.range}
        type="range"/>
      <div style={{ width: fillLength - 10 }} className={s.filledTrack}/>
      <div style={{ left: fillLength }} className={s.currentValueLabel}>${field.value}</div>
      <div className={s.standardLabel}>Standard</div>
      <div className={s.lowLabel}>Slow</div>
      <div className={s.highLabel}>Fast</div>
      <div className={s.lowValue}>${min}</div>
      <div className={s.highValue}>${max}</div>
      <div className={s.leftEnd}/>
      <div className={s.rightEnd}/>
    </div>
  )
}
