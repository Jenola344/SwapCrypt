"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/lib/config"
import { useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("An error occurred:", error)
    console.error("Component stack:", info.componentStack)
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={() => <div>An error occurred</div>} onError={handleError}>
          {children}
        </ErrorBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
