"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Wifi } from "lucide-react"
import { useChainId, useSwitchChain } from "wagmi"
import { SUPPORTED_CHAINS } from "@/lib/config"

const CHAIN_COLORS = {
  1: "bg-blue-500",
  11155111: "bg-purple-500",
  8453: "bg-blue-600",
  84531: "bg-blue-400",
}

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-medium bg-transparent">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${CHAIN_COLORS[chainId as keyof typeof CHAIN_COLORS] || "bg-gray-500"}`}
            ></div>
            <span>{currentChain?.name || "Unknown"}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_CHAINS.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={chainId === chain.id ? "bg-muted" : ""}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${CHAIN_COLORS[chain.id as keyof typeof CHAIN_COLORS] || "bg-gray-500"}`}
              ></div>
              <span>{chain.name}</span>
              {chainId === chain.id && <Wifi className="w-4 h-4 ml-auto" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
