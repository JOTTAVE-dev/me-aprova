export type StudyModule = "tj" | "cyber";

export const modules: Record<StudyModule, {
  id: StudyModule;
  name: string;
  shortName: string;
  subtitle: string;
  target: string;
  questionLabel: string;
  defaultBank: string;
  examDate?: string;
}> = {
  tj: {
    id: "tj",
    name: "Me Aprova no TJ",
    shortName: "TJ",
    subtitle: "Concurso • Analista TI",
    target: "TJ • Analista de TI",
    questionLabel: "Questões FCC",
    defaultBank: "FCC",
    examDate: "2026-08-09",
  },
  cyber: {
    id: "cyber",
    name: "Jornada Cibersegurança",
    shortName: "Cyber",
    subtitle: "SOC • Blue Team • Cloud Security",
    target: "Cybersecurity Jr • SOC Analyst Jr",
    questionLabel: "Práticas e laboratórios",
    defaultBank: "LAB",
  },
};

const storageKey = "me_aprova_active_module";

export function getCurrentModule(): StudyModule | null {
  const value = window.localStorage.getItem(storageKey);
  return value === "tj" || value === "cyber" ? value : null;
}

export function setCurrentModule(module: StudyModule) {
  window.localStorage.setItem(storageKey, module);
}

export function currentModuleConfig() {
  return modules[getCurrentModule() ?? "tj"];
}
