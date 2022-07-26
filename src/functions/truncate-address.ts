export const truncateAddress = (address: string, sliceLength: number, remove0x = false) => {
  address = remove0x
    ? address.replace(/^0x/, '')
    : address

  const start = address.slice(0, sliceLength)
  const end = address.slice(address.length - sliceLength)

  return `${start}...${end}`
}

// const a = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
// console.log(truncateAddress(a, 5))
