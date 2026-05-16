import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./components/Layout";
import Conteudos from "./pages/Conteudos";
import Dashboard from "./pages/Dashboard";
import EstudoHoje from "./pages/EstudoHoje";
import Flashcards from "./pages/Flashcards";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Placeholder from "./pages/Placeholder";
import Login from "./pages/Login";
import SetupRequired from "./pages/SetupRequired";
import Certificacoes from "./pages/Certificacoes";
import Progresso from "./pages/Progresso";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { getCurrentModule } from "./lib/modules";

const SETUP_CHECK_TIMEOUT_MS = 3500;

export default function App() {
  const selectedModule = getCurrentModule();
  const [setup, setSetup] = useState<"checking" | "ready" | "env" | "schema">("checking");
  const [detail, setDetail] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseConfigured || !supabase) {
      setSetup("env");
      return () => {
        cancelled = true;
      };
    }

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      setSetup("ready");
    }, SETUP_CHECK_TIMEOUT_MS);

    supabase
      .from("topics")
      .select("id,module", { count: "exact", head: true })
      .then(({ error }) => {
        if (cancelled) return;
        window.clearTimeout(timeout);
        if (error) {
          setDetail(error.message);
          setSetup("schema");
          return;
        }
        setSetup("ready");
      }, (error: unknown) => {
        if (cancelled) return;
        window.clearTimeout(timeout);
        setDetail(error instanceof Error ? error.message : "Não foi possível verificar o Supabase agora.");
        setSetup("ready");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!selectedModule) return <Login />;
  if (setup === "checking") return <SetupRequired kind="checking" />;
  if (setup === "env") return <SetupRequired kind="env" />;
  if (setup === "schema") return <SetupRequired kind="schema" detail={detail} />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/hoje" element={<EstudoHoje />} />
        <Route path="/conteudos" element={<Conteudos />} />
        <Route path="/questoes" element={<Questoes />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/simulados" element={<Simulados />} />
        <Route path="/relatorios" element={<Progresso />} />
        <Route path="/pontos-fracos" element={<Placeholder title="Pontos Fracos" />} />
        <Route path="/certificacoes" element={<Certificacoes />} />
        <Route path="/configuracoes" element={<Placeholder title="Configurações" />} />
      </Route>
    </Routes>
  );
}
