import { useState, type FormEvent } from "react"
import { Button, Input } from "@/shared/ui"
import { useFormState } from "@/shared/hooks"
import { useAuth } from "../AuthProvider"
import DemoAccountList from "./DemoAccountList"

export default function LoginForm() {
  const { login } = useAuth()
  const { bind, form } = useFormState({ email: "", password: "" })
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = login(form.email)
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
      <DemoAccountList onSelect={(email) => login(email)} />
    </form>
  )
}
