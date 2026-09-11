import { useState } from "react"
import { Button, Page, PageHeader } from "@/shared/ui"
import { Icon } from "@/shared/icons/Icon"
import { COLORS } from "@/shared/config/theme"
import { formatPrice } from "@/shared/lib/format"
import { MOCK_TRANSACTIONS } from "@/data/mocks"
import { useCurrentUser } from "@/features/auth"
import WalletAddressCard from "../components/WalletAddressCard"
import BalanceCard from "../components/BalanceCard"
import TransactionList from "../components/TransactionList"
import SendFundsModal from "../components/SendFundsModal"

export default function WalletPage() {
  const user = useCurrentUser()
  const [sendOpen, setSendOpen] = useState(false)

  return (
    <Page width="md">
      <PageHeader
        title="Reserva de Honey"
        description="Tu billetera Web3: Honey para comprar en Panales y tokens BS de recompensa."
      />
      <WalletAddressCard address={user.wallet.address} />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <BalanceCard
          symbol="HNY"
          name="Honey"
          subtitle="Moneda de la colmena"
          color={COLORS.honey}
          value={formatPrice(user.wallet.hny, "HNY")}
        />
        <BalanceCard
          symbol="BS"
          name="BS Token"
          subtitle="Recompensas de Panalium"
          color={COLORS.honeyLight}
          value={formatPrice(user.wallet.bs, "BS")}
        />
      </div>

      <div className="flex gap-3 mb-8">
        <Button>Recibir Honey</Button>
        <Button
          variant="secondary"
          className="text-foreground"
          onClick={() => setSendOpen(true)}
        >
          <Icon.send /> Enviar Honey
        </Button>
      </div>

      <h2 className="display text-xl font-bold mb-4">
        Movimientos de la colmena
      </h2>
      <TransactionList transactions={MOCK_TRANSACTIONS} />

      {sendOpen && <SendFundsModal onClose={() => setSendOpen(false)} />}
    </Page>
  )
}
