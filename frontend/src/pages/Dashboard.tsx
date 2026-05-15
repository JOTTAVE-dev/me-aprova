import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, Badge } from "../components/ui";
import { api, Dashboard as DashboardType } from "../lib/api";
import { pct } from "../lib/utils";

export default function Dashboard() {
  const [data, setData] = useState<DashboardType | null>(null);

  useEffect(() => {
    api.get<DashboardType>("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-zinc-400">Carregando painel...</div>;

  const stats = [
    { label: "dias até a prova", value: data.days_remaining, icon: CalendarDays },
    { label: "progresso do edital", value: pct(data.progress), icon: CheckCircle2 },
    { label: "média de acertos", value: pct(data.average_accuracy), icon: Target },
    { label: "questões feitas", value: data.total_questions, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">TJ • Analista de TI</p>
          <h2 className="mt-2 text-3xl font-semibold">Painel de comando</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">Prova em 09/08. O agente prioriza peso, erros, revisões vencidas e tempo restante.</p>
        </div>
        <Badge>Próximo simulado: {new Date(data.next_simulation).toLocaleDateString("pt-BR")}</Badge>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <stat.icon className="text-accent" size={22} />
              <Badge>{stat.label}</Badge>
            </div>
            <p className="mt-5 text-3xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber" size={18} />
            <h3 className="font-semibold">Revisões vencidas</h3>
          </div>
          <p className="mt-4 text-4xl font-semibold">{data.overdue_reviews}</p>
          <p className="mt-2 text-sm text-zinc-400">Flashcards e temas com repetição obrigatória.</p>
        </Card>
        <Card className="lg:col-span-1">
          <h3 className="font-semibold">Temas fortes</h3>
          <div className="mt-4 space-y-3">
            {data.strong_topics.length === 0 ? <p className="text-sm text-zinc-500">Ainda sem histórico suficiente.</p> : null}
            {data.strong_topics.map((topic) => (
              <div key={topic.id} className="flex justify-between text-sm">
                <span className="text-zinc-300">{topic.name}</span>
                <span className="text-accent">{pct(topic.accuracy)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Pontos fracos</h3>
          <div className="mt-4 space-y-3">
            {data.weak_topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-zinc-300">{topic.name}</span>
                <Badge>P{topic.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
