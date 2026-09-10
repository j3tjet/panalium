import { useState } from "react";
import { User, View, BuyingGroup, Product, GroupMember, ERC1155Token, NFTListing } from "./types";
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_GROUPS, MOCK_TOKENS, MOCK_LISTINGS, DEMO_ACCOUNTS } from "./store";

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────
const Icon = {
  wallet: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="15" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  store: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l1-5h16l1 5" /><rect x="2" y="9" width="20" height="12" rx="1" /><path d="M9 21V12h6v9" />
    </svg>
  ),
  users: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  group: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  globe: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  chart: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  package: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  logout: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  link: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  arrow: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  shield: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  copy: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  flame: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M8.5 14c0-4 4.5-10 4.5-10s4.5 6 4.5 10a4.5 4.5 0 01-9 0z" /><path d="M12 19c0-2 2-4 2-4s2 2 2 4" />
    </svg>
  ),
  tag: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  send: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  x: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ─── Utility components ───────────────────────────────────────────────────────
function Badge({ type }: { type: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    open:              { cls: "badge-open",   label: "Abierto" },
    funded:            { cls: "badge-funded", label: "Financiado" },
    paid_to_supplier:  { cls: "badge-intl",   label: "Pagado al proveedor" },
    international:     { cls: "badge-intl",   label: "Internacional" },
    closed:            { cls: "badge-closed", label: "Cerrado" },
    cancelled:         { cls: "badge-closed", label: "Cancelado" },
  };
  const { cls, label } = map[type] ?? { cls: "badge-closed", label: type };
  return <span className={`${cls} text-xs font-medium px-2 py-0.5 rounded-full`}>{label}</span>;
}

function Progress({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</label>
      <input
        {...props}
        className="bg-[#0f1a2e] border border-[#1a2a42] rounded-lg px-3 py-2.5 text-sm text-[#dde3ed] placeholder-[#334155] w-full"
      />
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</label>
      <textarea
        {...props}
        className="bg-[#0f1a2e] border border-[#1a2a42] rounded-lg px-3 py-2.5 text-sm text-[#dde3ed] placeholder-[#334155] w-full resize-none"
      />
    </div>
  );
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">{label}</label>
      <select
        {...props}
        className="bg-[#0f1a2e] border border-[#1a2a42] rounded-lg px-3 py-2.5 text-sm text-[#dde3ed] w-full"
      >
        {children}
      </select>
    </div>
  );
}

function Btn({
  children, variant = "primary", size = "md", onClick, disabled, className = "", type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all cursor-pointer";
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2", lg: "text-base px-5 py-2.5" };
  const variants = {
    primary: "bg-[#3b7bff] text-white hover:bg-[#2d6bef] active:scale-95",
    secondary: "bg-[#111c30] text-[#a8b8d0] border border-[#1a2a42] hover:bg-[#162038] hover:text-white active:scale-95",
    ghost: "text-[#64748b] hover:text-[#dde3ed] hover:bg-[#111c30] active:scale-95",
    accent: "bg-[#10b981] text-white hover:bg-[#0da372] active:scale-95",
    danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] active:scale-95",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0d1526] border border-[#1a2a42] rounded-xl ${onClick ? "card-hover cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── AUTH VIEW ────────────────────────────────────────────────────────────────
function AuthView({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "buyer" as "buyer" | "wholesaler" });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const demoAccounts = [
    { label: "Comprador", email: "carlos@mail.com", color: "#3b7bff" },
    { label: "Mayorista", email: "mayorista@distperez.com", color: "#10b981" },
    { label: "Administrador", email: "admin@compraya.io", color: "#f59e0b" },
  ];

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const uid = DEMO_ACCOUNTS[form.email];
    if (!uid) { setError("Correo no encontrado."); return; }
    const user = MOCK_USERS.find((u) => u.id === uid);
    if (user) onAuth(user);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Completa todos los campos.");
      return;
    }
    const addr = "0x" + Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
    const newUser: User = {
      id: "new-" + Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      wallet: { usdt: 0, bs: 0, address: addr },
      createdAt: new Date().toISOString().split("T")[0],
      verified: false,
    };
    MOCK_USERS.push(newUser);
    DEMO_ACCOUNTS[form.email] = newUser.id;
    onAuth(newUser);
  }

  function quickLogin(email: string) {
    const uid = DEMO_ACCOUNTS[email];
    const user = MOCK_USERS.find((u) => u.id === uid);
    if (user) onAuth(user);
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3b7bff] flex items-center justify-center">
              <Icon.group />
            </div>
            <span className="text-2xl font-bold tracking-tight">CompraYa</span>
          </div>
          <p className="text-sm text-[#64748b]">Plataforma Web3 de compra grupal al mayor</p>
        </div>

        <Card className="p-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#080c14] rounded-lg p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === m ? "bg-[#0d1526] text-white shadow" : "text-[#64748b] hover:text-white"
                }`}
              >
                {m === "login" ? "Iniciar Sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Contraseña" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Btn type="submit" size="lg" className="w-full justify-center mt-1">Entrar</Btn>

              {/* Quick demo access */}
              <div className="border-t border-[#1a2a42] pt-4 mt-2">
                <p className="text-xs text-[#64748b] text-center mb-3">Acceso rápido (demo)</p>
                <div className="flex flex-col gap-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => quickLogin(acc.email)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border border-[#1a2a42] hover:border-[#2a3e5a] text-xs text-left transition-colors"
                    >
                      <span className="font-medium" style={{ color: acc.color }}>{acc.label}</span>
                      <span className="text-[#64748b]">{acc.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input label="Nombre completo / Empresa" placeholder="Carlos Mendoza" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Número de celular" type="tel" placeholder="+58 412 555-0000" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Select label="Tipo de cuenta" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "buyer" | "wholesaler" })}>
                <option value="buyer">Comprador</option>
                <option value="wholesaler">Mayorista</option>
              </Select>

              <div className="bg-[#080c14] rounded-lg p-3 border border-[#1a2a42]">
                <div className="flex items-start gap-2">
                  <Icon.shield />
                  <div>
                    <p className="text-xs font-medium text-[#dde3ed] mb-0.5">Verificación anti-multicuentas</p>
                    <p className="text-xs text-[#64748b]">El número de celular es único por cuenta. Se verificará mediante SMS.</p>
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}
              <Btn type="submit" size="lg" className="w-full justify-center">
                Crear cuenta y billetera
              </Btn>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-[#334155] mt-4">
          Al registrarte, se crea automáticamente tu billetera Web3
        </p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, view, setView, onLogout }: {
  user: User; view: View; setView: (v: View) => void; onLogout: () => void;
}) {
  const buyerNav = [
    { id: "dashboard" as View, icon: <Icon.chart />, label: "Dashboard" },
    { id: "wallet" as View, icon: <Icon.wallet />, label: "Mi Billetera" },
    { id: "marketplace-products" as View, icon: <Icon.store />, label: "Marketplace" },
    { id: "marketplace-groups" as View, icon: <Icon.users />, label: "Grupos de Compra" },
    { id: "my-groups" as View, icon: <Icon.group />, label: "Mis Grupos" },
    { id: "create-group" as View, icon: <Icon.plus />, label: "Crear Grupo Local" },
    { id: "create-intl-group" as View, icon: <Icon.globe />, label: "Grupo Internacional" },
    { id: "my-receipts" as View, icon: <Icon.package />, label: "Mis Recibos NFT" },
    { id: "nft-marketplace" as View, icon: <Icon.link />, label: "Mercado Secundario" },
  ];
  const wholesalerNav = [
    { id: "dashboard" as View, icon: <Icon.chart />, label: "Dashboard" },
    { id: "wallet" as View, icon: <Icon.wallet />, label: "Mi Billetera" },
    { id: "wholesaler-products" as View, icon: <Icon.package />, label: "Mis Productos" },
    { id: "wholesaler-add-product" as View, icon: <Icon.plus />, label: "Agregar Producto" },
    { id: "marketplace-groups" as View, icon: <Icon.users />, label: "Grupos de Compradores" },
  ];
  const adminNav = [
    { id: "admin-overview" as View, icon: <Icon.chart />, label: "Resumen" },
    { id: "admin-users" as View, icon: <Icon.users />, label: "Usuarios" },
    { id: "marketplace-products" as View, icon: <Icon.store />, label: "Productos" },
    { id: "marketplace-groups" as View, icon: <Icon.group />, label: "Grupos" },
  ];

  const nav = user.role === "admin" ? adminNav : user.role === "wholesaler" ? wholesalerNav : buyerNav;
  const roleLabel = user.role === "admin" ? "Administrador" : user.role === "wholesaler" ? "Mayorista" : "Comprador";
  const roleColor = user.role === "admin" ? "#f59e0b" : user.role === "wholesaler" ? "#10b981" : "#3b7bff";

  return (
    <aside className="w-60 shrink-0 bg-[#0a0f1c] border-r border-[#1a2a42] flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="p-5 border-b border-[#1a2a42]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3b7bff] flex items-center justify-center shrink-0">
            <Icon.group />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">CompraYa</div>
            <div className="text-[10px] mono text-[#64748b]">Web3 Mayoreo</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-b border-[#1a2a42]">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#111c30] flex items-center justify-center text-sm font-semibold" style={{ color: roleColor }}>
              {user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{user.name}</p>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${roleColor}18`, color: roleColor }}>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg w-full text-left text-sm ${
              view === item.id ? "nav-item-active text-white" : "text-[#64748b]"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#1a2a42]">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm text-[#64748b] hover:text-red-400 rounded-lg hover:bg-[#1a0a0a] transition-colors"
        >
          <Icon.logout />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ user, setView }: { user: User; setView: (v: View) => void }) {
  const myGroups = MOCK_GROUPS.filter(
    (g) => g.creatorId === user.id || g.members.some((m) => m.userId === user.id)
  );
  const totalInvested = myGroups.reduce((acc, g) => {
    const m = g.members.find((m) => m.userId === user.id);
    return acc + (m?.paid || 0);
  }, 0);

  const stats =
    user.role === "admin"
      ? [
          { label: "Usuarios Totales", value: MOCK_USERS.length.toString(), sub: "registrados" },
          { label: "Grupos Activos", value: MOCK_GROUPS.filter((g) => g.status === "open").length.toString(), sub: "abiertos" },
          { label: "Productos", value: MOCK_PRODUCTS.length.toString(), sub: "en catálogo" },
          { label: "Volumen USDT", value: "$" + MOCK_GROUPS.reduce((a, g) => a + g.currentUnits * g.unitPrice, 0).toFixed(0), sub: "comprometido" },
        ]
      : user.role === "wholesaler"
      ? [
          { label: "Mis Productos", value: MOCK_PRODUCTS.filter((p) => p.wholesalerId === user.id).length.toString(), sub: "publicados" },
          { label: "Balance USDT", value: "$" + user.wallet.usdt.toLocaleString(), sub: "disponible" },
          { label: "Balance BS", value: user.wallet.bs.toLocaleString(), sub: "tokens" },
          { label: "Grupos Interesados", value: MOCK_GROUPS.filter((g) => g.productId && MOCK_PRODUCTS.find((p) => p.wholesalerId === user.id && p.id === g.productId)).length.toString(), sub: "en mis productos" },
        ]
      : [
          { label: "Balance USDT", value: "$" + user.wallet.usdt.toLocaleString(), sub: "disponible" },
          { label: "Balance BS", value: user.wallet.bs.toLocaleString(), sub: "tokens" },
          { label: "Mis Grupos", value: myGroups.length.toString(), sub: "activos" },
          { label: "Invertido", value: "$" + totalInvested.toFixed(2), sub: "en grupos" },
        ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          Bienvenido, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[#64748b]">
          {user.role === "admin"
            ? "Panel de administración — CompraYa"
            : user.role === "wholesaler"
            ? "Gestiona tus productos y observa los grupos de compradores"
            : "Únete a grupos de compra o crea el tuyo para comprar al mayor"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-[#64748b] mb-1">{s.label}</p>
            <p className="text-2xl font-bold mono mb-0.5">{s.value}</p>
            <p className="text-xs text-[#334155]">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Recent groups */}
      {user.role !== "wholesaler" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Grupos recientes</h2>
            <Btn variant="ghost" size="sm" onClick={() => setView("marketplace-groups")}>Ver todos <Icon.arrow /></Btn>
          </div>
          <div className="grid gap-3">
            {MOCK_GROUPS.slice(0, 3).map((g) => (
              <GroupCard key={g.id} group={g} onClick={() => setView("marketplace-groups")} />
            ))}
          </div>
        </div>
      )}

      {user.role === "buyer" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-dashed cursor-pointer hover:border-[#3b7bff] transition-colors" onClick={() => setView("create-group")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#3b7bff1a] flex items-center justify-center text-[#3b7bff]"><Icon.plus /></div>
              <span className="font-medium text-sm">Crear grupo local</span>
            </div>
            <p className="text-xs text-[#64748b]">Reúne compradores para adquirir productos nacionales al por mayor.</p>
          </Card>
          <Card className="p-5 border-dashed cursor-pointer hover:border-[#f59e0b] transition-colors" onClick={() => setView("create-intl-group")}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b1a] flex items-center justify-center text-[#f59e0b]"><Icon.globe /></div>
              <span className="font-medium text-sm">Importación grupal</span>
            </div>
            <p className="text-xs text-[#64748b]">Organiza compras internacionales desde Alibaba u otras plataformas.</p>
          </Card>
        </div>
      )}

      {user.role === "wholesaler" && (
        <div className="grid gap-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Mis Productos</h2>
            <Btn variant="primary" size="sm" onClick={() => setView("wholesaler-add-product")}><Icon.plus /> Agregar</Btn>
          </div>
          {MOCK_PRODUCTS.filter((p) => p.wholesalerId === user.id).map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <Card className="flex items-center gap-4 p-3">
      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#111c30]" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.name}</p>
        <p className="text-xs text-[#64748b]">{product.category} · Mín. {product.minUnits} unidades</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold mono">{product.currency === "USDT" ? "$" : ""}{product.unitPrice} {product.currency}</p>
        <span className="text-[10px] text-[#10b981]">● Disponible</span>
      </div>
    </Card>
  );
}

// ─── WALLET VIEW ──────────────────────────────────────────────────────────────
function WalletView({ user }: { user: User }) {
  const [copied, setCopied] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({ to: "", amount: "", currency: "USDT" });

  function copyAddr() {
    navigator.clipboard.writeText(user.wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const txns = [
    { id: "t1", type: "deposit", label: "Depósito USDT", amount: "+500.00", currency: "USDT", date: "2025-01-28", color: "#10b981" },
    { id: "t2", type: "group", label: "Grupo: Aceite de Oliva", amount: "-135.00", currency: "USDT", date: "2025-01-20", color: "#3b7bff" },
    { id: "t3", type: "group", label: "Grupo: Papel Higiénico", amount: "-240.00", currency: "USDT", date: "2025-01-19", color: "#3b7bff" },
    { id: "t4", type: "reward", label: "Recompensa BS tokens", amount: "+1500", currency: "BS", date: "2025-01-15", color: "#f59e0b" },
    { id: "t5", type: "group", label: "Grupo: Auriculares Bluetooth", amount: "-340.00", currency: "USDT", date: "2025-01-16", color: "#3b7bff" },
  ];

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Mi Billetera</h1>

      {/* Wallet address */}
      <Card className="p-4 mb-4">
        <p className="text-xs text-[#64748b] mb-1">Dirección de billetera</p>
        <div className="flex items-center gap-2">
          <code className="mono text-sm text-[#dde3ed] truncate flex-1">{user.wallet.address}</code>
          <button onClick={copyAddr} className="shrink-0 text-[#64748b] hover:text-white transition-colors p-1">
            {copied ? <Icon.check /> : <Icon.copy />}
          </button>
        </div>
        {copied && <p className="text-xs text-[#10b981] mt-1">¡Copiado!</p>}
      </Card>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#26a17b22", color: "#26a17b" }}>₮</div>
            <span className="text-sm font-medium text-[#64748b]">USDT</span>
          </div>
          <p className="text-3xl font-bold mono">{user.wallet.usdt.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-[#64748b] mt-1">Tether USD</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#f59e0b22", color: "#f59e0b" }}>Bs</div>
            <span className="text-sm font-medium text-[#64748b]">BS Token</span>
          </div>
          <p className="text-3xl font-bold mono">{user.wallet.bs.toLocaleString("es-VE")}</p>
          <p className="text-xs text-[#64748b] mt-1">Token CompraYa</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <Btn variant="primary" onClick={() => {}}>
          Depositar
        </Btn>
        <Btn variant="secondary" onClick={() => setSendModal(true)}>
          <Icon.send /> Enviar
        </Btn>
        <Btn variant="secondary" onClick={() => {}}>
          Historial completo
        </Btn>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="font-semibold mb-4">Movimientos recientes</h2>
        <Card className="divide-y divide-[#1a2a42]">
          {txns.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ background: `${t.color}18`, color: t.color }}>
                  {t.type === "deposit" ? "↓" : t.type === "reward" ? "★" : "↑"}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-[#64748b]">{t.date}</p>
                </div>
              </div>
              <span className="mono text-sm font-semibold" style={{ color: t.amount.startsWith("+") ? "#10b981" : "#dde3ed" }}>
                {t.amount} {t.currency}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Send modal */}
      {sendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSendModal(false)}>
          <Card className="w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Enviar fondos</h3>
              <button onClick={() => setSendModal(false)} className="text-[#64748b] hover:text-white"><Icon.x /></button>
            </div>
            <div className="flex flex-col gap-4">
              <Input label="Dirección destino" placeholder="0x..." value={sendForm.to} onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })} />
              <Select label="Moneda" value={sendForm.currency} onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}>
                <option value="USDT">USDT</option>
                <option value="BS">BS Token</option>
              </Select>
              <Input label="Monto" type="number" placeholder="0.00" value={sendForm.amount} onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })} />
              <Btn variant="primary" className="w-full justify-center" onClick={() => setSendModal(false)}>Confirmar envío</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── MARKETPLACE — PRODUCTS ───────────────────────────────────────────────────
function MarketplaceProductsView({ setView }: { setView: (v: View) => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const cats = ["all", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))];

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const q = search.toLowerCase();
    return (
      (category === "all" || p.category === category) &&
      (p.name.toLowerCase().includes(q) || p.wholesalerName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Marketplace de Productos</h1>
          <p className="text-sm text-[#64748b]">Productos mayoristas disponibles para compra grupal</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0d1526] border border-[#1a2a42] rounded-lg px-3 py-2 text-sm text-[#dde3ed] placeholder-[#334155] flex-1 min-w-48"
        />
        <div className="flex gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                category === c ? "border-[#3b7bff] bg-[#3b7bff1a] text-[#3b7bff]" : "border-[#1a2a42] text-[#64748b] hover:text-white"
              }`}
            >
              {c === "all" ? "Todos" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden card-hover">
            <img src={p.image} alt={p.name} className="w-full h-44 object-cover bg-[#111c30]" />
            <div className="p-4">
              <p className="text-xs text-[#64748b] mb-1">{p.category} · {p.wholesalerName}</p>
              <h3 className="font-semibold text-sm mb-2 leading-snug">{p.name}</h3>
              <p className="text-xs text-[#64748b] mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold mono">{p.currency === "USDT" ? "$" : ""}{p.unitPrice}</span>
                  <span className="text-xs text-[#64748b] ml-1">{p.currency}/ud.</span>
                </div>
                <span className="text-xs text-[#64748b]">Mín. {p.minUnits} ud.</span>
              </div>
              <Btn variant="secondary" size="sm" className="w-full justify-center" onClick={() => setView("create-group")}>
                Crear grupo de compra
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── GROUP CARD ───────────────────────────────────────────────────────────────
function GroupCard({ group, onClick }: { group: BuyingGroup; onClick: () => void }) {
  const pct = Math.round((group.currentUnits / group.targetUnits) * 100);
  return (
    <Card className="overflow-hidden card-hover" onClick={onClick}>
      <div className="flex gap-4 p-4">
        <img
          src={group.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop&auto=format"}
          alt={group.productName}
          className="w-20 h-20 object-cover rounded-lg shrink-0 bg-[#111c30]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-snug truncate">{group.productName}</h3>
            <div className="flex gap-1 shrink-0">
              <Badge type={group.status} />
              {group.type === "international" && <Badge type="international" />}
            </div>
          </div>
          <p className="text-xs text-[#64748b] mb-2 line-clamp-1">{group.description}</p>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#64748b]">{group.members.length} participantes</span>
            <span className="mono font-medium">{group.currentUnits}/{group.targetUnits} ud.</span>
          </div>
          <Progress value={group.currentUnits} max={group.targetUnits} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#64748b]">
              ${group.unitPrice} {group.currency}/ud.
            </span>
            <span className="text-xs font-medium" style={{ color: pct >= 100 ? "#10b981" : pct > 50 ? "#3b7bff" : "#64748b" }}>
              {pct}% financiado
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── MARKETPLACE — GROUPS ─────────────────────────────────────────────────────
function MarketplaceGroupsView({ user, groups, setGroups }: {
  user: User; groups: BuyingGroup[]; setGroups: (g: BuyingGroup[]) => void;
}) {
  const [filter, setFilter] = useState<"all" | "local" | "international">("all");
  const [selected, setSelected] = useState<BuyingGroup | null>(null);
  const [joinForm, setJoinForm] = useState({ units: "1", currency: "USDT" });
  const [joined, setJoined] = useState(false);

  const filtered = groups.filter((g) => filter === "all" || g.type === filter);

  function handleJoin() {
    if (!selected) return;
    const units = parseInt(joinForm.units) || 1;
    const paid = units * selected.unitPrice;
    const newMember: GroupMember = {
      userId: user.id,
      userName: user.name,
      units,
      paid,
      currency: joinForm.currency as "USDT" | "BS",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    const updated = groups.map((g) =>
      g.id === selected.id
        ? { ...g, members: [...g.members, newMember], currentUnits: g.currentUnits + units }
        : g
    );
    setGroups(updated);
    setJoined(true);
    setTimeout(() => { setJoined(false); setSelected(null); }, 1500);
  }

  const isMember = selected ? selected.members.some((m) => m.userId === user.id) : false;

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {user.role === "wholesaler" ? "Grupos de Compradores" : "Grupos de Compra"}
        </h1>
        <p className="text-sm text-[#64748b]">
          {user.role === "wholesaler"
            ? "Observa qué grupos de compradores están buscando productos"
            : "Únete a grupos activos y compra al por mayor"}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "local", "international"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
              filter === f ? "border-[#3b7bff] bg-[#3b7bff1a] text-[#3b7bff]" : "border-[#1a2a42] text-[#64748b] hover:text-white"
            }`}
          >
            {f === "all" ? "Todos" : f === "local" ? "Nacionales" : "Internacionales"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((g) => (
          <GroupCard key={g.id} group={g} onClick={() => { setSelected(g); setJoined(false); }} />
        ))}
      </div>

      {/* Group detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src={selected.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop&auto=format"}
              alt={selected.productName}
              className="w-full h-48 object-cover bg-[#111c30] rounded-t-xl"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-bold text-lg leading-snug">{selected.productName}</h2>
                <button onClick={() => setSelected(null)} className="text-[#64748b] hover:text-white shrink-0 mt-0.5"><Icon.x /></button>
              </div>
              <div className="flex gap-2 mb-3">
                <Badge type={selected.status} />
                {selected.type === "international" && <Badge type="international" />}
              </div>
              <p className="text-sm text-[#a8b8d0] mb-4">{selected.description}</p>

              {selected.productLink && (
                <a href={selected.productLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#3b7bff] hover:underline mb-4">
                  <Icon.link /> Ver producto en Alibaba
                </a>
              )}

              {/* Progress */}
              <div className="bg-[#080c14] rounded-lg p-4 mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#64748b]">Unidades comprometidas</span>
                  <span className="mono font-semibold">{selected.currentUnits} / {selected.targetUnits}</span>
                </div>
                <Progress value={selected.currentUnits} max={selected.targetUnits} />
                <div className="flex justify-between text-xs mt-2 text-[#64748b]">
                  <span>Depósito mínimo: ${selected.entryDeposit} {selected.currency}</span>
                  <span>{selected.members.length} participantes</span>
                </div>
              </div>

              {/* Members list */}
              <div className="mb-4">
                <p className="text-xs font-medium text-[#64748b] uppercase tracking-wider mb-2">Participantes</p>
                <div className="flex flex-col gap-1">
                  {selected.members.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#1a2a42] last:border-0">
                      <span className="font-medium">{m.userName}</span>
                      <span className="mono text-[#64748b]">{m.units} ud. · ${m.paid} {m.currency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join form */}
              {user.role === "buyer" && !isMember && selected.status === "open" && (
                <div className="bg-[#080c14] rounded-lg p-4 border border-[#1a2a42]">
                  <p className="text-xs font-medium mb-3 text-[#a8b8d0]">Unirse a este grupo</p>
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <Input label="Unidades" type="number" min="1" value={joinForm.units}
                        onChange={(e) => setJoinForm({ ...joinForm, units: e.target.value })} />
                    </div>
                    <div className="flex-1">
                      <Select label="Pagar con" value={joinForm.currency} onChange={(e) => setJoinForm({ ...joinForm, currency: e.target.value })}>
                        <option value="USDT">USDT</option>
                        <option value="BS">BS Token</option>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#64748b]">
                      Total: <span className="mono font-semibold text-[#dde3ed]">${((parseInt(joinForm.units) || 1) * selected.unitPrice).toFixed(2)} {joinForm.currency}</span>
                    </div>
                    {joined ? (
                      <span className="text-xs text-[#10b981] flex items-center gap-1"><Icon.check /> ¡Unido!</span>
                    ) : (
                      <Btn variant="accent" size="sm" onClick={handleJoin}>Unirse y pagar</Btn>
                    )}
                  </div>
                </div>
              )}

              {isMember && (
                <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b98118] rounded-lg p-3">
                  <Icon.check /> Ya eres parte de este grupo
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── MY GROUPS ────────────────────────────────────────────────────────────────
function MyGroupsView({ user, groups }: { user: User; groups: BuyingGroup[] }) {
  const myGroups = groups.filter(
    (g) => g.creatorId === user.id || g.members.some((m) => m.userId === user.id)
  );

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Mis Grupos</h1>
      <p className="text-sm text-[#64748b] mb-6">Grupos que creaste o en los que participas</p>

      {myGroups.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-[#64748b] mb-4">Aún no tienes grupos</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {myGroups.map((g) => {
            const myEntry = g.members.find((m) => m.userId === user.id);
            const isCreator = g.creatorId === user.id;
            return (
              <Card key={g.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{g.productName}</h3>
                      <Badge type={g.status} />
                      {g.type === "international" && <Badge type="international" />}
                      {isCreator && <span className="text-[10px] bg-[#3b7bff1a] text-[#3b7bff] px-1.5 py-0.5 rounded-full">Creador</span>}
                    </div>
                    <p className="text-xs text-[#64748b]">{g.members.length} participantes · Vence {g.deadline}</p>
                  </div>
                  {myEntry && (
                    <div className="text-right">
                      <p className="text-xs text-[#64748b]">Tu aporte</p>
                      <p className="mono font-semibold text-sm">${myEntry.paid} {myEntry.currency}</p>
                      <p className="text-xs text-[#64748b]">{myEntry.units} unidades</p>
                    </div>
                  )}
                </div>
                <Progress value={g.currentUnits} max={g.targetUnits} />
                <div className="flex justify-between text-xs mt-2 text-[#64748b]">
                  <span>{g.currentUnits}/{g.targetUnits} unidades comprometidas</span>
                  <span>{Math.round((g.currentUnits / g.targetUnits) * 100)}%</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CREATE GROUP (local) ─────────────────────────────────────────────────────
function CreateGroupView({ user, groups, setGroups, setView }: {
  user: User; groups: BuyingGroup[]; setGroups: (g: BuyingGroup[]) => void; setView: (v: View) => void;
}) {
  const [form, setForm] = useState({
    productName: "", description: "", imageUrl: "", productId: "",
    targetUnits: "", unitPrice: "", currency: "USDT", entryDeposit: "", deadline: "", category: "Alimentos",
  });
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newGroup: BuyingGroup = {
      id: "g-" + Date.now(),
      type: "local",
      creatorId: user.id,
      creatorName: user.name,
      productName: form.productName,
      description: form.description,
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
      targetUnits: parseInt(form.targetUnits) || 100,
      currentUnits: 0,
      unitPrice: parseFloat(form.unitPrice) || 1,
      currency: form.currency as "USDT" | "BS",
      entryDeposit: parseFloat(form.entryDeposit) || 10,
      minUnits: parseInt(form.targetUnits) || 50,
      members: [],
      status: "open",
      category: form.category,
      createdAt: new Date().toISOString().split("T")[0],
      deadline: form.deadline,
    };
    setGroups([...groups, newGroup]);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setView("my-groups"); }, 1500);
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Crear Grupo Local</h1>
      <p className="text-sm text-[#64748b] mb-6">Organiza una compra grupal de productos nacionales al por mayor</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-[#a8b8d0] uppercase tracking-wider">Producto</h2>
          <Input label="Nombre del producto *" placeholder="Ej. Aceite de oliva 1L" value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
          <Textarea label="Descripción" placeholder="Describe el producto, calidad, mayorista..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["Alimentos", "Higiene", "Limpieza", "Electrónicos", "Ropa", "Otro"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input label="URL de imagen (opcional)" placeholder="https://..." value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-[#a8b8d0] uppercase tracking-wider">Condiciones de compra</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio unitario *" type="number" step="0.01" placeholder="4.50" value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
            <Select label="Moneda" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USDT">USDT</option>
              <option value="BS">BS Token</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mínimo de unidades *" type="number" placeholder="100" value={form.targetUnits}
              onChange={(e) => setForm({ ...form, targetUnits: e.target.value })} required />
            <Input label="Depósito de entrada *" type="number" step="0.01" placeholder="20.00" value={form.entryDeposit}
              onChange={(e) => setForm({ ...form, entryDeposit: e.target.value })} required />
          </div>
          <Input label="Fecha límite" type="date" value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </Card>

        {/* Deposit note */}
        <div className="bg-[#3b7bff0d] border border-[#3b7bff30] rounded-lg p-4 text-xs text-[#a8b8d0]">
          <span className="font-medium text-[#3b7bff]">Depósito de seriedad: </span>
          El monto de entrada asegura la participación real. Se reembolsa si el grupo no alcanza el mínimo.
        </div>

        {success ? (
          <div className="flex items-center gap-2 text-[#10b981] text-sm"><Icon.check /> ¡Grupo creado exitosamente!</div>
        ) : (
          <div className="flex gap-3">
            <Btn type="submit" variant="primary" size="lg">Crear grupo de compra</Btn>
            <Btn variant="ghost" onClick={() => setView("dashboard")}>Cancelar</Btn>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── CREATE INTERNATIONAL GROUP ───────────────────────────────────────────────
function CreateIntlGroupView({ user, groups, setGroups, setView }: {
  user: User; groups: BuyingGroup[]; setGroups: (g: BuyingGroup[]) => void; setView: (v: View) => void;
}) {
  const [form, setForm] = useState({
    productName: "", description: "", productLink: "", imageUrl: "",
    targetUnits: "", unitPrice: "", currency: "USDT", entryDeposit: "", deadline: "",
  });
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newGroup: BuyingGroup = {
      id: "gi-" + Date.now(),
      type: "international",
      creatorId: user.id,
      creatorName: user.name,
      productName: form.productName,
      description: form.description,
      productLink: form.productLink,
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop&auto=format",
      targetUnits: parseInt(form.targetUnits) || 100,
      currentUnits: 0,
      unitPrice: parseFloat(form.unitPrice) || 1,
      currency: form.currency as "USDT" | "BS",
      entryDeposit: parseFloat(form.entryDeposit) || 15,
      minUnits: parseInt(form.targetUnits) || 100,
      members: [],
      status: "open",
      category: "Importación",
      createdAt: new Date().toISOString().split("T")[0],
      deadline: form.deadline,
    };
    setGroups([...groups, newGroup]);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setView("my-groups"); }, 1500);
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-[#f59e0b1a] flex items-center justify-center text-[#f59e0b]"><Icon.globe /></div>
        <h1 className="text-2xl font-bold">Grupo Internacional</h1>
      </div>
      <p className="text-sm text-[#64748b] mb-6">Importación grupal desde Alibaba u otras plataformas internacionales</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-[#a8b8d0] uppercase tracking-wider">Producto</h2>
          <Input label="Nombre del producto *" placeholder="Ej. Auriculares TWS Bluetooth" value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
          <Input label="Link del producto (Alibaba u otro) *" placeholder="https://www.alibaba.com/..." value={form.productLink}
            onChange={(e) => setForm({ ...form, productLink: e.target.value })} required />
          <Textarea label="Descripción del producto" placeholder="Especificaciones, calidad, tiempos de entrega estimados..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Input label="URL de imagen (opcional)" placeholder="https://..." value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-[#a8b8d0] uppercase tracking-wider">Condiciones de compra</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio unitario (USD) *" type="number" step="0.01" placeholder="8.50" value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
            <Select label="Moneda" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USDT">USDT</option>
              <option value="BS">BS Token</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="MOQ (mínimo de unidades) *" type="number" placeholder="100" value={form.targetUnits}
              onChange={(e) => setForm({ ...form, targetUnits: e.target.value })} required />
            <Input label="Depósito de seriedad *" type="number" step="0.01" placeholder="30.00" value={form.entryDeposit}
              onChange={(e) => setForm({ ...form, entryDeposit: e.target.value })} required />
          </div>
          <Input label="Fecha límite de cierre" type="date" value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </Card>

        <div className="bg-[#f59e0b0d] border border-[#f59e0b30] rounded-lg p-4 text-xs text-[#a8b8d0]">
          <span className="font-medium text-[#f59e0b]">Importación internacional: </span>
          Considera incluir costos de envío, aduana y tiempos estimados. El depósito protege a todos los participantes.
        </div>

        {success ? (
          <div className="flex items-center gap-2 text-[#10b981] text-sm"><Icon.check /> ¡Grupo internacional creado!</div>
        ) : (
          <div className="flex gap-3">
            <Btn type="submit" variant="primary" size="lg" className="bg-[#f59e0b] hover:bg-[#e08a00]">Crear grupo internacional</Btn>
            <Btn variant="ghost" onClick={() => setView("dashboard")}>Cancelar</Btn>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── WHOLESALER PRODUCTS ──────────────────────────────────────────────────────
function WholesalerProductsView({ user, setView }: { user: User; setView: (v: View) => void }) {
  const myProducts = MOCK_PRODUCTS.filter((p) => p.wholesalerId === user.id);
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Mis Productos</h1>
          <p className="text-sm text-[#64748b]">{myProducts.length} productos publicados</p>
        </div>
        <Btn variant="primary" onClick={() => setView("wholesaler-add-product")}><Icon.plus /> Agregar producto</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {myProducts.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover bg-[#111c30]" />
            <div className="p-4">
              <p className="text-xs text-[#64748b] mb-1">{p.category}</p>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-[#64748b] line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="mono font-bold">${p.unitPrice} {p.currency}/ud.</span>
                <span className="text-xs text-[#64748b]">Mín. {p.minUnits} ud.</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── ADD PRODUCT ──────────────────────────────────────────────────────────────
function AddProductView({ user, setView }: { user: User; setView: (v: View) => void }) {
  const [form, setForm] = useState({
    name: "", description: "", unitPrice: "", currency: "USDT",
    minUnits: "", image: "", category: "Alimentos",
  });
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const np: Product = {
      id: "p-" + Date.now(),
      wholesalerId: user.id,
      wholesalerName: user.name,
      name: form.name,
      description: form.description,
      unitPrice: parseFloat(form.unitPrice) || 1,
      currency: form.currency as "USDT" | "BS",
      minUnits: parseInt(form.minUnits) || 50,
      image: form.image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop&auto=format",
      category: form.category,
      available: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    MOCK_PRODUCTS.push(np);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setView("wholesaler-products"); }, 1500);
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Agregar Producto</h1>
      <p className="text-sm text-[#64748b] mb-6">Publica un producto para que los compradores puedan crear grupos</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Card className="p-5 flex flex-col gap-4">
          <Input label="Nombre del producto *" placeholder="Ej. Aceite de girasol 5L" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Descripción *" placeholder="Detalla el producto: origen, características, empaque..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["Alimentos", "Higiene", "Limpieza", "Electrónicos", "Ropa", "Otro"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input label="URL de foto del producto" placeholder="https://..." value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-[#a8b8d0] uppercase tracking-wider">Precio y disponibilidad</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio unitario *" type="number" step="0.01" placeholder="5.00" value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
            <Select label="Moneda" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USDT">USDT</option>
              <option value="BS">BS Token</option>
            </Select>
          </div>
          <Input label="Mínimo de unidades por compra *" type="number" placeholder="50" value={form.minUnits}
            onChange={(e) => setForm({ ...form, minUnits: e.target.value })} required />
        </Card>

        {success ? (
          <div className="flex items-center gap-2 text-[#10b981] text-sm"><Icon.check /> ¡Producto publicado!</div>
        ) : (
          <div className="flex gap-3">
            <Btn type="submit" variant="accent" size="lg">Publicar producto</Btn>
            <Btn variant="ghost" onClick={() => setView("wholesaler-products")}>Cancelar</Btn>
          </div>
        )}
      </form>
    </div>
  );
}

// ─── ADMIN OVERVIEW ───────────────────────────────────────────────────────────
function AdminOverviewView() {
  const totalVol = MOCK_GROUPS.reduce((a, g) => a + g.currentUnits * g.unitPrice, 0);
  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Usuarios", value: MOCK_USERS.length, color: "#3b7bff" },
          { label: "Grupos activos", value: MOCK_GROUPS.filter((g) => g.status === "open").length, color: "#10b981" },
          { label: "Productos", value: MOCK_PRODUCTS.length, color: "#f59e0b" },
          { label: "Volumen USDT", value: "$" + totalVol.toFixed(0), color: "#a855f7" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
              <div style={{ color: s.color }}><Icon.chart /></div>
            </div>
            <p className="text-xs text-[#64748b] mb-1">{s.label}</p>
            <p className="text-2xl font-bold mono">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-4">Todos los grupos</h2>
          <div className="flex flex-col gap-2">
            {MOCK_GROUPS.map((g) => (
              <Card key={g.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{g.productName}</p>
                  <p className="text-xs text-[#64748b]">{g.creatorName} · {g.members.length} participantes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type={g.status} />
                  {g.type === "international" && <Badge type="international" />}
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-4">Productos en catálogo</h2>
          <div className="flex flex-col gap-2">
            {MOCK_PRODUCTS.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN USERS ──────────────────────────────────────────────────────────────
function AdminUsersView() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Usuarios</h1>
      <p className="text-sm text-[#64748b] mb-6">{MOCK_USERS.length} usuarios registrados</p>

      <Card className="divide-y divide-[#1a2a42]">
        {MOCK_USERS.map((u) => {
          const roleLabel = u.role === "admin" ? "Admin" : u.role === "wholesaler" ? "Mayorista" : "Comprador";
          const roleColor = u.role === "admin" ? "#f59e0b" : u.role === "wholesaler" ? "#10b981" : "#3b7bff";
          return (
            <div key={u.id} className="flex items-center gap-4 p-4">
              {u.avatar ? (
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#111c30] flex items-center justify-center font-semibold shrink-0" style={{ color: roleColor }}>
                  {u.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm">{u.name}</p>
                  {u.verified && <span className="text-[10px] text-[#10b981] bg-[#10b98118] px-1.5 py-0.5 rounded-full">Verificado</span>}
                </div>
                <p className="text-xs text-[#64748b]">{u.email} · {u.phone}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${roleColor}18`, color: roleColor }}>{roleLabel}</span>
                <p className="text-xs text-[#64748b] mt-1 mono">${u.wallet.usdt.toFixed(0)} USDT</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn variant="ghost" size="sm">Ver</Btn>
                <Btn variant="danger" size="sm">Suspender</Btn>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─── MY RECEIPTS (ERC-1155) ───────────────────────────────────────────────────
function MyReceiptsView({ user, tokens, setTokens, listings, setListings, setView }: {
  user: User;
  tokens: ERC1155Token[];
  setTokens: (t: ERC1155Token[]) => void;
  listings: NFTListing[];
  setListings: (l: NFTListing[]) => void;
  setView: (v: View) => void;
}) {
  const myTokens = tokens.filter((t) => t.ownerId === user.id);
  const [sellModal, setSellModal] = useState<ERC1155Token | null>(null);
  const [burnModal, setBurnModal] = useState<ERC1155Token | null>(null);
  const [sellForm, setSellForm] = useState({ amount: "1", price: "", currency: "USDT" });
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function handleSell() {
    if (!sellModal) return;
    const amt = parseInt(sellForm.amount) || 1;
    if (amt > sellModal.amount) { showToast("No tienes suficientes unidades"); return; }
    const newListing: NFTListing = {
      id: "lst-" + Date.now(),
      tokenId: sellModal.tokenId,
      groupId: sellModal.groupId,
      groupName: sellModal.groupName,
      productImage: sellModal.productImage,
      sellerId: user.id,
      sellerName: user.name,
      amount: amt,
      askPrice: parseFloat(sellForm.price) || 0,
      askCurrency: sellForm.currency as "USDT" | "BS",
      listingStatus: "active",
      createdAt: new Date().toISOString().split("T")[0],
      supplierETA: sellModal.supplierETA,
    };
    setListings([...listings, newListing]);
    // mark token as listed if all units are listed
    const updated = tokens.map((t) =>
      t.id === sellModal.id ? { ...t, status: "listed" as const } : t
    );
    setTokens(updated);
    setSellModal(null);
    showToast("¡Recibo publicado en el mercado secundario!");
  }

  function handleBurn(tok: ERC1155Token) {
    const updated = tokens.map((t) =>
      t.id === tok.id ? { ...t, status: "burned" as const } : t
    );
    setTokens(updated);
    setBurnModal(null);
    showToast("Recibo quemado — producto retirado ✓");
  }

  const statusLabel: Record<string, { label: string; color: string }> = {
    held:   { label: "En custodia", color: "#3b7bff" },
    listed: { label: "En venta",    color: "#f59e0b" },
    burned: { label: "Retirado",    color: "#64748b" },
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1526] border border-[#10b981] text-[#10b981] text-sm px-4 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">Mis Recibos NFT</h1>
          <p className="text-sm text-[#64748b]">Tokens ERC-1155 que representan tu participación en compras internacionales</p>
        </div>
        <Btn variant="secondary" onClick={() => setView("nft-marketplace")}><Icon.tag /> Mercado secundario</Btn>
      </div>

      {/* Explainer */}
      <div className="bg-[#f59e0b0d] border border-[#f59e0b25] rounded-xl p-4 mb-6 flex gap-3">
        <div className="text-[#f59e0b] shrink-0 mt-0.5"><Icon.package /></div>
        <div className="text-xs text-[#a8b8d0] leading-relaxed">
          <span className="font-semibold text-[#f59e0b]">¿Qué es esto?</span> Cuando tu grupo paga al proveedor internacional, recibes un
          token ERC-1155 como recibo de tu compra. Puedes <span className="text-[#dde3ed]">guardarlo y quemarlo al retirar el producto</span>,
          o <span className="text-[#dde3ed]">venderlo en el mercado secundario</span> si necesitas liquidez antes de que llegue la mercancía.
        </div>
      </div>

      {myTokens.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-[#64748b] mb-2">No tienes recibos NFT todavía</div>
          <p className="text-xs text-[#334155]">Aparecerán aquí cuando tu grupo internacional pague al proveedor</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myTokens.map((tok) => {
            const st = statusLabel[tok.status];
            return (
              <Card key={tok.id} className={`overflow-hidden ${tok.status === "burned" ? "opacity-50" : ""}`}>
                {/* Token image with overlay */}
                <div className="relative">
                  <img src={tok.productImage} alt={tok.groupName} className="w-full h-44 object-cover bg-[#111c30]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] via-transparent to-transparent" />
                  {/* ERC-1155 badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-[#f59e0b40] text-[#f59e0b] text-[10px] font-bold mono px-2 py-1 rounded-lg">
                    ERC-1155
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: `${st.color}22`, color: st.color, border: `1px solid ${st.color}40` }}>
                    {st.label}
                  </div>
                  {/* Token ID */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-semibold text-sm text-white leading-tight">{tok.groupName}</p>
                    <p className="mono text-[10px] text-[#a8b8d0]">Token #{tok.tokenId} · {tok.amount} unidades</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <p className="text-[#64748b] mb-0.5">Unidades cubiertas</p>
                      <p className="mono font-semibold text-lg">{tok.amount}</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] mb-0.5">ETA del proveedor</p>
                      <p className="font-medium">{tok.supplierETA}</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] mb-0.5">Emitido</p>
                      <p className="font-medium">{tok.mintedAt}</p>
                    </div>
                    <div>
                      <p className="text-[#64748b] mb-0.5">Dirección</p>
                      <p className="mono text-[10px] text-[#64748b] truncate">{user.wallet.address.slice(0, 12)}…</p>
                    </div>
                  </div>

                  {tok.status !== "burned" && (
                    <div className="flex gap-2">
                      {tok.status !== "listed" && (
                        <Btn variant="secondary" size="sm" className="flex-1 justify-center" onClick={() => { setSellModal(tok); setSellForm({ amount: "1", price: "", currency: "USDT" }); }}>
                          <Icon.tag /> Vender
                        </Btn>
                      )}
                      <Btn variant="ghost" size="sm" className="flex-1 justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => setBurnModal(tok)}>
                        <Icon.flame /> Retirar producto
                      </Btn>
                    </div>
                  )}
                  {tok.status === "burned" && (
                    <div className="text-xs text-center text-[#64748b] py-1">Producto retirado — recibo quemado</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sell modal */}
      {sellModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSellModal(null)}>
          <Card className="w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">Vender recibo NFT</h3>
              <button onClick={() => setSellModal(null)} className="text-[#64748b] hover:text-white"><Icon.x /></button>
            </div>
            <p className="text-xs text-[#64748b] mb-5">Publica unidades de tu recibo en el mercado secundario</p>

            <div className="bg-[#080c14] rounded-lg p-3 mb-4 flex items-center gap-3">
              <img src={sellModal.productImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium">{sellModal.groupName}</p>
                <p className="text-xs text-[#64748b]">Tienes {sellModal.amount} unidades disponibles</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              <Input label={`Unidades a vender (máx. ${sellModal.amount})`} type="number" min="1" max={sellModal.amount}
                value={sellForm.amount} onChange={(e) => setSellForm({ ...sellForm, amount: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Precio por unidad" type="number" step="0.01" placeholder="9.50"
                  value={sellForm.price} onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })} />
                <Select label="Moneda" value={sellForm.currency} onChange={(e) => setSellForm({ ...sellForm, currency: e.target.value })}>
                  <option value="USDT">USDT</option>
                  <option value="BS">BS Token</option>
                </Select>
              </div>
            </div>

            {sellForm.price && (
              <div className="bg-[#080c14] rounded-lg p-3 mb-4 text-xs text-[#a8b8d0]">
                Total estimado: <span className="mono font-semibold text-white">
                  {sellForm.currency === "USDT" ? "$" : ""}{((parseInt(sellForm.amount) || 0) * parseFloat(sellForm.price)).toFixed(2)} {sellForm.currency}
                </span>
              </div>
            )}

            <Btn variant="primary" className="w-full justify-center" onClick={handleSell}>
              <Icon.tag /> Publicar en mercado secundario
            </Btn>
          </Card>
        </div>
      )}

      {/* Burn confirm modal */}
      {burnModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setBurnModal(null)}>
          <Card className="w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                <Icon.flame />
              </div>
              <div>
                <h3 className="font-semibold">Confirmar retiro</h3>
                <p className="text-xs text-[#64748b]">Esta acción es irreversible</p>
              </div>
            </div>
            <p className="text-sm text-[#a8b8d0] mb-5">
              Al confirmar, quemarás <span className="font-semibold text-white">{burnModal.amount} unidades</span> del token <span className="font-semibold text-white">#{burnModal.tokenId}</span>. Esto confirma que retiraste el producto.
            </p>
            <div className="flex gap-3">
              <Btn variant="danger" className="flex-1 justify-center" onClick={() => handleBurn(burnModal)}>
                <Icon.flame /> Quemar y retirar
              </Btn>
              <Btn variant="ghost" onClick={() => setBurnModal(null)}>Cancelar</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── NFT SECONDARY MARKETPLACE ────────────────────────────────────────────────
function NFTMarketplaceView({ user, listings, setListings, tokens, setTokens }: {
  user: User;
  listings: NFTListing[];
  setListings: (l: NFTListing[]) => void;
  tokens: ERC1155Token[];
  setTokens: (t: ERC1155Token[]) => void;
}) {
  const [toast, setToast] = useState("");
  const [buyModal, setBuyModal] = useState<NFTListing | null>(null);
  const [buyUnits, setBuyUnits] = useState("1");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const activeListings = listings.filter((l) => l.listingStatus === "active");

  function handleBuy() {
    if (!buyModal) return;
    const units = parseInt(buyUnits) || 1;
    if (units > buyModal.amount) { showToast("No hay suficientes unidades"); return; }

    // Mint a new token for the buyer
    const newToken: ERC1155Token = {
      id: "tok-" + Date.now(),
      tokenId: buyModal.tokenId,
      groupId: buyModal.groupId,
      groupName: buyModal.groupName,
      productImage: buyModal.productImage,
      ownerId: user.id,
      amount: units,
      mintedAt: new Date().toISOString().split("T")[0],
      status: "held",
      supplierETA: buyModal.supplierETA,
    };
    setTokens([...tokens, newToken]);

    // Update listing
    const updatedListings = listings.map((l) =>
      l.id === buyModal.id
        ? units >= l.amount
          ? { ...l, listingStatus: "sold" as const }
          : { ...l, amount: l.amount - units }
        : l
    );
    setListings(updatedListings);
    setBuyModal(null);
    showToast(`¡Compraste ${units} unidades del recibo!`);
  }

  return (
    <div className="p-6 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1526] border border-[#10b981] text-[#10b981] text-sm px-4 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Mercado Secundario</h1>
        <p className="text-sm text-[#64748b]">Compra y vende recibos ERC-1155 de pedidos internacionales en tránsito</p>
      </div>

      {/* Info bar */}
      <div className="bg-[#3b7bff0d] border border-[#3b7bff25] rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-xs text-[#a8b8d0]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span>Cada recibo representa unidades reales de un pedido en tránsito</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span>El comprador recibe el ERC-1155 y puede retirarlo al llegar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3b7bff]" />
          <span>Precio libre fijado por el vendedor</span>
        </div>
      </div>

      {activeListings.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-[#64748b]">No hay recibos listados en este momento</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeListings.map((lst) => {
            const isOwn = lst.sellerId === user.id;
            return (
              <Card key={lst.id} className="overflow-hidden card-hover">
                <div className="relative">
                  <img src={lst.productImage} alt={lst.groupName} className="w-full h-40 object-cover bg-[#111c30]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border border-[#f59e0b40] text-[#f59e0b] text-[10px] font-bold mono px-2 py-1 rounded-lg">
                    ERC-1155
                  </div>
                  {isOwn && (
                    <div className="absolute top-3 right-3 bg-[#3b7bff22] border border-[#3b7bff40] text-[#3b7bff] text-[10px] px-2 py-1 rounded-full">
                      Tu listing
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-semibold text-sm text-white leading-tight">{lst.groupName}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-[#64748b] mb-0.5">Precio por unidad</p>
                      <p className="mono font-bold text-xl">
                        {lst.askCurrency === "USDT" ? "$" : ""}{lst.askPrice.toLocaleString()}
                        <span className="text-xs font-normal text-[#64748b] ml-1">{lst.askCurrency}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#64748b] mb-0.5">Disponibles</p>
                      <p className="mono font-semibold text-lg">{lst.amount} <span className="text-xs font-normal text-[#64748b]">ud.</span></p>
                    </div>
                  </div>

                  <div className="text-xs text-[#64748b] mb-3 flex items-center justify-between">
                    <span>Vendedor: {lst.sellerName}</span>
                    <span>ETA: {lst.supplierETA}</span>
                  </div>

                  {!isOwn ? (
                    <Btn variant="primary" size="sm" className="w-full justify-center" onClick={() => { setBuyModal(lst); setBuyUnits("1"); }}>
                      Comprar recibo
                    </Btn>
                  ) : (
                    <Btn variant="ghost" size="sm" className="w-full justify-center" onClick={() => {
                      setListings(listings.map((l) => l.id === lst.id ? { ...l, listingStatus: "cancelled" as const } : l));
                      showToast("Listing cancelado");
                    }}>
                      Cancelar listing
                    </Btn>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Buy modal */}
      {buyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setBuyModal(null)}>
          <Card className="w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Comprar recibo NFT</h3>
              <button onClick={() => setBuyModal(null)} className="text-[#64748b] hover:text-white"><Icon.x /></button>
            </div>

            <div className="bg-[#080c14] rounded-lg p-3 mb-4 flex items-center gap-3">
              <img src={buyModal.productImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium">{buyModal.groupName}</p>
                <p className="text-xs text-[#64748b]">{buyModal.amount} unidades disponibles</p>
                <p className="text-xs mono font-semibold" style={{ color: "#10b981" }}>
                  ETA: {buyModal.supplierETA}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              <Input label={`Unidades a comprar (máx. ${buyModal.amount})`} type="number" min="1" max={buyModal.amount}
                value={buyUnits} onChange={(e) => setBuyUnits(e.target.value)} />
              <div className="bg-[#080c14] rounded-lg p-3 text-sm">
                <div className="flex justify-between text-xs text-[#64748b] mb-1">
                  <span>Precio unitario</span>
                  <span className="mono">{buyModal.askCurrency === "USDT" ? "$" : ""}{buyModal.askPrice} {buyModal.askCurrency}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="mono">{buyModal.askCurrency === "USDT" ? "$" : ""}{((parseInt(buyUnits) || 0) * buyModal.askPrice).toLocaleString()} {buyModal.askCurrency}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#64748b] mb-4 leading-relaxed">
              Al comprar, recibirás un ERC-1155 en tu billetera. Podrás retirarlo físicamente cuando llegue el pedido, o venderlo nuevamente.
            </div>

            <Btn variant="accent" className="w-full justify-center" onClick={handleBuy}>
              Confirmar compra
            </Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [groups, setGroups] = useState<BuyingGroup[]>(MOCK_GROUPS);
  const [tokens, setTokens] = useState<ERC1155Token[]>(MOCK_TOKENS);
  const [listings, setListings] = useState<NFTListing[]>(MOCK_LISTINGS);

  function handleAuth(u: User) {
    setUser(u);
    setView("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setView("auth");
  }

  if (!user) return <AuthView onAuth={handleAuth} />;

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView user={user} setView={setView} />;
      case "wallet": return <WalletView user={user} />;
      case "marketplace-products": return <MarketplaceProductsView setView={setView} />;
      case "marketplace-groups": return <MarketplaceGroupsView user={user} groups={groups} setGroups={setGroups} />;
      case "my-groups": return <MyGroupsView user={user} groups={groups} />;
      case "create-group": return <CreateGroupView user={user} groups={groups} setGroups={setGroups} setView={setView} />;
      case "create-intl-group": return <CreateIntlGroupView user={user} groups={groups} setGroups={setGroups} setView={setView} />;
      case "wholesaler-products": return <WholesalerProductsView user={user} setView={setView} />;
      case "wholesaler-add-product": return <AddProductView user={user} setView={setView} />;
      case "admin-overview": return <AdminOverviewView />;
      case "admin-users": return <AdminUsersView />;
      case "my-receipts": return <MyReceiptsView user={user} tokens={tokens} setTokens={setTokens} listings={listings} setListings={setListings} setView={setView} />;
      case "nft-marketplace": return <NFTMarketplaceView user={user} listings={listings} setListings={setListings} tokens={tokens} setTokens={setTokens} />;
      default: return <DashboardView user={user} setView={setView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c14]">
      <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
