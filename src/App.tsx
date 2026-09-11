import AppProviders from "@/app/providers/AppProviders"
import AppLayout from "@/app/layout/AppLayout"
import AppRouter from "@/app/router/AppRouter"
import { AuthPage, useAuth } from "@/features/auth"

/** Decides between the public auth screen and the authenticated shell. */
function AppShell() {
  const { user, logout } = useAuth()
  if (!user) return <AuthPage />
  return (
    <AppLayout user={user} onLogout={logout}>
      <AppRouter />
    </AppLayout>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  )
}
