import { SwapInterface } from "@/components/swap-interface"
import { WalletConnect } from "@/components/wallet-connect"
import { NetworkSwitcher } from "@/components/network-switcher"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SwapCrypt
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <NetworkSwitcher />
            <WalletConnect />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multi-Chain Token Swap</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Trade tokens across Ethereum, Base, and testnets with support for MetaMask, WalletConnect, Coinbase
              Wallet, and more
            </p>
          </div>

          <SwapInterface />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Supports Ethereum Mainnet, Sepolia, Base, and Base Goerli</p>
            <p className="mt-1">Connect your wallet to view balances and execute swaps</p>
          </div>
        </div>
      </div>
    </div>
  )
}
