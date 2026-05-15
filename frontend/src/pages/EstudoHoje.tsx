import { Brain, CheckSquare, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge, Card } from "../components/ui";
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

export default function EstudoHoje() {
  const [data, setData] = useState<TodayStudy | null>(null);

  useEffect(() => {
    api.get<TodayStudy>("/study/today").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-zinc-400">Calculando recomendação...</div>;

  const module = currentModuleConfig();
  const isCyber = module.id === "cyber";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">{isCyber ? "Plano de hoje" : "Estudo de hoje"}</p>
        <h2 className="mt-2 text-3xl font-semibold">{isCyber ? "Teoria, prática, projeto e anotações" : data.is_sunday ? "Dia de simulado" : "3 blocos de 60 minutos"}</h2>
        <p className="mt-2 text-zinc-400">{isCyber ? "Jornada de 6 a 9 meses • foco em mercado" : `${data.days_remaining} dias restantes • alvo de ${data.questions_target} questões`}</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <TopicBlock title={isCyber ? "Teoria guiada" : "Bloco 1 • teoria principal"} topic={data.main_topic} emptyText={isCyber ? "Registre práticas para refinar a jornada." : "Registre questões para refinar o plano."} />
        <TopicBlock title={isCyber ? "Laboratório prático" : "Bloco 2 • revisão ou teoria secundária"} topic={data.secondary_topic} emptyText={isCyber ? "Escolha uma ferramenta ou lab para executar." : "Registre questões para refinar o plano."} />
        <TopicBlock title={isCyber ? "Revisão ou ferramenta" : "Revisão obrigatória"} topic={data.review_topic} emptyText={isCyber ? "Nenhuma prática vencida hoje." : "Nenhuma revisão vencida hoje."} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <CheckSquare className="text-accent" size={18} />
            <h3 className="font-semibold">Checklist</h3>
          </div>
          <div className="mt-4 space-y-3">
            {data.checklist.map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300">
                <input type="checkbox" className="h-4 w-4 accent-teal-400" />
                {item}
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Brain className="text-accent" size={18} />
            <h3 className="font-semibold">Flashcards vencidos</h3>
          </div>
          <div className="mt-4 space-y-3">
            {data.flashcards_due.slice(0, 6).map((card) => (
              <div key={card.id} className="rounded-md border border-white/10 bg-black/20 p-3">
                <p className="text-sm">{card.question}</p>
                <p className="mt-1 text-xs text-zinc-500">{card.topic?.name}</p>
              </div>
            ))}
            {data.flashcards_due.length === 0 ? <p className="text-sm text-zinc-500">Nenhum flashcard vencido hoje.</p> : null}
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-center gap-2">
          <ClipboardList className="text-accent" size={18} />
          <h3 className="font-semibold">Regra aplicada</h3>
        </div>
        <p className="mt-3 text-sm text-zinc-400">
          {isCyber
            ? "O motor prioriza fundamentos, ferramentas, laboratórios pendentes e pontos fracos para evoluir rumo à primeira vaga."
            : "O motor escolhe prioridade alta, baixa acurácia, ausência de histórico e revisões vencidas. Aos domingos ele troca a rotina por simulado, correção e análise de erros."}
        </p>
      </Card>
    </div>
  );
}
