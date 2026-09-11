import type { Transaction } from "@/domain"

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "deposit",
    label: "Depósito de Honey",
    amount: 500,
    currency: "HNY",
    date: "2025-01-28",
  },
  {
    id: "t2",
    type: "group",
    label: "Panal: Aceite de Oliva",
    amount: -135,
    currency: "HNY",
    date: "2025-01-20",
  },
  {
    id: "t3",
    type: "group",
    label: "Panal: Papel Higiénico",
    amount: -240,
    currency: "HNY",
    date: "2025-01-19",
  },
  {
    id: "t4",
    type: "reward",
    label: "Recompensa de la colmena",
    amount: 1500,
    currency: "BS",
    date: "2025-01-15",
  },
  {
    id: "t5",
    type: "group",
    label: "Panal: Auriculares Bluetooth",
    amount: -340,
    currency: "HNY",
    date: "2025-01-16",
  },
]
