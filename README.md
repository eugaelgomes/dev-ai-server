# Dev AI Server - DevAI

**API Gateway** de **IA** para consultas com **Perplexity AI** e **Google Gemini**, construído com **Node.js** e **Express.js**. A **API** tem foco em **guard rails** (validação de conteúdo) para garantir mantenimento nos temas sobre **tecnologia**, **desenvolvimento de software**, **programação** e **ciência de dados**. Implementa **sessões com contexto** e utiliza **PostgreSQL** para persistência.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white) ![Perplexity](https://img.shields.io/badge/perplexity-000000?style=for-the-badge&logo=perplexity&logoColor=088F8F) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Links Rápidos

- API em produção (Apidog): [https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35](https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35)
- Endpoint público (POST):[ https://dev-ai.codaweb.com.br/content/search](https://dev-ai.codaweb.com.br/content/search)

## Principais Recursos

- Provedores: Perplexity AI e Google Gemini;
- Especialização por assunto: código, programação e dados, ou todos;
- Guard rails bilíngues (PT/EN) para segurança e relevância;
- Sessões com contexto de conversa;

## Pré‑requisitos

- Node.js 18+
- PostgreSQL
- Chaves de API:
  - Perplexity AI API Key
  - Google Gemini API Key

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/eugaelgomes/dev-ai-server.git
cd ai-server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

## Configuração

Edite o arquivo `.env` com suas credenciais e porta desejada:

```env
DATABASE_NAME=detabase_name
DATABASE_HOST_URL=debase_host
DATABASE_SERVICE_PORT=detabase_port
DATABASE_USERNAME=detabase_usaername
DATABASE_PASSWORD=detabase_password

PERPLEXITY_API_KEY=sua_chave_perplexity
GEMINI_API_KEY=sua_chave_gemini

PORT=8080
NODE_ENV=development
```

## Execução

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

## API

- Local: `POST http://localhost:8080/search`
- Produção(my domain, in this case): `POST https://dev-ai.codaweb.com.br/content/search`

### Requisição

Body (JSON):

```json
{
  "message": "Como fazer um loop em JavaScript?",
  "subject": "programacao",
  "provider": "gemini",
  "model": "gemini-2.0-flash",
  "sessionId": "session_123"
}
```

Parâmetros:

| Campo       | Tipo   | Obrigatório | Descrição                                                  |
| ----------- | ------ | ----------- | ---------------------------------------------------------- |
| `message`   | string | Sim         | Mensagem/pergunta do usuário                               |
| `subject`   | string | Sim         | Assunto:`codigo`, `programacao` , `dados` ou todos juntos. |
| `provider`  | string | Não         | Provedor:`perplexity` ou `gemini`.                         |
| `model`     | string | Não         | Modelo do provedor                                         |
| `sessionId` | string | Não         | ID de sessão para manter contexto (não precisa no 1° req)  |

Modelos suportados:

Perplexity

- `sonar` (padrão)
- `sonar-pro`
- `sonar-reasoning`
- `sonar-reasoning-pro`
- `sonar-deep-research`

Gemini

- `gemini-2.0-flash` - (somente esse funciona)

Exemplo de resposta:

```json
{
  "sessionId": "session_123",
  "subject": "programacao",
  "provider": "gemini",
  "message": "Como fazer um loop em JavaScript?",
  "model": "gemini-2.0-flash",
  "content": "Para fazer um loop em JavaScript...",
  "citations": [],
  "messageCount": 2
}
```

### Sessões e Saúde

- `GET /session/:sessionId` — detalhes da sessão
- `GET /sessions` — lista sessões ativas
- `DELETE /session/:sessionId` — remove uma sessão
- `DELETE /sessions` — limpa todas as sessões
- `GET /health` — status do servidor

## Guard Rails

- Validação de relevância do tópico
- Detecção de termos fora do escopo
- Limite de tamanho de mensagens
- Proteção contra padrões suspeitos

## Assuntos

- `codigo` & `devops`: desenvolvimento de software, Git, CI/CD, Docker, arquitetura, testes
- `programacao`: linguagens, algoritmos, estruturas de dados, frameworks
- `dados`: ciência de dados, análise, ML, bancos de dados, BI

## Exemplos

Produção (Apidog recomendado para testar):

```bash
curl -X POST https://dev-ai.codaweb.com.br/content/search \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is a REST API?",
    "subject": "codigo",
    "provider": "perplexity",
    "model": "sonar-pro"
  }'
```

Local

```bash
curl -X POST http://localhost:8080/content/search \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explique recursão em Python",
    "subject": "programacao",
    "provider": "gemini",
    "model": "gemini-2.0-flash"
  }'
```

## Links

- Repositório: [https://github.com/eugaelgomes/dev-ai-server](<[https://github.com/eugaelgomes/](https://github.com/eugaelgomes/dev-ai-server)dev-ai-server>)
- Issues: [https://github.com/eugaelgomes/dev-ai-server/issues](https://github.com/eugaelgomes/dev-ai-server/issues)
- Documentação/Testes (Apidog): [https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35](https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35)
- API pública: [https://dev-ai.codaweb.com.br/content/search](https://dev-ai.codaweb.com.br/content/search)
