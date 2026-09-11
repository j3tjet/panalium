import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { createUser, type RegisterUserInput, type User } from "@/domain"
import { useAppDispatch, useAppState, usersActions } from "@/store"
import { homeViewForRole, useNavigation } from "@/app/navigation"
import { fail, ok, type ActionResult } from "@/shared/lib/result"

export type AuthResult = ActionResult

interface AuthContextValue {
  user: User | null
  /** Mock login: only the email is checked against known accounts. */
  login: (email: string) => AuthResult
  register: (input: RegisterUserInput) => AuthResult
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useAppState()
  const dispatch = useAppDispatch()
  const { navigate, reset } = useNavigation()
  const [user, setUser] = useState<User | null>(null)

  const signIn = useCallback(
    (u: User) => {
      setUser(u)
      navigate(homeViewForRole(u.role))
    },
    [navigate],
  )

  const login = useCallback<AuthContextValue["login"]>(
    (email) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (!found)
        return fail(
          "No encontramos esa Abeja. Revisa el correo o registra una nueva.",
        )
      signIn(found)
      return ok
    },
    [users, signIn],
  )

  const register = useCallback<AuthContextValue["register"]>(
    (input) => {
      if (
        users.some(
          (u) => u.email.toLowerCase() === input.email.trim().toLowerCase(),
        )
      ) {
        return fail("Ya existe una Abeja con ese correo.")
      }
      const newUser = createUser(input)
      dispatch(usersActions.add(newUser))
      signIn(newUser)
      return ok
    },
    [users, dispatch, signIn],
  )

  const logout = useCallback(() => {
    setUser(null)
    reset()
  }, [reset])

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

/** Same as `useAuth` but guarantees a signed-in user; use inside protected screens. */
export function useCurrentUser(): User {
  const { user } = useAuth()
  if (!user) throw new Error("useCurrentUser requires an authenticated user")
  return user
}
