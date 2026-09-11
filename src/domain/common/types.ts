/** Honey (HNY) es la moneda de la plataforma; BS es el token de recompensa. */
export type Currency = "HNY" | "BS"

export const CURRENCIES: Currency[] = ["HNY", "BS"]

export const CURRENCY_LABELS: Record<Currency, string> = {
  HNY: "Honey (HNY)",
  BS: "BS Token",
}

/** ISO date string `YYYY-MM-DD`. */
export type ISODate = string
