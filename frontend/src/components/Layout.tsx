import { BarChart3, BookOpen, CalendarCheck, Gauge, Layers, LogOut, Settings, Target } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { currentModuleConfig } from "../lib/modules";

const tjNav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/hoje", label: "Estudo de Hoje", icon: CalendarCheck },
  { to: "/conteudos", label: "Conteúdos", icon: Layers },
  { to: "/questoes", label: "Questões", icon: Target },
  { to: "/flashcards", label: "Flashcards", icon: BookOpen },
  { to: "/simulados", label: "Simulados", icon: Target },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

const cyberNav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/conteudos", label: "Roadmap", icon: Layers },
  { to: "/hoje", label: "Estudar Hoje", icon: CalendarCheck },
  { to: "/simulados", label: "Projetos", icon: Target },
  { to: "/relatorios", label: "Progresso", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Layout() {
  const module = currentModuleConfig();
  const isCyber = module.id === "cyber";
  const visibleNav = isCyber ? cyberNav : tjNav;

  function changeModule() {
    window.localStorage.removeItem("me_aprova_active_module");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 px-4 py-5 backdrop-blur xl:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-black">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-sm text-zinc-400">{module.subtitle}</p>
            <h1 className="text-lg font-semibold">{module.name}</h1>
          </div>
        </div>

        {isCyber ? (
          <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Nível atual</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold">Iniciante</span>
              <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-black">Lv. 0</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-full w-0 rounded-full bg-accent" />
            </div>
          </div>
        ) : null}

        <nav className="space-y-1">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive ? "bg-white text-black" : "text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={changeModule} className="mt-6 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100">
          <LogOut size={18} />
          Trocar módulo
        </button>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-background/85 px-4 py-3 backdrop-blur xl:hidden">
          <div className="flex items-center justify-between">
            <strong>{module.name}</strong>
            <span className="text-xs text-zinc-400">{module.subtitle}</span>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {visibleNav.map((item) => (
              <NavLink key={item.to} to={item.to} className="rounded-md bg-white/5 px-3 py-2 text-xs text-zinc-300">
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
