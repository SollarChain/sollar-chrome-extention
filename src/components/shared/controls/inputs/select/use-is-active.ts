import { useState } from 'react'
import s from './select.module.scss'
import { useInternalClick } from '../../../../../hooks/use-internal-click'

export const useIsActive = () => {
  const [isActive, setIsActive] = useState(false)

  useInternalClick(
    s.wrapper,
    {
      onInternalClick: () => setIsActive(isActive => !isActive),
      onExternalClick: () => setIsActive(false)
    }
  )

  return { isActive }
}
