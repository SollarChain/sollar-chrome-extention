import s from './svg-button.module.scss'
import { ButtonHTMLAttributes, DetailedHTMLProps, FC, HTMLAttributes } from 'react'

type Div = { notButton: true } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type Button = { notButton?: false } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

type Props = (Div | Button) & { onWhite?: boolean, disabled?: boolean }

export const SvgButton: FC<Props> = ({ children, className, notButton, disabled, onWhite, ...props }) => {
  if (notButton) {
    return <div
      {...props as any}
      className={`vanished ${s.button} ${className} ${onWhite && s.onWhite} ${disabled && s.disabled}`}
    >
      {children}
    </div>
  }
  return (
    <button
      {...props as any}
      className={`vanished ${s.button} ${className} ${onWhite && s.onWhite} ${disabled && s.disabled}`}
    >
      {children}
    </button>
  )
}
