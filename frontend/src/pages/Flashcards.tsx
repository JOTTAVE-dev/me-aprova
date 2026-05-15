import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, GhostButton, Input, Select, Textarea } from "../components/ui";
import { api, Flashcard, Topic } from "../lib/api";

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [form, setForm] = useState({ question: "", answer: "", difficulty: 3, topic_id: 0 });

  const load = async () => {
    const [cardsRes, topicsRes] = await Promise.all([api.get<Flashcard[]>("/flashcards"), api.get<Topic[]>("/topics")]);
    setCards(cardsRes.data);
    setTopics(topicsRes.data);
    setForm((current) => ({ ...current, topic_id: current.topic_id || topicsRes.data[0]?.id || 0 }));
  };

  useEffect(() => {
    load();
  }, []);

  async function createCard(event: FormEvent) {
    event.preventDefault();
    await api.post("/flashcards", form);
    toast.success("Flashcard criado");
    setForm({ ...form, question: "", answer: "" });
    load();
  }

  async function review(id: number, remembered: boolean) {
    await api.post(`/flashcards/${id}/review?remembered=${remembered}`);
    toast.success(remembered ? "Revisão avançada" : "Revisão reiniciada");
    load();
  }

  async function remove(id: number) {
    await api.delete(`/flashcards/${id}`);
    toast.success("Flashcard removido");
    load();
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Revisão espaçada</p>
        <h2 className="mt-2 text-3xl font-semibold">Flashcards</h2>
      </section>

      <Card>
        <form onSubmit={createCard} className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Textarea placeholder="Pergunta" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} required />
            <Textarea placeholder="Resposta" value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} required />
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
            <Select value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: Number(event.target.value) })}>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </Select>
            <Input type="number" min={1} max={5} value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: Number(event.target.value) })} />
            <Button>
              <Plus size={16} /> Criar
            </Button>
          </div>
        </form>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge>{card.topic?.name}</Badge>
                <h3 className="mt-3 font-medium">{card.question}</h3>
                <p className="mt-2 text-sm text-zinc-400">{card.answer}</p>
                <p className="mt-3 text-xs text-zinc-500">Próxima revisão: {new Date(card.next_review_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <GhostButton onClick={() => remove(card.id)} title="Remover">
                <Trash2 size={16} />
              </GhostButton>
            </div>
            <div className="mt-4 flex gap-2">
              <GhostButton onClick={() => review(card.id, false)}>
                <RotateCcw size={16} /> Errei
              </GhostButton>
              <Button onClick={() => review(card.id, true)}>
                <Check size={16} /> Acertei
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
