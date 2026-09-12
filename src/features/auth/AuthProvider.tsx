import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { RegisterUserInput, User } from "@/domain"
import { homeViewForRole, useNavigation } from "@/app/navigation"
import { fail, ok, type ActionResult } from "@/shared/lib/result"
import { auth, db } from "@/shared/config/firebaseClient"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

export type AuthResult = ActionResult

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<ActionResult>
  register: (input: RegisterUserInput & { password: string }) => Promise<ActionResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
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
    async (email, password) => {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        const u = credential.user
        const docRef = doc(db, "users", u.uid)
        const snap = await getDoc(docRef)
        const p = snap.exists() ? snap.data() : {}
        const mapped: User = {
          id: u.uid,
          name: p.displayName || u.displayName || "",
          email: u.email || email,
          phone: p.phone || "",
          role: p.role || "buyer",
          wallet: { hny: 0, bs: 0, address: "" },
          createdAt: p.createdAt?._seconds ? new Date(p.createdAt._seconds * 1000).toISOString() : new Date().toISOString(),
          verified: !!u.emailVerified,
        }
        signIn(mapped)
        return ok
      } catch (err: any) {
        const code = err?.code || ''
        console.warn('Firebase login error', code, err)
        if (typeof code === 'string') {
          if (code.includes('wrong-password')) return fail('Contraseña incorrecta.')
          if (code.includes('user-not-found')) return fail('No existe una cuenta con ese correo.')
          if (code.includes('invalid-email')) return fail('Formato de correo inválido.')
          if (code.includes('user-disabled')) return fail('Cuenta deshabilitada. Contacta al soporte.')
          if (code.includes('invalid-credential')) return fail('Credenciales inválidas. Intenta limpiar caché o revisar configuración.')
        }
        return fail(err?.message || String(err))
      }
    },
    [signIn],
  )

  const register = useCallback<AuthContextValue["register"]>(
    async (input) => {
      try {
        // create user with Firebase client SDK
        const credential = await createUserWithEmailAndPassword(auth, input.email, (input as any).password)
        const u = credential.user
        // update displayName
        await updateProfile(u, { displayName: input.name })
        // ensure role cannot be 'admin'
        const role = input.role === "wholesaler" ? "wholesaler" : "buyer"
        const docRef = doc(db, "users", u.uid)
        await setDoc(docRef, {
          email: input.email,
          displayName: input.name,
          phone: input.phone,
          role,
          createdAt: serverTimestamp(),
        })
        const mapped: User = {
          id: u.uid,
          name: input.name,
          email: input.email,
          phone: input.phone,
          role,
          wallet: { hny: 0, bs: 0, address: "" },
          createdAt: new Date().toISOString(),
          verified: !!u.emailVerified,
        }
        signIn(mapped)
        return ok
      } catch (err: any) {
        // firebase client throws FirebaseError with `code` like 'auth/email-already-in-use'
        const code = err?.code || ''
        if (typeof code === 'string' && code.includes('email-already-in-use')) {
          return fail('El correo ya está registrado. Por favor inicia sesión o recupera la contraseña.')
        }
        return fail(err?.message || String(err))
      }
    },
    [signIn],
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
