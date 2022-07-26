import React, {
  ButtonHTMLAttributes,
  FC,
  ReactElement,
  RefAttributes,
} from "react";

import { NavLink, NavLinkProps } from "react-router-dom";

import s from "./button.module.scss";

type ButtonType = "primary" | "secondary" | "tertiary";
type ButtonSize = "big" | "medium" | "small";

type Props = {
  type: ButtonType;
  /** 16-big 12-medium 8-small (padding-top)*/
  size: ButtonSize;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
};

export type ButtonProps = Props & {
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export const Button: FC<ButtonProps> = ({
  buttonProps,
  size,
  children,
  type,
  leftIcon,
  rightIcon,
}) => {
  return (
    <button
      {...buttonProps}
      className={`${s.button} ${s[type]} ${s[size]} ${buttonProps?.className}`}
    >
      {leftIcon && <span className={s["left-icon"]}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={s["right-icon"]}>{rightIcon}</span>}
    </button>
  );
};

type NavProps = Props & {
  buttonProps: NavLinkProps & RefAttributes<HTMLAnchorElement>;
  disabled?: boolean;
  children: string;
};

export const NavButton: FC<NavProps> = ({
  buttonProps,
  size,
  children,
  type,
  disabled,
  leftIcon,
  rightIcon,
}) => {
  return (
    <NavLink
      {...buttonProps}
      className={`${s.button} ${s[type]} ${s[size]} ${buttonProps?.className} ${
        disabled && s.disabled
      }`}
    >
      {leftIcon && <span className={s["left-icon"]}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={s["right-icon"]}>{rightIcon}</span>}
    </NavLink>
  );
};
