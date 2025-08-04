"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState } from "react"
import { type Token, getTokensForChain } from "@/lib/tokens"
import { useChainId, useBalance, useAccount } from "wagmi"
import { formatUnits } from "viem"
import Image from "next/image"

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectModal({ isOpen, onClose, onSelectToken, selectedToken }: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const chainId = useChainId()
  const { address } = useAccount()

  const availableTokens = getTokensForChain(chainId)

  const filteredTokens = availableTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectToken = (token: Token) => {
    onSelectToken(token)
    onClose()
    setSearchQuery("")
  }

  const TokenBalance = ({ token }: { token: Token }) => {
    const { data: balance, error } = useBalance({
      address: address,
      token:
        token.address === "0x0000000000000000000000000000000000000000" ? undefined : (token.address as `0x${string}`),
      query: {
        enabled: !!address,
        retry: false,
      },
    })

    if (error) return <span className="text-muted-foreground">Error</span>
    if (!balance) return <span className="text-muted-foreground">0.0000</span>

    const formattedBalance = Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)
    return <span className="text-muted-foreground">{formattedBalance}</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Select a token</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="space-y-1 max-h-80 overflow-y-auto">
          {filteredTokens.map((token) => (
            <Button
              key={`${token.address}-${token.chainId}`}
              variant="ghost"
              onClick={() => handleSelectToken(token)}
              className="w-full justify-between h-16 px-3 hover:bg-muted/50"
              disabled={selectedToken?.address === token.address}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={token.logoURI || "/placeholder.svg"}
                  alt={token.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <div className="font-medium text-base">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <TokenBalance token={token} />
              </div>
            </Button>
          ))}
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No tokens found for this network</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
