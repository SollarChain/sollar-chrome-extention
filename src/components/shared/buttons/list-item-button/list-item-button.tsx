import s from '../../../pages/without-layout/wallet-page/asset-list/asset-list.module.scss'
import { FC } from 'react'
import { SvgButton } from '../svg-button/svg-button'
import { NavLink } from 'react-router-dom'

type Props = {
  Icon: FC
  onClick?: () => void
  link: string
  text: string
}


export const ListItemButton = ({ Icon, onClick, text, link }: Props) => {
  return (
    <NavLink to={link} className={s.item} onClick={onClick}>
      <SvgButton onWhite className={s.icon}>
        <Icon/>
      </SvgButton>
      <div className={s.bigText}>{text}</div>
    </NavLink>
  )
}
