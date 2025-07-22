export function formatAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function formatIpfsUrl(url: string): string {
  return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
}

export function formatPrice(price: string, decimals: number): string {
  return (Number(price) / 10 ** decimals).toFixed(4).toLocaleString()
}

export function getInitials(name?: string): string {
  if (!name)
    return 'A'
  return name.charAt(0).toUpperCase()
}
