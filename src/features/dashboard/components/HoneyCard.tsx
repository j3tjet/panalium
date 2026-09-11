import { Button, Card, Hex } from "@/shared/ui"
import { COLORS } from "@/shared/config/theme"
import { formatPrice } from "@/shared/lib/format"
import type { Wallet } from "@/domain"
import { useNavigation } from "@/app/navigation"

/** Tarjeta grande de la Reserva de Honey en Mi Colmena. */
export default function HoneyCard({ wallet }: { wallet: Wallet }) {
  const { navigate } = useNavigation()
  return (
    <Card className="p-6 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="label">Reserva de Honey</span>
        <Hex size={28} color={COLORS.honey} />
      </div>
      <p className="mono text-[38px] font-semibold leading-none">
        {formatPrice(wallet.hny, "HNY")}{" "}
        <span className="text-base text-muted-foreground">HNY</span>
      </p>
      <p className="text-xs text-muted-foreground">
        ≈ {formatPrice(wallet.hny, "HNY", 0)} USDT ·{" "}
        {formatPrice(wallet.bs, "BS")} BS en tokens de recompensa
      </p>
      <div className="flex gap-2">
        <Button variant="danger" size="sm" onClick={() => navigate("wallet")}>
          Enviar Honey
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("wallet")}
        >
          Recibir
        </Button>
      </div>
    </Card>
  )
}
