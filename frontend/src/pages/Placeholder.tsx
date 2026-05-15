import { Card } from "../components/ui";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Fase 1</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      </section>
      <Card>
        <p className="text-zinc-400">
          Estrutura reservada para evolução do MVP. Os dados de desempenho já estão sendo coletados pelas telas de questões, flashcards e simulados.
        </p>
      </Card>
    </div>
  );
}
