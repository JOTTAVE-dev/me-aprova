import { Brain, CheckCircle2, CheckSquare, ChevronDown, Clock, Code2, Flame, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge, Button, Card } from "../components/ui";
import { api, TodayStudy, Topic } from "../lib/api";
import { currentModuleConfig } from "../lib/modules";

type StudyTask = {
  id: string;
  title: string;
  time: string;
  topic: string;
  icon?: typeof Brain;
  subtasks?: string[];
};

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

function useStudySession(data: TodayStudy) {
  const doneStorageKey = `me_aprova_study_done_${data.date}`;
  const sessionStorageKey = `me_aprova_study_started_${data.date}`;
  const [sessionStarted, setSessionStarted] = useState(() => window.localStorage.getItem(sessionStorageKey) === "true");
  const [done, setDone] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(doneStorageKey);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(doneStorageKey, JSON.stringify(done));
  }, [done, doneStorageKey]);

  function startSession() {
    window.localStorage.setItem(sessionStorageKey, "true");
    setSessionStarted(true);
  }

  function toggleTask(id: string) {
    setDone((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return { done, sessionStarted, startSession, toggleTask };
}

function StudyTrail({ tasks, done, onToggle, subDoneKey }: { tasks: StudyTask[]; done: string[]; onToggle: (id: string) => void; subDoneKey: string }) {
  const progress = Math.round((done.length / tasks.length) * 100);
  const [expandedTask, setExpandedTask] = useState<string | null>(tasks.find((task) => task.subtasks?.length)?.id ?? null);
  const [subDone, setSubDone] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(subDoneKey);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(subDoneKey, JSON.stringify(subDone));
  }, [subDone, subDoneKey]);

  function toggleSubtask(id: string) {
    setSubDone((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Trilha da sessão</h3>
          <p className="mt-1 text-sm text-zinc-400">Marque cada tema quando terminar o estudo.</p>
        </div>
        <Badge>{progress}% concluído</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task, index) => {
          const checked = done.includes(task.id);
          const Icon = task.icon;
          const isExpanded = expandedTask === task.id;

          return (
            <div key={task.id}>
              <Card className={`h-full transition duration-300 hover:border-accent/40 ${checked ? "border-accent/50 bg-accent/10" : ""}`}>
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 h-5 w-5 rounded border-white/20 bg-black/30 accent-teal-400"
                    aria-label={`Concluir ${task.title}`}
                  />
                  <div className="flex min-w-0 flex-1 gap-3">
                    {Icon ? (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-accent">
                        <Icon size={20} />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>Etapa {index + 1}</Badge>
                        <Badge>{task.time}</Badge>
                      </div>
                      <h3 className={`mt-3 font-semibold ${checked ? "text-accent" : ""}`}>{task.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{task.topic}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedTask((current) => (current === task.id ? null : task.id))}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:border-accent/40 hover:text-accent"
                    aria-label={isExpanded ? `Recolher ${task.title}` : `Expandir ${task.title}`}
                    aria-expanded={isExpanded}
                  >
                    <ChevronDown className={`transition-transform duration-300 ease-out ${isExpanded ? "rotate-180" : ""}`} size={18} />
                  </button>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "mt-5 max-h-[560px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="rounded-md border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{task.subtasks?.length ? "Comandos essenciais" : "Conteúdo da etapa"}</p>
                      {checked ? <CheckCircle2 className="shrink-0 text-accent" size={18} /> : null}
                    </div>
                    {task.subtasks?.length ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {task.subtasks.map((subtask) => {
                        const id = `${task.id}:${subtask}`;
                        const subChecked = subDone.includes(id);

                        return (
                          <label key={id} className={`flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm transition ${subChecked ? "border-accent/50 bg-accent/10 text-accent" : "text-zinc-300"}`}>
                            <input
                              type="checkbox"
                              checked={subChecked}
                              onChange={() => toggleSubtask(id)}
                              className="h-4 w-4 rounded border-white/20 bg-black/30 accent-teal-400"
                            />
                            <span>{subtask}</span>
                          </label>
                        );
                      })}
                    </div>
                    ) : (
                      <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300">
                        {task.topic}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrailPreview({ tasksCount }: { tasksCount: number }) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Trilha pronta para hoje</h3>
          <p className="mt-1 text-sm text-zinc-400">Clique em começar sessão para abrir os temas e marcar seu avanço.</p>
        </div>
        <Badge>{tasksCount} etapas</Badge>
      </div>
    </Card>
  );
}

function CyberStudyToday({ data }: { data: TodayStudy }) {
  const tasks: StudyTask[] = [
    {
      id: "theory",
      title: "Teoria guiada",
      time: "40 min",
      topic: data.main_topic?.name ?? "Fundamentos pendentes",
      icon: Brain,
      subtasks: ["pwd", "ls", "cd", "mkdir", "touch", "cp", "mv", "rm", "cat", "less", "grep", "find", "chmod", "chown", "sudo", "man"],
    },
    { id: "lab", title: "Laboratório prático", time: "60 min", topic: data.secondary_topic?.name ?? "Escolha um lab", icon: Code2 },
    { id: "project", title: "Projeto ou portfólio", time: "30 min", topic: "Documente evidências e comandos", icon: Play },
    { id: "notes", title: "Anotações e flashcards", time: "20 min", topic: "Revise conceitos vencidos", icon: CheckSquare },
  ];
  const { done, sessionStarted, startSession, toggleTask } = useStudySession(data);
  const progress = Math.round((done.length / tasks.length) * 100);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden">
          <Badge>Estudar Hoje</Badge>
          <h2 className="mt-4 text-4xl font-semibold">Plano diário para avançar na carreira.</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">Uma sessão enxuta com teoria, laboratório, portfólio e revisão. O objetivo é constância e evidência prática.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={startSession} aria-expanded={sessionStarted}>
              <Flame size={16} /> {sessionStarted ? "Sessão iniciada" : "Começar sessão"}
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

      {sessionStarted ? <StudyTrail tasks={tasks} done={done} onToggle={toggleTask} subDoneKey={`me_aprova_study_sub_done_${data.date}`} /> : <TrailPreview tasksCount={tasks.length} />}

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

function GeneralStudyToday({ data }: { data: TodayStudy }) {
  const tasks: StudyTask[] = [
    { id: "main", title: "Bloco 1: teoria principal", topic: data.main_topic?.name ?? "Tema principal pendente", time: "60 min" },
    { id: "secondary", title: "Bloco 2: revisão ou teoria secundária", topic: data.secondary_topic?.name ?? "Tema secundário pendente", time: "60 min" },
    { id: "questions", title: "Bloco 3: questões e revisão de erros", topic: data.review_topic?.name ?? "Registrar desempenho ao terminar", time: "60 min" },
  ];
  const { done, sessionStarted, startSession, toggleTask } = useStudySession(data);
  const progress = Math.round((done.length / tasks.length) * 100);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Estudo de hoje</p>
          <h2 className="mt-2 text-3xl font-semibold">{data.is_sunday ? "Dia de simulado" : "3 blocos de 60 minutos"}</h2>
          <p className="mt-2 text-zinc-400">{data.days_remaining} dias restantes - alvo de {data.questions_target} questões</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={startSession} aria-expanded={sessionStarted}>
              <Flame size={16} /> {sessionStarted ? "Sessão iniciada" : "Começar sessão"}
            </Button>
            <Badge>{done.length}/{tasks.length} etapas concluídas</Badge>
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
        </Card>
      </section>

      {sessionStarted ? <StudyTrail tasks={tasks} done={done} onToggle={toggleTask} subDoneKey={`me_aprova_study_sub_done_${data.date}`} /> : <TrailPreview tasksCount={tasks.length} />}

      <section className="grid gap-4 lg:grid-cols-3">
        <TopicBlock title="Bloco 1 - teoria principal" topic={data.main_topic} emptyText="Registre questões para refinar o plano." />
        <TopicBlock title="Bloco 2 - revisão ou teoria secundária" topic={data.secondary_topic} emptyText="Registre questões para refinar o plano." />
        <TopicBlock title="Revisão obrigatória" topic={data.review_topic} emptyText="Nenhuma revisão vencida hoje." />
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
  return <GeneralStudyToday data={data} />;
}
