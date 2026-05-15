import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, Input, Textarea } from "../components/ui";
import { api, Simulation } from "../lib/api";
import { pct } from "../lib/utils";

export default function Simulados() {
  const [items, setItems] = useState<Simulation[]>([]);
  const [form, setForm] = useState({ total_questions: 70, correct: 0, notes: "" });

  const load = () => api.get<Simulation[]>("/simulations").then((res) => setItems(res.data));
  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/simulations", form);
    toast.success("Simulado registrado");
    setForm({ total_questions: 70, correct: 0, notes: "" });
    load();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Domingo</p>
        <h2 className="mt-2 text-3xl font-semibold">Simulados</h2>
      </section>

      <Card>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-[160px_160px_1fr_auto]">
            <Input type="number" min={1} value={form.total_questions} onChange={(event) => setForm({ ...form, total_questions: Number(event.target.value) })} />
            <Input type="number" min={0} max={form.total_questions} value={form.correct} onChange={(event) => setForm({ ...form, correct: Number(event.target.value) })} />
            <Textarea placeholder="Erros, temas fracos e ações da semana" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            <Button>
              <Plus size={16} /> Salvar
            </Button>
          </div>
        </form>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{new Date(item.simulation_date).toLocaleDateString("pt-BR")}</h3>
              <Badge>{pct(item.score)}</Badge>
            </div>
            <p className="mt-3 text-sm text-zinc-400">{item.correct}/{item.total_questions} questões corretas</p>
            {item.notes ? <p className="mt-3 text-sm text-zinc-500">{item.notes}</p> : null}
          </Card>
        ))}
      </section>
    </div>
  );
}
