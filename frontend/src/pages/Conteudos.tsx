import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, GhostButton, Input, Select } from "../components/ui";
import { api, Topic } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";

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
    if (isCyber && !openTrail && categories.length) {
      setOpenTrail(categories[0]);
    }
  }, [categories, isCyber, openTrail]);

  async function createTopic(event: FormEvent) {
    event.preventDefault();
    await api.post("/topics", { ...form, weight: form.priority, status: "pending" });
    toast.success(isCyber ? "Item de trilha cadastrado" : "Tema cadastrado");
    setForm({ ...form, name: "" });
    setOpenTrail(form.category);
    load();
  }

  async function removeTopic(id: number) {
    await api.delete(`/topics/${id}`);
    toast.success(isCyber ? "Subtema removido" : "Tema removido");
    load();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">{isCyber ? "Trilhas de carreira" : "Edital vivo"}</p>
        <h2 className="mt-2 text-3xl font-semibold">{isCyber ? "Trilhas" : "Conteúdos"}</h2>
        <p className="mt-2 text-zinc-400">
          {topics.length} {isCyber ? "habilidades, ferramentas e projetos organizados por trilha." : "temas cadastrados com pesos de prioridade."}
        </p>
      </section>

      <Card>
        <form onSubmit={createTopic} className="grid gap-3 md:grid-cols-[1fr_220px_120px_auto]">
          <Input placeholder={isCyber ? "Novo subtema, ferramenta ou projeto" : "Novo tema"} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
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

      {isCyber ? (
        <section className="space-y-3">
          {groupedTopics.map((group) => {
            const isOpen = openTrail === group.category;
            const completed = group.topics.filter((topic) => topic.questions_done > 0).length;
            const progress = group.topics.length ? Math.round((completed / group.topics.length) * 100) : 0;

            return (
              <Card key={group.category} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpenTrail(isOpen ? null : group.category)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-accent">
                      {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{group.category}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{group.topics.length} subtemas • {completed} iniciados</p>
                    </div>
                  </div>
                  <Badge>{progress}%</Badge>
                </button>

                {isOpen ? (
                  <div className="border-t border-white/10 px-5 py-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      {group.topics.map((topic) => (
                        <div key={topic.id} className="rounded-md border border-white/10 bg-black/20 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-medium">{topic.name}</h4>
                              <p className="mt-1 text-xs text-zinc-500">{topic.questions_done} práticas • {pct(topic.accuracy)}</p>
                            </div>
                            <GhostButton title="Remover subtema" onClick={() => removeTopic(topic.id)} className="h-9 w-9 shrink-0 px-0">
                              <Trash2 size={15} />
                            </GhostButton>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge>Prioridade {topic.priority}</Badge>
                            <Badge>{topic.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </section>
      ) : (
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
      )}
    </div>
  );
}
