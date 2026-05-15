# AGENTE FCC TI

MVP de planner inteligente para estudos de concursos FCC, com React, FastAPI e banco relacional.

## Rodar localmente

Backend:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev -- --port 5173
```

URLs:

- App: http://127.0.0.1:5173
- API: http://127.0.0.1:8000/docs

## Supabase

Em produção, configure a variável:

```text
DATABASE_URL=postgresql://...
```

Use a connection string do Supabase com `sslmode=require`.

Na Vercel, adicione essa variável em Project Settings > Environment Variables e faça um redeploy.
