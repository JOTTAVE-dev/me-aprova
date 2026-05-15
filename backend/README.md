# AGENTE FCC TI Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000/docs

O SQLite fica em `%LOCALAPPDATA%\AGENTE_FCC_TI\agente_fcc_ti.db` por padrão no Windows, evitando erros de I/O comuns em pastas sincronizadas pelo OneDrive. Para trocar:

```bash
set DATABASE_URL=sqlite:///C:/caminho/agente_fcc_ti.db
```
