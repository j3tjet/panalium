import { DEMO_SHORTCUTS } from "@/data/mocks"

export default function DemoAccountList({
  onSelect,
}: {
  onSelect: (email: string) => void
}) {
  return (
    <div className="border-t border-border pt-4 mt-2">
      <p className="text-xs text-muted-foreground text-center mb-3">
        Acceso rápido (demo)
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_SHORTCUTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelect(acc.email)}
            className="flex items-center justify-between h-11 px-3.5 rounded-xl border-[1.5px] border-border hover:border-brown text-[13px] text-left transition-colors bg-surface"
          >
            <span className="flex items-center gap-2 font-bold text-brown">
              <span
                className="hex w-3.5 h-4"
                style={{ background: acc.color }}
              />
              {acc.label}
            </span>
            <span className="text-muted-foreground">{acc.email}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
