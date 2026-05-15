import { BookOpenCheck, CalendarDays, CheckCircle2, Flame, Play, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Badge, Button, Card, GhostButton } from "../components/ui";
import { api, Dashboard as DashboardType } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";

const skills = [
  { name: "Redes", value: 60 },
  { name: "Linux", value: 40 },
  { name: "Python", value: 70 },
  { name: "Cloud", value: 15 },
  { name: "DevSecOps", value: 5 },
];

const weeks = Array.from({ length: 28 }, (_, index) => [0, 25, 55, 85][(index * 7) % 4]);

function CyberDashboard({ data }: { data: DashboardType }) {
  const phase = data.progress < 20 ? "Fundamentos" : data.progress < 45 ? "Redes e Monitoramento" : data.progress < 70 ? "Blue Team" : "Cloud Security";
  const modulesDone = Math.max(0, Math.round(data.total_topics * (data.progress / 100)));

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-glow">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_.8fr] lg:p-7">
          <div>
            <Badge>Cybersecurity Academy</Badge>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">Sua jornada até a primeira vaga em segurança.</h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Evolua por trilhas, laboratórios, projetos e certificações com uma experiência focada em prática e portfólio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>
                <Link to="/hoje" className="flex items-center gap-2">
                  <Play size={16} /> Continuar Estudando
                </Link>
              </Button>
              <GhostButton>
                <Link to="/conteudos">Ver Roadmap</Link>
              </GhostButton>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/25 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Progresso geral</span>
              <Sparkles className="text-accent" size={18} />
            </div>
            <p className="mt-4 text-5xl font-semibold">{pct(data.progress)}</p>
            <div className="mt-4 h-3 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(data.progress, 100)}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white/5 p-3">
                <p className="text-zinc-500">Fase atual</p>
                <p className="mt-1 font-medium">{phase}</p>
              </div>
              <div className="rounded-md bg-white/5 p-3">
                <p className="text-zinc-500">Nível</p>
                <p className="mt-1 font-medium">Blue Team Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Streak", value: "7 dias", icon: Flame },
          { label: "Horas estudadas", value: `${Math.max(3, data.total_questions * 2)}h`, icon: CalendarDays },
          { label: "Módulos concluídos", value: modulesDone, icon: BookOpenCheck },
          { label: "Projetos concluídos", value: Math.floor(data.total_questions / 3), icon: Trophy },
        ].map((stat) => (
          <Card key={stat.label}>
            <stat.icon className="text-accent" size={22} />
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Evolução semanal</h3>
            <Badge>XP +420</Badge>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2">
            {weeks.map((height, index) => (
              <div key={index} className="flex-1 rounded-t-md bg-white/10">
                <div className="rounded-t-md bg-accent transition-all" style={{ height: `${Math.max(height, 10)}%` }} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Skills</h3>
          <div className="mt-5 space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="text-zinc-400">{skill.value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <ShieldCheck className="text-accent" size={20} />
          <h3 className="mt-3 font-semibold">Certificado em andamento</h3>
          <p className="mt-2 text-sm text-zinc-400">Google Cybersecurity Certificate</p>
        </Card>
        <Card>
          <Target className="text-accent" size={20} />
          <h3 className="mt-3 font-semibold">Projeto recomendado</h3>
          <p className="mt-2 text-sm text-zinc-400">Instalar Wazuh localmente e documentar alertas.</p>
        </Card>
        <Card>
          <CheckCircle2 className="text-accent" size={20} />
          <h3 className="mt-3 font-semibold">Consistência</h3>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }, (_, index) => (
              <span key={index} className={`h-5 rounded-sm ${index % 5 === 0 ? "bg-white/10" : "bg-accent/70"}`} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardType | null>(null);
  const module = currentModuleConfig();

  useEffect(() => {
    api.get<DashboardType>("/dashboard").then((res) => setData(res.data));
  }, []);

  const tjStats = useMemo(
    () =>
      data
        ? [
            { label: "dias até a prova", value: data.days_remaining, icon: CalendarDays },
            { label: "progresso do edital", value: pct(data.progress), icon: CheckCircle2 },
            { label: "média de acertos", value: pct(data.average_accuracy), icon: Target },
            { label: "questões feitas", value: data.total_questions, icon: BookOpenCheck },
          ]
        : [],
    [data],
  );

  if (!data) return <div className="text-zinc-400">Carregando painel...</div>;
  if (module.id === "cyber") return <CyberDashboard data={data} />;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">{module.target}</p>
          <h2 className="mt-2 text-3xl font-semibold">Painel de comando</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">O agente prioriza peso, erros, revisões vencidas e tempo restante.</p>
        </div>
        <Badge>Próximo simulado: {new Date(data.next_simulation).toLocaleDateString("pt-BR")}</Badge>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tjStats.map((stat) => (
          <Card key={stat.label}>
            <stat.icon className="text-accent" size={22} />
            <p className="mt-5 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
