import { Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, GhostButton, Input, Select } from "../components/ui";
import { api, Topic } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";

export default function Conteudos() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [form, setForm] = useState({ name: "", category: "Banco de Dados", priority: 3 });
  const module = currentModuleConfig();
  const isCyber = module.id === "cyber";

  const load = () => api.get<Topic[]>("/topics").then((res) => setTopics(res.data));
  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => Array.from(new Set(topics.map((topic) => topic.category))).sort(), [topics]);

  async function createTopic(event: FormEvent) {
    event.preventDefault();
    await api.post("/topics", { ...form, weight: form.priority, status: "pending" });
    toast.success(isCyber ? "Item de trilha cadastrado" : "Tema cadastrado");
    setForm({ ...form, name: "" });
    load();
  }

  async function removeTopic(id: number) {
    await api.delete(`/topics/${id}`);
    toast.success(isCyber ? "Item removido" : "Tema removido");
    load();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">{isCyber ? "Trilhas de carreira" : "Edital vivo"}</p>
        <h2 className="mt-2 text-3xl font-semibold">{isCyber ? "Trilhas" : "Conteúdos"}</h2>
        <p className="mt-2 text-zinc-400">{topics.length} {isCyber ? "habilidades, ferramentas e projetos cadastrados." : "temas cadastrados com pesos de prioridade."}</p>
      </section>

      <Card>
        <form onSubmit={createTopic} className="grid gap-3 md:grid-cols-[1fr_220px_120px_auto]">
          <Input placeholder={isCyber ? "Nova habilidade, ferramenta ou projeto" : "Novo tema"} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
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
            <Badge>{topic.questions_done} {isCyber ? "práticas" : "questões"} • {pct(topic.accuracy)}</Badge>
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
