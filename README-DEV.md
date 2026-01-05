# Desenvolvimento Local

## Configuração

1. **Crie um arquivo `.env` na raiz do projeto** com:
```
MONGODB_URI=mongodb+srv://Vercel-Admin-bingo-free:F7eQa988wNMOHiv3@bingo-free.i6nmpby.mongodb.net/?retryWrites=true&w=majority
PORT=3001
```

2. **Para rodar o projeto completo** (API + Frontend):
```bash
npm run dev:all
```

Isso vai iniciar:
- Servidor API na porta 3001
- Vite dev server na porta 5173 (com proxy para /api)

3. **Ou rode separadamente**:

Terminal 1 (API):
```bash
npm run dev:api
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Estrutura

- **Frontend**: Vite + Vue 3 rodando em `http://localhost:5173`
- **API**: Express server rodando em `http://localhost:3001`
- **Proxy**: Vite faz proxy de `/api/*` para `http://localhost:3001/api/*`

## Produção

No Vercel, as APIs em `/api/` são automaticamente detectadas como serverless functions e não precisam do servidor Express.

