import s from './button.module.scss'
import { ButtonHTMLAttributes, FC, RefAttributes } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

type ButtonType = 'primary' | 'secondary' | 'login-tertiary' | 'login-primary'

type Props = {
  variant: ButtonType
}

type ButtonProps = Props & ButtonHTMLAttributes<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({ children, variant, className, ...buttonProps }) => {
  return (
    <button {...buttonProps} className={`${s.button} ${s[variant]} ${className}`}>
      {children}
    </button>
  )
}

type NavProps = Props & {
  disabled?: boolean
} & NavLinkProps & RefAttributes<HTMLAnchorElement>

export const NavButton: FC<NavProps> = ({ children, variant, className, disabled, ...buttonProps }) => {
  return (
    <NavLink
      {...buttonProps}
      className={`${s.button} ${s[variant]} ${className} ${disabled && s.disabled}`}
    >
      {children}
    </NavLink>
  )
}


