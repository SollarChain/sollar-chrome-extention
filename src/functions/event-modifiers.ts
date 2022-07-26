export const prevent = <T extends (...args: any) => any>(action: T) => (e: any) => {
  e.preventDefault()
  action(e)
}

export const stop = <T extends (...args: any) => any>(action: T) => (e: any) => {
  e.stopPropagation()
  action(e)
}
