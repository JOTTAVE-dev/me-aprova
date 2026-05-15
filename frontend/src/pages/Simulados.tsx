import { Play, Plus, Trophy } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge, Button, Card, Input, Textarea } from "../components/ui";
import { api, Simulation } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";
import { pct } from "../lib/utils";

const projects = [
  { name: "Dashboard de Monitoramento", difficulty: "Intermediário", tech: ["Python", "FastAPI", "Logs", "Wazuh"], progress: 25, description: "Crie um painel simples para visualizar eventos e alertas." },
  { name: "Scanner de Rede", difficulty: "Iniciante", tech: ["Python", "Nmap", "Relatórios"], progress: 45, description: "Escaneie sua própria rede e gere um relatório de portas e serviços." },
  { name: "Sistema de Logs", difficulty: "Intermediário", tech: ["ELK", "Wazuh", "Linux"], progress: 10, description: "Centralize logs e documente eventos relevantes." },
  { name: "Laboratório Blue Team", difficulty: "Avançado", tech: ["Ubuntu", "Windows Server", "Active Directory"], progress: 5, description: "Monte um ambiente defensivo com AD, logs e simulação de incidentes." },
];

function CyberProjects({ items, form, setForm, submit }: {
  items: Simulation[];
  form: { total_questions: number; correct: number; notes: string };
  setForm: (form: { total_questions: number; correct: number; notes: string }) => void;
  submit: (event: FormEvent) => void;
}) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Portfólio prático</p>
        <h2 className="mt-2 text-3xl font-semibold">Projetos</h2>
        <p className="mt-2 max-w-2xl text-zinc-400">Construa evidências reais para entrevistas: prints, relatórios, README, comandos e aprendizados.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge>{project.difficulty}</Badge>
                <h3 className="mt-3 text-xl font-semibold">{project.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
              </div>
              <Trophy className="text-accent" size={22} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">{project.progress}% concluído</span>
              <Button>
                <Play size={16} /> Iniciar projeto
              </Button>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <h3 className="font-semibold">Registrar laboratório concluído</h3>
        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-[160px_160px_1fr_auto]">
          <Input type="number" min={1} value={form.total_questions} onChange={(event) => setForm({ ...form, total_questions: Number(event.target.value) })} />
          <Input type="number" min={0} max={form.total_questions} value={form.correct} onChange={(event) => setForm({ ...form, correct: Number(event.target.value) })} />
          <Textarea placeholder="O que foi feito, evidências, ferramenta usada e próximo passo" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          <Button>
            <Plus size={16} /> Salvar
          </Button>
        </form>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{new Date(item.simulation_date).toLocaleDateString("pt-BR")}</h3>
              <Badge>{pct(item.score)}</Badge>
            </div>
            <p className="mt-3 text-sm text-zinc-400">{item.correct}/{item.total_questions} etapas concluídas</p>
            {item.notes ? <p className="mt-3 text-sm text-zinc-500">{item.notes}</p> : null}
          </Card>
        ))}
      </section>
    </div>
  );
}

export default function Simulados() {
  const module = currentModuleConfig();
  const isCyber = module.id === "cyber";
  const [items, setItems] = useState<Simulation[]>([]);
  const [form, setForm] = useState({ total_questions: isCyber ? 1 : 70, correct: 0, notes: "" });

  const load = () => api.get<Simulation[]>("/simulations").then((res) => setItems(res.data));
  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/simulations", form);
    toast.success(isCyber ? "Laboratório registrado" : "Simulado registrado");
    setForm({ total_questions: isCyber ? 1 : 70, correct: 0, notes: "" });
    load();
  }

  if (isCyber) return <CyberProjects items={items} form={form} setForm={setForm} submit={submit} />;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.28em] text-accent">Domingo</p>
        <h2 className="mt-2 text-3xl font-semibold">Simulados</h2>
      </section>
      <Card>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-[160px_160px_1fr_auto]">
          <Input type="number" min={1} value={form.total_questions} onChange={(event) => setForm({ ...form, total_questions: Number(event.target.value) })} />
          <Input type="number" min={0} max={form.total_questions} value={form.correct} onChange={(event) => setForm({ ...form, correct: Number(event.target.value) })} />
          <Textarea placeholder="Erros, temas fracos e ações da semana" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          <Button>
            <Plus size={16} /> Salvar
          </Button>
        </form>
      </Card>
    </div>
  );
}
