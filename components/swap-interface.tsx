"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronDown, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { type Token, getTokensForChain, isNativeToken } from "@/lib/tokens"
import { TokenSelectModal } from "./token-select-modal"
import { useChainId, useBalance, useAccount, useSendTransaction, useWriteContract } from "wagmi"
import { formatUnits, parseUnits, parseEther } from "viem"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

// ERC20 ABI for token transfers
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

export function SwapInterface() {
  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const { sendTransaction } = useSendTransaction()
  const { writeContract } = useWriteContract()

  const availableTokens = getTokensForChain(chainId)
  const [fromToken, setFromToken] = useState<Token | undefined>(availableTokens[0])
  const [toToken, setToToken] = useState<Token | undefined>(availableTokens[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isFromModalOpen, setIsFromModalOpen] = useState(false)
  const [isToModalOpen, setIsToModalOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  // Update tokens when chain changes
  useEffect(() => {
    const newTokens = getTokensForChain(chainId)
    if (newTokens.length > 0) {
      setFromToken(newTokens[0])
      setToToken(newTokens[1] || newTokens[0])
    }
  }, [chainId])

  // Get balance for from token
  const { data: fromBalance, error: fromBalanceError } = useBalance({
    address: address,
    token: fromToken && !isNativeToken(fromToken.address) ? (fromToken.address as `0x${string}`) : undefined,
    query: {
      enabled: !!address && !!fromToken,
      retry: false,
    },
  })

  // Get balance for to token
  const { data: toBalance, error: toBalanceError } = useBalance({
    address: address,
    token: toToken && !isNativeToken(toToken.address) ? (toToken.address as `0x${string}`) : undefined,
    query: {
      enabled: !!address && !!toToken,
      retry: false,
    },
  })

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    // Mock exchange rate calculation (in real app, you'd use a DEX API)
    if (value && !isNaN(Number(value)) && Number(value) > 0) {
      const rate = fromToken?.symbol === toToken?.symbol ? 1 : 0.998 // Mock rate
      setToAmount((Number(value) * rate).toFixed(6))
    } else {
      setToAmount("")
    }
  }

  const handleSwap = async () => {
    if (!isConnected || !address || !fromToken || !toToken || !fromAmount) {
      toast({
        title: "Error",
        description: "Please connect wallet and fill all fields",
        variant: "destructive",
      })
      return
    }

    setIsSwapping(true)

    try {
      // This is a simplified swap - in reality you'd interact with a DEX contract
      const amount = parseUnits(fromAmount, fromToken.decimals)

      if (isNativeToken(fromToken.address)) {
        // Sending native ETH
        await sendTransaction({
          to: address, // Sending to self for demo
          value: parseEther(fromAmount),
        })
      } else {
        // Sending ERC20 token
        await writeContract({
          address: fromToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [address, amount], // Sending to self for demo
        })
      }

      toast({
        title: "Swap Initiated",
        description: "Your swap transaction has been submitted",
      })

      // Reset form
      setFromAmount("")
      setToAmount("")
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const formatBalance = (balance: any, error: any) => {
    if (error) return "Error"
    if (!balance) return "0.0000"
    return Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)
  }

  const canSwap = isConnected && fromToken && toToken && fromAmount && Number(fromAmount) > 0

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Swap</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {/* From Token */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-sm text-muted-foreground">
                  Balance: {formatBalance(fromBalance, fromBalanceError)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="border-0 bg-transparent text-2xl font-medium p-0 h-auto focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  onClick={() => setIsFromModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-3 bg-background hover:bg-muted rounded-full"
                >
                  {fromToken ? (
                    <>
                      <Image
                        src={fromToken.logoURI || "/placeholder.svg"}
                        alt={fromToken.symbol}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-medium">{fromToken.symbol}</span>
                    </>
                  ) : (
                    <span>Select token</span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapTokens}
                className="h-10 w-10 rounded-full bg-background border-4 border-background hover:bg-muted"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm text-muted-foreground">
                  Balance: {formatBalance(toBalance, toBalanceError)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="border-0 bg-transparent text-2xl font-medium p-0 h-auto focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  onClick={() => setIsToModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-3 bg-background hover:bg-muted rounded-full"
                >
                  {toToken ? (
                    <>
                      <Image
                        src={toToken.logoURI || "/placeholder.svg"}
                        alt={toToken.symbol}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="font-medium">{toToken.symbol}</span>
                    </>
                  ) : (
                    <span>Select token</span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {fromAmount && toAmount && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>
                  1 {fromToken?.symbol} = 0.998 {toToken?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Network fee</span>
                <span>~$2.50</span>
              </div>
            </div>
          )}

          <Button
            className="w-full mt-4 h-12 text-base font-medium"
            disabled={!canSwap || isSwapping}
            onClick={handleSwap}
          >
            {!isConnected
              ? "Connect Wallet"
              : !fromToken || !toToken
                ? "Select a token"
                : !fromAmount
                  ? "Enter an amount"
                  : isSwapping
                    ? "Swapping..."
                    : "Swap"}
          </Button>
        </CardContent>
      </Card>

      <TokenSelectModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSelectToken={setFromToken}
        selectedToken={toToken}
      />

      <TokenSelectModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        onSelectToken={setToToken}
        selectedToken={fromToken}
      />
    </div>
  )
}
