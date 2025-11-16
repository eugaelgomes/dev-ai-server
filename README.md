# Dev AI Server

Gateway de IA para consultas com múltiplos provedores (Perplexity e Gemini), suporte multilíngue e gerenciamento de sessões para manter contexto.

## 🔗 Links Rápidos

- Documentação e testes (Apidog): [https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35](https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35)
- Endpoint público (POST):[ https://dev-ai.codaweb.com.br/content/search](https://dev-ai.codaweb.com.br/content/search)

## 🚀 Principais Recursos

- Múltiplos provedores: Perplexity AI e Google Gemini
- Especialização por assunto: código, programação e dados
- Guard rails bilíngues (PT/EN) para segurança e relevância
- Sessões com contexto de conversa
- Suporte a Português e Inglês

## 📋 Pré‑requisitos

- Node.js 18+
- PostgreSQL
- Chaves de API:
  - Perplexity AI API Key
  - Google Gemini API Key

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/eugaelgomes/ai-mcp.git
cd ai-server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas credenciais e porta desejada:

```env
DATABASE_NAME=
DATABASE_HOST_URL=
DATABASE_SERVICE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=

PERPLEXITY_API_KEY=sua_chave_perplexity
GEMINI_API_KEY=sua_chave_gemini

PORT=8080
NODE_ENV=development
```

## 🏃 Execução

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

## 📡 API

- Local: `POST http://localhost:8080/search`
- Produção: `POST https://dev-ai.codaweb.com.br/content/search`

### Requisição

Body (JSON):

```json
{
  "message": "Como fazer um loop em JavaScript?",
  "subject": "programacao",
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "sessionId": "session_123"
}
```

Parâmetros:

| Campo         | Tipo   | Obrigatório | Descrição                                                     |
| ------------- | ------ | ------------ | --------------------------------------------------------------- |
| `message`   | string | Sim          | Mensagem/pergunta do usuário                                   |
| `subject`   | string | Sim          | Assunto:`codigo`, `programacao` ou `dados`                |
| `provider`  | string | Não         | Provedor:`perplexity` ou `gemini` (padrão: `perplexity`) |
| `model`     | string | Não         | Modelo do provedor                                              |
| `sessionId` | string | Não         | ID de sessão para manter contexto                              |

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

## 🛡️ Guard Rails

Validações inteligentes bilíngues (PT/EN):

- Validação de relevância do tópico
- Detecção de termos fora do escopo
- Limite de tamanho de mensagens
- Proteção contra padrões suspeitos
- Suporte a termos técnicos em PT/EN

## 🔄 Assuntos

- `codigo`: desenvolvimento de software, Git, CI/CD, Docker, arquitetura, testes
- `programacao`: linguagens, algoritmos, estruturas de dados, frameworks
- `dados`: ciência de dados, análise, ML, bancos de dados, BI

## 📝 Exemplos

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
curl -X POST http://localhost:8080/search \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explique recursão em Python",
    "subject": "programacao",
    "provider": "gemini"
  }'
```

## 🤝 Contribuição

Contribuições são bem-vindas. Abra uma issue ou pull request.

## 📄 Licença

ISC © Gael Gomes

## 🔗 Links

- Repositório: [https://github.com/eugaelgomes/ai-mcp](https://github.com/eugaelgomes/ai-mcp)
- Issues: [https://github.com/eugaelgomes/ai-mcp/issues](https://github.com/eugaelgomes/ai-mcp/issues)
- Documentação/Testes (Apidog): [https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35](https://share.apidog.com/fcc159fb-ffe2-4fac-9f93-983263024c35)
- API pública: [https://dev-ai.codaweb.com.br/content/search](https://dev-ai.codaweb.com.br/content/search)
