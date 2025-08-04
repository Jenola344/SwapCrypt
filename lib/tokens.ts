export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  chainId: number
}

export const TOKENS_BY_CHAIN: Record<number, Token[]> = {
  // Ethereum Mainnet
  [1]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 1,
    },
    {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 1,
    },
    {
      address: "0xA0b86a33E6441b8C4505B6B8C0E4F7c4E4B4F4B4",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 1,
    },
    {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      name: "Tether USD",
      decimals: 6,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 1,
    },
  ],
  // Sepolia Testnet
  [11155111]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 11155111,
    },
    {
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 11155111,
    },
  ],
  // Base Mainnet
  [8453]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 8453,
    },
    {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 8453,
    },
    {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 8453,
    },
  ],
  // Base Goerli Testnet
  [84531]: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 84531,
    },
    {
      address: "0x4200000000000000000000000000000000000006",
      symbol: "WETH",
      name: "Wrapped Ether",
      decimals: 18,
      logoURI: "/placeholder.svg?height=32&width=32",
      chainId: 84531,
    },
  ],
}

export const getTokensForChain = (chainId: number): Token[] => {
  return TOKENS_BY_CHAIN[chainId] || []
}

export const getTokenByAddress = (address: string, chainId: number): Token | undefined => {
  const tokens = getTokensForChain(chainId)
  return tokens.find((token) => token.address.toLowerCase() === address.toLowerCase())
}

export const isNativeToken = (address: string): boolean => {
  return address === "0x0000000000000000000000000000000000000000"
}
