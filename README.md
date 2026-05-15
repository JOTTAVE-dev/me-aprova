# Me Aprova

MVP de planner inteligente com módulos para TJ/Concurso e Jornada de Cibersegurança, feito para rodar na Vercel usando Supabase desde o inicio.

## Stack atual

- React + TypeScript + Vite
- TailwindCSS
- React Router
- Sonner
- Supabase Postgres/Auth-ready client
- Vercel static hosting

O projeto agora e frontend-first: a Vercel publica o React/Vite e o Supabase guarda os dados.

## Configurar Supabase

1. Abra o Supabase.
2. Va em SQL Editor.
3. Cole e execute o arquivo:

```text
supabase/schema.sql
```

Esse script cria as tabelas, indices e politicas RLS publicas para o MVP.

Se voce ja rodou uma versao antiga do SQL, rode o arquivo novamente. Ele adiciona a coluna `module`, usada para separar o progresso do TJ e da Ciberseguranca.

## Variaveis na Vercel

Em Vercel > Project > Settings > Environment Variables, cadastre:

```text
VITE_SUPABASE_URL=https://mjufredlcvkeilpnodck.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_public_aqui
```

A chave anon fica no Supabase em Project Settings > API.

## Rodar localmente

Crie `frontend/.env.local`:

```text
VITE_SUPABASE_URL=https://mjufredlcvkeilpnodck.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_public_aqui
```

Depois rode:

```powershell
cd frontend
npm install
npm run dev -- --port 5173
```

App local:

```text
http://127.0.0.1:5173
```

## Deploy

O `vercel.json` ja aponta para:

- build: `cd frontend && npm install && npm run build`
- output: `frontend/dist`
- SPA rewrite para `index.html`

Depois de salvar as variaveis de ambiente, faca redeploy na Vercel.
