import type { ReactNode } from "react"
import { StoreProvider } from "@/store"
import { ToastProvider } from "@/shared/ui"
import { NavigationProvider } from "@/app/navigation"
import { AuthProvider } from "@/features/auth"

/** Global providers, outermost first. Auth depends on Store and Navigation. */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ToastProvider>
        <NavigationProvider>
          <AuthProvider>{children}</AuthProvider>
        </NavigationProvider>
      </ToastProvider>
    </StoreProvider>
  )
}
