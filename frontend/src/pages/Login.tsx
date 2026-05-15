import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Card, Input } from "../components/ui";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.28em] text-accent">acesso local</p>
        <h1 className="mt-3 text-3xl font-semibold">Me Aprova no TJ</h1>
        <div className="mt-6 space-y-3">
          <Input defaultValue="candidato@local" aria-label="Email" />
          <Input defaultValue="local" type="password" aria-label="Senha" />
          <Button className="w-full" type="button">
            <Link to="/" className="flex w-full items-center justify-center gap-2">
              <LogIn size={16} /> Entrar
            </Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
