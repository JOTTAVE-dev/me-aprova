import { BookOpen, ShieldCheck } from "lucide-react";

import { Button, Card } from "../components/ui";
import { modules, setCurrentModule, type StudyModule } from "../lib/modules";

const icons: Record<StudyModule, typeof BookOpen> = {
  tj: BookOpen,
  cyber: ShieldCheck,
};

export default function Login() {
  function enter(module: StudyModule) {
    setCurrentModule(module);
    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-4xl">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Me Aprova</p>
        <h1 className="mt-3 text-3xl font-semibold">Escolha seu módulo</h1>
        <p className="mt-2 text-zinc-400">Sem e-mail, sem senha. Entre direto na jornada que quer estudar agora.</p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {(Object.keys(modules) as StudyModule[]).map((moduleId) => {
            const module = modules[moduleId];
            const Icon = icons[moduleId];
            return (
              <Card key={module.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-black">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold">{module.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{module.subtitle}</p>
                </div>
                <Button className="mt-6" onClick={() => enter(module.id)}>
                  Entrar no módulo
                </Button>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
