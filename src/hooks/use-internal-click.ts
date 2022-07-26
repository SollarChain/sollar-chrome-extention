import { useEffect } from 'react'

type MouseEventHandler = (e: MouseEvent) => void

type Args = {
  onInternalClick?: MouseEventHandler,
  onExternalClick?: MouseEventHandler
}

export const useInternalClick = (className: string, { onInternalClick, onExternalClick }: Args) => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const isInternalClick = !!(e.target as Element).closest(`.${className}`)
      if (isInternalClick) {
        onInternalClick?.(e)
      } else {
        onExternalClick?.(e)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
