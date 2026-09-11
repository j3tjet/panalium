import { COLORS } from "@/shared/config/theme"

export interface DemoAccountShortcut {
  label: string
  email: string
  color: string
}

/** Accesos rápidos de la pantalla de entrada. Los correos deben existir en MOCK_USERS. */
export const DEMO_SHORTCUTS: DemoAccountShortcut[] = [
  { label: "Abeja", email: "carlos@mail.com", color: COLORS.honey },
  { label: "Proveedor", email: "mayorista@distperez.com", color: COLORS.olive },
  { label: "Guardián", email: "admin@panalium.io", color: COLORS.honeyLight },
]
