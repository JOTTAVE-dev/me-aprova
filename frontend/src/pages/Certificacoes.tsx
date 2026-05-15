import { Award, BadgeCheck, BriefcaseBusiness, Cloud, LockKeyhole, ShieldCheck, Star } from "lucide-react";

import { Badge, Card } from "../components/ui";

const levels = [
  {
    title: "Entrada absoluta",
    goal: "Entender vocabulário, rotina e base de segurança.",
    icon: ShieldCheck,
    items: [
      { name: "Google Cybersecurity Certificate", focus: "SOC, fundamentos, SIEM, Linux e Python básico", priority: "Comece aqui" },
      { name: "Cisco Introduction to Cybersecurity", focus: "Conceitos iniciais e visão geral da área", priority: "Opcional" },
      { name: "ISC2 Certified in Cybersecurity (CC)", focus: "Fundamentos amplos de segurança", priority: "Boa base" },
    ],
  },
  {
    title: "Base profissional",
    goal: "Ficar competitivo para SOC Jr e Blue Team Jr.",
    icon: BriefcaseBusiness,
    items: [
      { name: "Cisco CyberOps Associate", focus: "SOC, alertas, incidentes, monitoramento e análise", priority: "Muito forte" },
      { name: "CompTIA Network+", focus: "Redes, protocolos, troubleshooting e infraestrutura", priority: "Se redes estiver fraco" },
      { name: "CompTIA Security+", focus: "Segurança geral reconhecida pelo mercado", priority: "Meta principal" },
    ],
  },
  {
    title: "Cloud e Microsoft",
    goal: "Abrir caminho para Cloud Security Jr.",
    icon: Cloud,
    items: [
      { name: "AWS Cloud Practitioner", focus: "AWS, IAM, EC2, S3, VPC e conceitos de cloud", priority: "Primeira cloud" },
      { name: "Microsoft SC-900", focus: "Segurança, compliance e identidade Microsoft", priority: "Boa para SOC" },
      { name: "Microsoft AZ-900", focus: "Fundamentos de Azure", priority: "Complementar" },
    ],
  },
  {
    title: "DevSecOps e AppSec",
    goal: "Combinar desenvolvimento, automação e segurança.",
    icon: LockKeyhole,
    items: [
      { name: "GitHub Foundations", focus: "GitHub, repositórios, colaboração e base para Actions", priority: "Rápida" },
      { name: "Docker Certified Associate", focus: "Containers, imagens, redes e volumes", priority: "Opcional" },
      { name: "Practical DevSecOps", focus: "Pipelines, SAST, DAST, secrets e automação", priority: "Depois da base" },
    ],
  },
  {
    title: "Avançado",
    goal: "Evoluir depois da primeira vaga.",
    icon: Star,
    items: [
      { name: "Blue Team Level 1 (BTL1)", focus: "Investigação, logs, incidentes e análise prática", priority: "Excelente" },
      { name: "CySA+", focus: "Análise defensiva, threat hunting e resposta", priority: "Pós-Security+" },
      { name: "AWS Security Specialty", focus: "Segurança avançada em AWS", priority: "Mais adiante" },
    ],
  },
];

const suggestedOrder = ["Google Cybersecurity Certificate", "Cisco CyberOps Associate", "AWS Cloud Practitioner", "Security+", "SC-900 ou AZ-900", "BTL1"];

export default function Certificacoes() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent">Jornada profissional</p>
          <h2 className="mt-2 text-3xl font-semibold">Certificações</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Uma trilha do básico ao avançado para Cybersecurity Jr, SOC Analyst Jr, Blue Team Jr, Cloud Security Jr e DevSecOps Jr.
          </p>
        </div>
        <Badge>6 a 9 meses</Badge>
      </section>

      <Card>
        <div className="flex items-center gap-2">
          <Award className="text-accent" size={18} />
          <h3 className="font-semibold">Ordem recomendada</h3>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {suggestedOrder.map((item, index) => (
            <div key={item} className="rounded-md border border-white/10 bg-black/25 p-3">
              <p className="text-xs text-zinc-500">#{index + 1}</p>
              <p className="mt-1 text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {levels.map((level) => (
          <Card key={level.title}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-black">
                <level.icon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{level.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{level.goal}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {level.items.map((item) => (
                <div key={item.name} className="rounded-md border border-white/10 bg-black/20 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BadgeCheck size={16} className="text-accent" />
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <Badge>{item.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{item.focus}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
