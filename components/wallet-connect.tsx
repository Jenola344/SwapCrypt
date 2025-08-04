"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"
import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from "wagmi"
import { formatEther } from "viem"
import Image from "next/image"

const WALLET_ICONS = {
  MetaMask: "/placeholder.svg?height=24&width=24&text=MM",
  WalletConnect: "/placeholder.svg?height=24&width=24&text=WC",
  "Coinbase Wallet": "/placeholder.svg?height=24&width=24&text=CB",
  Injected: "/placeholder.svg?height=24&width=24&text=W",
}

export function WalletConnect() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()

  const { data: balance } = useBalance({
    address: address,
  })

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const openEtherscan = () => {
    if (address) {
      const baseUrl =
        chainId === 1
          ? "https://etherscan.io"
          : chainId === 11155111
            ? "https://sepolia.etherscan.io"
            : chainId === 8453
              ? "https://basescan.org"
              : chainId === 84531
                ? "https://goerli.basescan.org"
                : "https://etherscan.io"
      window.open(`${baseUrl}/address/${address}`, "_blank")
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-medium bg-transparent">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{formatAddress(address)}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-3">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-lg font-semibold">
              {balance ? `${Number.parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : "0.0000 ETH"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{formatAddress(address)}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openEtherscan}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="font-medium">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {connectors
              .filter(
                (connector) => connector.name !== "WalletConnect" || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
              )
              .map((connector) => (
                <Button
                  key={connector.uid}
                  variant="outline"
                  onClick={() => {
                    try {
                      connect({ connector })
                      setIsModalOpen(false)
                    } catch (error) {
                      console.error("Connection error:", error)
                    }
                  }}
                  disabled={isPending}
                  className="w-full justify-start h-12"
                >
                  <Image
                    src={WALLET_ICONS[connector.name as keyof typeof WALLET_ICONS] || WALLET_ICONS["Injected"]}
                    alt={connector.name}
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  {connector.name}
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
