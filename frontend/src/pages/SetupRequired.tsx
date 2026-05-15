import { AlertTriangle, Database, KeyRound, RotateCw } from "lucide-react";

import { Button, Card } from "../components/ui";

type SetupRequiredProps = {
  kind: "env" | "schema" | "checking";
  detail?: string;
};

export default function SetupRequired({ kind, detail }: SetupRequiredProps) {
  const isChecking = kind === "checking";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-black">
            {isChecking ? <RotateCw size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent">Me Aprova</p>
            <h1 className="mt-2 text-2xl font-semibold">
              {isChecking ? "Verificando Supabase" : "Configuração necessária"}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {kind === "env"
                ? "O app carregou, mas a Vercel ainda não recebeu as variáveis públicas do Supabase."
                : kind === "schema"
                  ? "O app conectou no Supabase, mas as tabelas ainda não estão prontas."
                  : "Conferindo se as variáveis e tabelas já estão disponíveis."}
            </p>
          </div>
        </div>

        {!isChecking ? (
          <div className="mt-6 space-y-4">
            {kind === "env" ? (
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 font-medium">
                  <KeyRound size={18} className="text-accent" />
                  Variáveis na Vercel
                </div>
                <pre className="mt-3 overflow-x-auto rounded-md bg-black/40 p-3 text-xs text-zinc-300">
{`VITE_SUPABASE_URL=https://mjufredlcvkeilpnodck.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_public`}
                </pre>
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex items-center gap-2 font-medium">
                  <Database size={18} className="text-accent" />
                  Schema no Supabase
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Abra o Supabase, entre em SQL Editor, cole o conteúdo de <strong>supabase/schema.sql</strong> e execute.
                </p>
              </div>
            )}

            {detail ? <p className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-red-200">{detail}</p> : null}

            <Button onClick={() => window.location.reload()}>Recarregar</Button>
          </div>
        ) : null}
      </Card>
    </main>
  );
}
