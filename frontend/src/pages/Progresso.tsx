import { BarChart3, CalendarCheck, Flame, Timer, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge, Card } from "../components/ui";
import { api, Dashboard as DashboardType } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";
import Placeholder from "./Placeholder";

const skillRank = [
  ["Python", 0],
  ["Redes", 0],
  ["Linux", 0],
  ["Cloud", 0],
  ["DevSecOps", 0],
] as const;

export default function Progresso() {
  const module = currentModuleConfig();
  const [data, setData] = useState<DashboardType | null>(null);

  useEffect(() => {
    api.get<DashboardType>("/dashboard").then((res) => setData(res.data));
  }, []);

  if (module.id !== "cyber") return <Placeholder title="Relatórios" />;
  if (!data) return <div className="text-zinc-400">Carregando progresso...</div>;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Analytics de aprendizado</p>
        <h2 className="mt-2 text-3xl font-semibold">Progresso</h2>
        <p className="mt-2 max-w-2xl text-zinc-400">Indicadores de consistência, evolução, conclusão e domínio de habilidades.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Horas estudadas", value: `${data.total_questions * 2}h`, icon: Timer },
          { label: "Streak", value: "0 dias", icon: Flame },
          { label: "Conclusão", value: pct(data.progress), icon: Trophy },
          { label: "Consistência", value: "82%", icon: CalendarCheck },
        ].map((item) => (
          <Card key={item.label}>
            <item.icon className="text-accent" size={20} />
            <p className="mt-4 text-3xl font-semibold">{item.value}</p>
            <p className="mt-1 text-sm text-zinc-400">{item.label}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Evolução mensal</h3>
            <Badge>jornada 6-9 meses</Badge>
          </div>
          <div className="mt-6 grid grid-cols-12 items-end gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <div key={index} className="h-32 rounded-md bg-white/10">
                <div className="rounded-md bg-accent" style={{ height: "0%" }} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-accent" size={18} />
            <h3 className="font-semibold">Ranking de skills</h3>
          </div>
          <div className="mt-5 space-y-4">
            {skillRank.map(([skill, value]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="text-zinc-400">{value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
