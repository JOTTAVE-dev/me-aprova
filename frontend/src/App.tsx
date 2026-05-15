import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Conteudos from "./pages/Conteudos";
import Dashboard from "./pages/Dashboard";
import EstudoHoje from "./pages/EstudoHoje";
import Flashcards from "./pages/Flashcards";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Placeholder from "./pages/Placeholder";
import Login from "./pages/Login";

export default function App() {
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
        <Route path="/relatorios" element={<Placeholder title="Relatórios" />} />
        <Route path="/pontos-fracos" element={<Placeholder title="Pontos Fracos" />} />
        <Route path="/configuracoes" element={<Placeholder title="Configurações" />} />
      </Route>
    </Routes>
  );
}
