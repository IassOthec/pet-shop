# PTAS 05.11

Exercícios de integração entre React, API Express com CORS e MongoDB Atlas.

## Estrutura

```text
ptas.05.11/
├── backend/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── .env.example
│   ├── index.html
│   ├── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

## 1. Instalar dependências

```bash
npm run install:all
```

## 2. Configurar o MongoDB Atlas

1. Crie um cluster Free no MongoDB Atlas.
2. Em **Database Access**, crie um usuário com senha.
3. Em **Network Access**, libere seu IP (ou `0.0.0.0/0` apenas durante o desenvolvimento).
4. Copie a connection string em **Connect > Drivers**.
5. Crie o arquivo `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

6. Preencha o `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ptas3
```

O arquivo `.env` está no `.gitignore`. A connection string fica somente nele, nunca no código.

O `backend/data/db.js` executa `db.command({ ping: 1 })` logo após conectar. Se a API subir sem erros, a conexão foi validada.

## 3. Rodar a API

```bash
npm run dev:backend
```

API: `http://localhost:3000`
Endpoint: `http://localhost:3000/users`

## 4. Rodar o frontend

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`

O `backend/server.js` usa `app.use(cors())`, liberando globalmente o acesso a partir do Vite em `localhost:5173`.

## Exercícios

### Exercício 1 — CORS
`cors` instalado no backend e habilitado globalmente com `app.use(cors())`.

### Exercício 2 — UsersList
O componente `frontend/components/UsersList.jsx` trata os três estados:
- carregando: `Carregando usuários...`
- erro: `Falha ao carregar usuários`
- sucesso: lista com `key={user.id}`

Com a API parada, a mensagem de erro aparece e a tela não fica branca.

### Exercício 3 — Formulário POST
O componente `frontend/components/UserForm.jsx` envia `POST /users` com `fetch`.
Depois do `201`, o `App` chama `loadUsers()` novamente, atualizando a lista sem recarregar a página.
O DevTools mostra a requisição `OPTIONS` (preflight) seguida do `POST`.

### Exercício 4 — Atlas
A conexão é feita em `backend/data/db.js` usando `process.env.MONGODB_URI`.
A API executa um `ping` no banco `ptas3` durante a inicialização.

### Exercício 5 — Migração do model
`backend/models/users.model.js` usa o driver oficial do MongoDB:
- `listar()`: `find().sort().toArray()`
- `criar()`: `insertOne()`
- bônus `atualizar()`: `findOneAndUpdate()`
- bônus `remover()`: `deleteOne()`

O controller não conhece o MongoDB: ele continua chamando o service/model.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/users` | Lista usuários |
| GET | `/users/:id` | Busca usuário por id |
| POST | `/users` | Cria usuário |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Marjorie Santos","email":"marjorie@email.com"}'
```

## Critérios de sucesso

- O console do frontend em `localhost:5173` não acusa CORS.
- A lista carrega os usuários vindos da API.
- Com a API parada aparece `Falha ao carregar usuários`.
- O DevTools mostra `OPTIONS` + `POST 201`.
- O novo nome aparece na lista sem recarregar a página.
- Ao reiniciar a API, os usuários continuam no Atlas.
- O documento aparece em **Browse Collections** no banco `ptas3`, coleção `users`.
