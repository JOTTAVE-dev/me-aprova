import { Brain, CheckCircle2, CheckSquare, Clock, Code2, Flame, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge, Button, Card } from "../components/ui";
import { api, TodayStudy, Topic } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";

function TopicBlock({ title, topic, emptyText }: { title: string; topic: Topic | null; emptyText: string }) {
  return (
    <Card>
      <p className="text-sm text-zinc-400">{title}</p>
      <h3 className="mt-2 text-xl font-semibold">{topic?.name ?? "Aguardando histórico"}</h3>
      <p className="mt-2 text-sm text-zinc-500">{topic?.category ?? emptyText}</p>
      {topic ? <Badge className="mt-4 inline-block">Prioridade {topic.priority}</Badge> : null}
    </Card>
  );
}

function CyberStudyToday({ data }: { data: TodayStudy }) {
  const [done, setDone] = useState<string[]>([]);
  const tasks = [
    { id: "theory", title: "Teoria guiada", time: "40 min", topic: data.main_topic?.name ?? "Fundamentos pendentes", icon: Brain },
    { id: "lab", title: "Laboratório prático", time: "60 min", topic: data.secondary_topic?.name ?? "Escolha um lab", icon: Code2 },
    { id: "project", title: "Projeto ou portfólio", time: "30 min", topic: "Documente evidências e comandos", icon: Play },
    { id: "notes", title: "Anotações e flashcards", time: "20 min", topic: "Revise conceitos vencidos", icon: CheckSquare },
  ];
  const progress = Math.round((done.length / tasks.length) * 100);

  function toggle(id: string) {
    setDone((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden">
          <Badge>Estudar Hoje</Badge>
          <h2 className="mt-4 text-4xl font-semibold">Plano diário para avançar na carreira.</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">Uma sessão enxuta com teoria, laboratório, portfólio e revisão. O objetivo é constância e evidência prática.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>
              <Flame size={16} /> Começar sessão
            </Button>
            <Badge>XP de hoje: +0</Badge>
            <Badge>Tempo: 2h30</Badge>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Progresso diário</span>
            <Clock className="text-accent" size={18} />
          </div>
          <p className="mt-4 text-5xl font-semibold">{progress}%</p>
          <div className="mt-4 h-3 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-zinc-400">{done.length}/{tasks.length} tarefas concluídas</p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => {
          const checked = done.includes(task.id);
          return (
            <button key={task.id} type="button" onClick={() => toggle(task.id)} className="text-left">
              <Card className={`h-full transition hover:border-accent/40 ${checked ? "border-accent/50 bg-accent/10" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-accent">
                      <task.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{task.topic}</p>
                    </div>
                  </div>
                  {checked ? <CheckCircle2 className="text-accent" size={20} /> : <Badge>{task.time}</Badge>}
                </div>
              </Card>
            </button>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Revisões</h3>
          <div className="mt-4 space-y-3">
            {data.flashcards_due.slice(0, 5).map((card) => (
              <div key={card.id} className="rounded-md border border-white/10 bg-black/20 p-3 text-sm">
                {card.question}
              </div>
            ))}
            {data.flashcards_due.length === 0 ? <p className="text-sm text-zinc-500">Nenhuma revisão vencida hoje.</p> : null}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Mini projeto sugerido</h3>
          <p className="mt-3 text-sm text-zinc-400">Execute um laboratório pequeno, capture evidências, anote comandos usados e salve um resumo para o portfólio.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Wazuh</Badge>
            <Badge>Wireshark</Badge>
            <Badge>Nmap</Badge>
            <Badge>Linux</Badge>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default function EstudoHoje() {
  const [data, setData] = useState<TodayStudy | null>(null);
  const module = currentModuleConfig();

  useEffect(() => {
    api.get<TodayStudy>("/study/today").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-zinc-400">Calculando recomendação...</div>;
  if (module.id === "cyber") return <CyberStudyToday data={data} />;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Estudo de hoje</p>
        <h2 className="mt-2 text-3xl font-semibold">{data.is_sunday ? "Dia de simulado" : "3 blocos de 60 minutos"}</h2>
        <p className="mt-2 text-zinc-400">{data.days_remaining} dias restantes • alvo de {data.questions_target} questões</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <TopicBlock title="Bloco 1 • teoria principal" topic={data.main_topic} emptyText="Registre questões para refinar o plano." />
        <TopicBlock title="Bloco 2 • revisão ou teoria secundária" topic={data.secondary_topic} emptyText="Registre questões para refinar o plano." />
        <TopicBlock title="Revisão obrigatória" topic={data.review_topic} emptyText="Nenhuma revisão vencida hoje." />
      </section>
    </div>
  );
}
