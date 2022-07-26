import s from './hideable-input.module.scss'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react'
import { SvgButton } from '../../../buttons/svg-button/svg-button'
import { ReactComponent as ClosedEye } from '../../../../../assets/images/closed-eye.svg'
import { ReactComponent as OpenedEye } from '../../../../../assets/images/opened-eye.svg'
import { stop } from '../../../../../functions/event-modifiers'

export type IHideableInput = {
  isHidden: boolean
  value: string
}

type Props = {
  isHidden: boolean
  toggleIsHidden: () => void
  label?: string | number | undefined
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>


export const HideableInput = forwardRef(({ isHidden, toggleIsHidden, label, className, ...inputProps }: Props, ref) => {
  return (
    <label className={`${s.wrapper} ${className || ''}`}>
      {label && <span className={s.label}>{label}</span>}
      <div className={`${s.field} ${label ? s.withLabel : ''}`}>
        <input ref={ref as any} {...inputProps} type={isHidden ? 'password' : 'text'}/>
        {
          isHidden
            ? <SvgButton onClick={stop(toggleIsHidden)} type="button" className={s.eye}><ClosedEye/></SvgButton>
            : <SvgButton onClick={stop(toggleIsHidden)} type="button" className={s.eye}><OpenedEye/></SvgButton>
        }
      </div>
    </label>
  )
})
