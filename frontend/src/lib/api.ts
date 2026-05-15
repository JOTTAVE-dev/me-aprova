import { getSupabase } from "./supabase";
import { seedTopics } from "./seedData";

export type Topic = {
  id: number;
  name: string;
  category: string;
  priority: number;
  weight: number;
  status: string;
  accuracy: number;
  questions_done: number;
  errors: number;
  last_studied_at: string | null;
  next_review_at: string | null;
};

export type Flashcard = {
  id: number;
  question: string;
  answer: string;
  difficulty: number;
  topic_id: number;
  next_review_at: string;
  review_stage: number;
  topic?: Topic;
};

export type Dashboard = {
  days_remaining: number;
  total_topics: number;
  progress: number;
  average_accuracy: number;
  total_questions: number;
  overdue_reviews: number;
  strong_topics: Topic[];
  weak_topics: Topic[];
  next_simulation: string;
};

export type TodayStudy = {
  date: string;
  is_sunday: boolean;
  days_remaining: number;
  main_topic: Topic | null;
  secondary_topic: Topic | null;
  review_topic: Topic | null;
  questions_target: number;
  flashcards_due: Flashcard[];
  checklist: string[];
};

export type QuestionLog = {
  id: number;
  bank: string;
  topic_id: number;
  quantity: number;
  correct: number;
  wrong: number;
  logged_at: string;
};

export type Simulation = {
  id: number;
  simulation_date: string;
  total_questions: number;
  correct: number;
  score: number;
  notes: string;
};

type ApiResponse<T> = Promise<{ data: T }>;

const examDate = new Date("2026-08-09T00:00:00");

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysRemaining() {
  const now = new Date();
  return Math.max(Math.ceil((examDate.getTime() - now.getTime()) / 86_400_000), 0);
}

function nextSunday() {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return date.toISOString().slice(0, 10);
}

async function ensureSeeded() {
  const supabase = getSupabase();
  const { count, error } = await supabase.from("topics").select("*", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;

  const { data: topics, error: insertError } = await supabase.from("topics").insert(seedTopics()).select("id,name,priority");
  if (insertError) throw insertError;

  const cards = (topics ?? []).slice(0, 24).map((topic) => ({
    question: `O que a FCC costuma cobrar em ${topic.name}?`,
    answer: `Revise conceito, aplicação prática, diferenças e pegadinhas recorrentes sobre ${topic.name}.`,
    difficulty: Math.max(2, 6 - Number(topic.priority)),
    topic_id: topic.id,
    next_review_at: addDays(1),
  }));
  if (cards.length) {
    const { error: cardError } = await supabase.from("flashcards").insert(cards);
    if (cardError) throw cardError;
  }
}

async function listTopics(category?: string) {
  const supabase = getSupabase();
  await ensureSeeded();
  let query = supabase.from("topics").select("*").order("category").order("priority", { ascending: false }).order("name");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as Topic[];
}

async function getDashboard(): ApiResponse<Dashboard> {
  const supabase = getSupabase();
  const topics = await listTopics();
  const { data: logs, error } = await supabase.from("question_logs").select("*");
  if (error) throw error;

  const studied = topics.filter((topic) => topic.questions_done > 0);
  const avg = studied.length ? studied.reduce((sum, topic) => sum + Number(topic.accuracy || 0), 0) / studied.length : 0;
  const totalQuestions = (logs ?? []).reduce((sum, log) => sum + Number(log.quantity || 0), 0);
  const today = todayIso();

  return {
    data: {
      days_remaining: daysRemaining(),
      total_topics: topics.length,
      progress: topics.length ? Number(((studied.length / topics.length) * 100).toFixed(1)) : 0,
      average_accuracy: Number(avg.toFixed(1)),
      total_questions: totalQuestions,
      overdue_reviews: topics.filter((topic) => topic.next_review_at && topic.next_review_at <= today).length,
      strong_topics: studied.filter((topic) => Number(topic.accuracy) >= 80).sort((a, b) => b.accuracy - a.accuracy).slice(0, 5),
      weak_topics: topics.filter((topic) => Number(topic.accuracy) < 70 || topic.errors > 0).sort((a, b) => b.priority - a.priority || b.errors - a.errors).slice(0, 5),
      next_simulation: nextSunday(),
    },
  };
}

async function getTodayStudy(): ApiResponse<TodayStudy> {
  const supabase = getSupabase();
  const topics = await listTopics();
  const today = todayIso();
  const { data: cards, error } = await supabase
    .from("flashcards")
    .select("*, topic:topics(*)")
    .lte("next_review_at", today)
    .order("next_review_at")
    .limit(10);
  if (error) throw error;

  const reviewTopic = topics
    .filter((topic) => topic.next_review_at && topic.next_review_at <= today)
    .sort((a, b) => b.priority - a.priority || String(a.next_review_at).localeCompare(String(b.next_review_at)))[0] ?? null;
  const mainTopic = [...topics]
    .filter((topic) => Number(topic.accuracy) < 75 || topic.questions_done === 0)
    .sort((a, b) => b.priority - a.priority || a.accuracy - b.accuracy || a.questions_done - b.questions_done)[0] ?? null;
  const secondaryTopic = topics.filter((topic) => topic.id !== mainTopic?.id).sort((a, b) => b.priority - a.priority || a.questions_done - b.questions_done)[0] ?? null;
  const isSunday = new Date().getDay() === 0;
  const target = isSunday ? 70 : 25 + (mainTopic && mainTopic.priority >= 5 ? 10 : 0) + (mainTopic && mainTopic.accuracy < 60 ? 10 : 0);

  return {
    data: {
      date: today,
      is_sunday: isSunday,
      days_remaining: daysRemaining(),
      main_topic: mainTopic,
      secondary_topic: secondaryTopic,
      review_topic: reviewTopic,
      questions_target: target,
      flashcards_due: (cards ?? []) as Flashcard[],
      checklist: isSunday
        ? ["Gerar simulado FCC com temas de maior prioridade", "Corrigir questões e registrar percentual por tema", "Transformar erros em flashcards", "Replanejar pontos fracos da semana"]
        : ["Bloco 1: 60 min de teoria principal", "Bloco 2: 60 min de revisão ou teoria secundária", "Bloco 3: questões FCC e revisão de erros", "Registrar desempenho ao terminar"],
    },
  };
}

async function listFlashcards(dueOnly = false): ApiResponse<Flashcard[]> {
  const supabase = getSupabase();
  await ensureSeeded();
  let query = supabase.from("flashcards").select("*, topic:topics(*)").order("next_review_at");
  if (dueOnly) query = query.lte("next_review_at", todayIso());
  const { data, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as Flashcard[] };
}

async function createQuestionLog(payload: Partial<QuestionLog> & { topic_id: number; quantity: number; correct: number; bank?: string }) {
  const supabase = getSupabase();
  const wrong = Math.max(payload.quantity - payload.correct, 0);
  const { data: topic, error: topicError } = await supabase.from("topics").select("*").eq("id", payload.topic_id).single();
  if (topicError) throw topicError;

  const { data, error } = await supabase
    .from("question_logs")
    .insert({ bank: payload.bank ?? "FCC", topic_id: payload.topic_id, quantity: payload.quantity, correct: payload.correct, wrong })
    .select()
    .single();
  if (error) throw error;

  const previousQuestions = Number(topic.questions_done || 0);
  const previousCorrect = (Number(topic.accuracy || 0) / 100) * previousQuestions;
  const questionsDone = previousQuestions + payload.quantity;
  const accuracy = Number((((previousCorrect + payload.correct) / questionsDone) * 100).toFixed(1));
  const { error: updateError } = await supabase
    .from("topics")
    .update({
      questions_done: questionsDone,
      errors: Number(topic.errors || 0) + wrong,
      accuracy,
      last_studied_at: todayIso(),
      next_review_at: addDays(accuracy < 70 ? 1 : 7),
    })
    .eq("id", payload.topic_id);
  if (updateError) throw updateError;
  return { data: data as QuestionLog };
}

function route(path: string) {
  return path.split("?")[0].replace(/^\/+/, "");
}

export const api = {
  async get<T>(path: string): ApiResponse<T> {
    const clean = route(path);
    if (clean === "dashboard") return getDashboard() as ApiResponse<T>;
    if (clean === "study/today") return getTodayStudy() as ApiResponse<T>;
    if (clean === "topics") return { data: (await listTopics()) as T };
    if (clean === "flashcards") return (await listFlashcards(path.includes("due_only=true"))) as { data: T };
    if (clean === "questions") {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("question_logs").select("*").order("logged_at", { ascending: false }).order("id", { ascending: false });
      if (error) throw error;
      return { data: data as T };
    }
    if (clean === "simulations") {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("simulations").select("*").order("simulation_date", { ascending: false });
      if (error) throw error;
      return { data: data as T };
    }
    throw new Error(`Rota não implementada: ${path}`);
  },

  async post<T>(path: string, payload?: unknown): ApiResponse<T> {
    const clean = route(path);
    if (clean === "topics") {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("topics").insert(payload as Record<string, unknown>).select().single();
      if (error) throw error;
      return { data: data as T };
    }
    if (clean === "flashcards") {
      const supabase = getSupabase();
      const { data, error } = await supabase.from("flashcards").insert({ ...(payload as object), next_review_at: addDays(1) }).select("*, topic:topics(*)").single();
      if (error) throw error;
      return { data: data as T };
    }
    if (clean.startsWith("flashcards/") && clean.endsWith("/review")) {
      const supabase = getSupabase();
      const id = Number(clean.split("/")[1]);
      const remembered = path.includes("remembered=true");
      const { data: card, error: cardError } = await supabase.from("flashcards").select("*").eq("id", id).single();
      if (cardError) throw cardError;
      const stage = remembered ? Math.min(Number(card.review_stage || 0) + 1, 2) : 0;
      const intervals = [1, 7, 30];
      const { data, error } = await supabase
        .from("flashcards")
        .update({ review_stage: stage, next_review_at: addDays(intervals[stage]) })
        .eq("id", id)
        .select("*, topic:topics(*)")
        .single();
      if (error) throw error;
      return { data: data as T };
    }
    if (clean === "questions") return createQuestionLog(payload as Parameters<typeof createQuestionLog>[0]) as ApiResponse<T>;
    if (clean === "simulations") {
      const supabase = getSupabase();
      const item = payload as { total_questions: number; correct: number; notes?: string };
      const score = Number(((item.correct / item.total_questions) * 100).toFixed(1));
      const { data, error } = await supabase.from("simulations").insert({ ...item, score }).select().single();
      if (error) throw error;
      return { data: data as T };
    }
    throw new Error(`Rota não implementada: ${path}`);
  },

  async delete(path: string): Promise<{ data: { ok: boolean } }> {
    const supabase = getSupabase();
    const clean = route(path);
    const [resource, id] = clean.split("/");
    const table = resource === "topics" ? "topics" : resource === "flashcards" ? "flashcards" : null;
    if (!table || !id) throw new Error(`Rota não implementada: ${path}`);
    const { error } = await supabase.from(table).delete().eq("id", Number(id));
    if (error) throw error;
    return { data: { ok: true } };
  },
};
