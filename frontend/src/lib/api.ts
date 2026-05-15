import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

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
