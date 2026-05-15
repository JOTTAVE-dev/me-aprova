import { CheckCircle2, ChevronDown, ChevronRight, Lock, Play, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, GhostButton, Input, Select } from "../components/ui";
import { api, Topic } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";

function statusFor(index: number, progress: number) {
  if (progress >= 100) return { label: "concluído", icon: CheckCircle2, className: "text-accent" };
  if (index <= 1 || progress > 0) return { label: "desbloqueado", icon: Play, className: "text-amber" };
  return { label: "bloqueado", icon: Lock, className: "text-zinc-500" };
}

export default function Conteudos() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [openTrail, setOpenTrail] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "Banco de Dados", priority: 3 });
  const module = currentModuleConfig();
  const isCyber = module.id === "cyber";

  const load = () => api.get<Topic[]>("/topics").then((res) => setTopics(res.data));

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => Array.from(new Set(topics.map((topic) => topic.category))).sort(), [topics]);
  const groupedTopics = useMemo(
    () =>
      categories.map((category) => ({
        category,
        topics: topics.filter((topic) => topic.category === category),
      })),
    [categories, topics],
  );

  useEffect(() => {
    if (isCyber && !openTrail && categories.length) setOpenTrail(categories[0]);
  }, [categories, isCyber, openTrail]);

  async function createTopic(event: FormEvent) {
    event.preventDefault();
    await api.post("/topics", { ...form, weight: form.priority, status: "pending" });
    toast.success(isCyber ? "Item de roadmap cadastrado" : "Tema cadastrado");
    setForm({ ...form, name: "" });
    setOpenTrail(form.category);
    load();
  }

  async function removeTopic(id: number) {
    await api.delete(`/topics/${id}`);
    toast.success(isCyber ? "Tópico removido" : "Tema removido");
    load();
  }

  if (isCyber) {
    return (
      <div className="space-y-6">
        <section>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Roadmap visual</p>
          <h2 className="mt-2 text-3xl font-semibold">Sua trilha de Cybersecurity</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">Avance por fases, desbloqueie módulos, conclua tópicos e conecte cada etapa a projetos práticos.</p>
        </section>

        <section className="space-y-4">
          {groupedTopics.map((group, index) => {
            const isOpen = openTrail === group.category;
            const completed = group.topics.filter((topic) => topic.questions_done > 0).length;
            const progress = group.topics.length ? Math.round((completed / group.topics.length) * 100) : 0;
            const status = statusFor(index, progress);

            return (
              <div key={group.category} className="relative">
                {index < groupedTopics.length - 1 ? <div className="absolute left-6 top-16 h-[calc(100%+1rem)] w-px bg-white/10" /> : null}
                <Card className="relative overflow-hidden p-0 transition hover:border-accent/40">
                  <button
                    type="button"
                    onClick={() => setOpenTrail(isOpen ? null : group.category)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 ${status.className}`}>
                        <status.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>Fase {index + 1}</Badge>
                          <Badge>{status.label}</Badge>
                          <Badge>{Math.max(2, group.topics.length)}h estimadas</Badge>
                        </div>
                        <h3 className="mt-3 truncate text-xl font-semibold">{group.category.replace(/^Fase \d+ — /, "")}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{group.topics.length} tópicos • {completed} iniciados • projetos práticos conectados</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="hidden w-28 md:block">
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-1 text-right text-xs text-zinc-500">{progress}%</p>
                      </div>
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-white/10 bg-black/20 px-5 py-5">
                      <div className="grid gap-3 md:grid-cols-2">
                        {group.topics.map((topic) => (
                          <div key={topic.id} className="rounded-md border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-medium">{topic.name}</h4>
                                <p className="mt-1 text-xs text-zinc-500">Checklist • exercícios • revisão • mini lab</p>
                              </div>
                              <Badge>P{topic.priority}</Badge>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(topic.accuracy, 100)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Edital vivo</p>
        <h2 className="mt-2 text-3xl font-semibold">Conteúdos</h2>
        <p className="mt-2 text-zinc-400">{topics.length} temas cadastrados com pesos de prioridade.</p>
      </section>

      <Card>
        <form onSubmit={createTopic} className="grid gap-3 md:grid-cols-[1fr_220px_120px_auto]">
          <Input placeholder="Novo tema" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
          <Input type="number" min={1} max={5} value={form.priority} onChange={(event) => setForm({ ...form, priority: Number(event.target.value) })} />
          <Button>
            <Plus size={16} /> Adicionar
          </Button>
        </form>
      </Card>

      <section className="grid gap-3">
        {topics.map((topic) => (
          <Card key={topic.id} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
            <div>
              <h3 className="font-medium">{topic.name}</h3>
              <p className="text-sm text-zinc-500">{topic.category}</p>
            </div>
            <Badge>Prioridade {topic.priority}</Badge>
            <Badge>{topic.questions_done} questões • {pct(topic.accuracy)}</Badge>
            <div className="flex gap-2">
              <GhostButton title="Salvar ajustes">
                <Save size={16} />
              </GhostButton>
              <GhostButton title="Remover" onClick={() => removeTopic(topic.id)}>
                <Trash2 size={16} />
              </GhostButton>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
