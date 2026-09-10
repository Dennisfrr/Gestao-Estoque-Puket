import { History, MessageCircleMore, Settings2, ShoppingBag, Sparkles, Waypoints } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PuketLogo } from "./PuketLogo";

const items = [
  { to: "/", label: "Automatizar", icon: Sparkles },
  { to: "/copiloto", label: "Copiloto IA", icon: MessageCircleMore },
  { to: "/catalogo", label: "Catálogo", icon: ShoppingBag },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/status", label: "Status", icon: Waypoints },
  { to: "/configuracoes", label: "Configurações", icon: Settings2 },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card px-4 py-6 lg:flex lg:flex-col">
    <div className="px-3"><PuketLogo /></div><p className="mt-2 px-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Cadastro inteligente</p>
    <nav className="mt-9 space-y-2" aria-label="Navegação principal">{items.map(({ to, label, icon: Icon }) => { const active = to === "/" ? pathname === "/" : pathname.startsWith(to); return <Link key={to} to={to} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-primary-soft hover:text-primary"}`}><Icon className="h-5 w-5" aria-hidden="true" />{label}</Link>; })}</nav>
    <div className="mt-auto rounded-3xl bg-accent-soft p-4"><p className="font-display font-bold">Menos cliques, mais magia.</p><p className="mt-1 text-xs text-muted-foreground">Uma operação e um SKU. O resto fica com a automação.</p></div>
  </aside>;
}
