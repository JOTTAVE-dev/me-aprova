import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, Input, Select } from "../components/ui";
import { api, QuestionLog, Topic } from "../lib/api";

export default function Questoes() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [logs, setLogs] = useState<QuestionLog[]>([]);
  const [form, setForm] = useState({ bank: "FCC", topic_id: 0, quantity: 20, correct: 0 });

  const load = async () => {
    const [topicsRes, logsRes] = await Promise.all([api.get<Topic[]>("/topics"), api.get<QuestionLog[]>("/questions")]);
    setTopics(topicsRes.data);
    setLogs(logsRes.data);
    setForm((current) => ({ ...current, topic_id: current.topic_id || topicsRes.data[0]?.id || 0 }));
  };

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/questions", form);
    toast.success("Desempenho registrado");
    load();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Questões FCC</p>
        <h2 className="mt-2 text-3xl font-semibold">Registro de desempenho</h2>
      </section>

      <Card>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-[100px_1fr_120px_120px_auto]">
          <Input value={form.bank} onChange={(event) => setForm({ ...form, bank: event.target.value })} />
          <Select value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: Number(event.target.value) })}>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </Select>
          <Input type="number" min={1} value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })} />
          <Input type="number" min={0} max={form.quantity} value={form.correct} onChange={(event) => setForm({ ...form, correct: Number(event.target.value) })} />
          <Button>
            <Plus size={16} /> Registrar
          </Button>
        </form>
      </Card>

      <section className="grid gap-3">
        {logs.map((log) => {
          const topic = topics.find((item) => item.id === log.topic_id);
          return (
            <Card key={log.id} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
              <div>
                <h3 className="font-medium">{topic?.name ?? "Tema"}</h3>
                <p className="text-sm text-zinc-500">{new Date(log.logged_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <Badge>{log.bank}</Badge>
              <Badge>{log.correct}/{log.quantity} acertos</Badge>
              <Badge>{Math.round((log.correct / log.quantity) * 100)}%</Badge>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
