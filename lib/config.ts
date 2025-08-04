import { http, createConfig } from "wagmi"
import { mainnet, sepolia, base, baseGoerli } from "wagmi/chains"
import { injected, coinbaseWallet } from "wagmi/connectors"

// Only include WalletConnect if project ID is available
const getConnectors = () => {
  const connectors = [
    injected(),
    coinbaseWallet({
      appName: "SwapCrypt",
      appLogoUrl: "https://example.com/logo.png",
    }),
  ]

  // Only add WalletConnect if we have a valid project ID
  try {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    if (projectId && projectId !== "your-walletconnect-project-id") {
      const { walletConnect } = require("wagmi/connectors")
      connectors.push(walletConnect({ projectId }))
    }
  } catch (error) {
    console.warn("WalletConnect not configured:", error)
  }

  return connectors
}

export const config = createConfig({
  chains: [mainnet, sepolia, base, baseGoerli],
  connectors: getConnectors(),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseGoerli.id]: http(),
  },
  ssr: true,
})

export const SUPPORTED_CHAINS = [mainnet, sepolia, base, baseGoerli]
