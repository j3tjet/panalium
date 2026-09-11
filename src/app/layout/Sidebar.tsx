import { Icon } from "@/shared/icons/Icon"
import { cn } from "@/shared/lib/cn"
import { formatPrice } from "@/shared/lib/format"
import type { User } from "@/domain"
import { NAV_BY_ROLE, useNavigation } from "@/app/navigation"
import SidebarBrand from "./SidebarBrand"
import SidebarUser from "./SidebarUser"

export default function Sidebar({
  user,
  onLogout,
}: {
  user: User
  onLogout: () => void
}) {
  const { view, navigate } = useNavigation()
  const items = NAV_BY_ROLE[user.role]

  return (
    <aside className="w-[248px] shrink-0 bg-sidebar border-r border-border-dark flex flex-col h-screen sticky top-0 px-4 py-6 gap-6">
      <SidebarBrand />
      <SidebarUser user={user} />

      <nav
        className="flex-1 overflow-y-auto flex flex-col gap-1"
        aria-label="Navegación principal"
      >
        {items.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "nav-item flex items-center gap-3 h-11 px-3 rounded-xl w-full text-left text-sm font-semibold",
                active
                  ? "nav-item-active"
                  : item.nested
                    ? "text-faint"
                    : "text-secondary-foreground",
                item.nested && "pl-9",
              )}
            >
              {!item.nested && (
                <span
                  className="hex w-3 h-[13px] shrink-0"
                  style={{ background: active ? "#F2B705" : "transparent" }}
                />
              )}
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3.5 border border-border-dark rounded-2xl">
        <div className="label text-secondary-foreground">Reserva de Honey</div>
        <div className="mono text-lg font-semibold text-honey-light mt-1">
          {formatPrice(user.wallet.hny, "HNY")}{" "}
          <span className="text-xs text-secondary-foreground">HNY</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 px-3 h-10 w-full text-left text-[13px] text-faint hover:text-honey-light rounded-xl transition-colors"
      >
        <Icon.logout />
        Salir de la colmena
      </button>
    </aside>
  )
}
