import { useState, type FormEvent } from "react"
import { Button, Input } from "@/shared/ui"
import { useFormState } from "@/shared/hooks"
import { useAuth } from "../AuthProvider"

export default function LoginForm() {
  const { login } = useAuth()
  const { bind, form, setField } = useFormState({ email: "", password: "" })
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    const result = await login(form.email, form.password)
    if (!result.ok) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        {...bind("email")}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        {...bind("password")}
      />
      {error && (
        <p
          className="text-xs font-semibold text-brown bg-honey-light rounded-lg px-3 py-2"
          role="alert"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" block className="mt-1">
        Entrar a la colmena
      </Button>
    </form>
  )
}
