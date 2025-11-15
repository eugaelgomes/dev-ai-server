# AI Server

Servidor de API para consultas de IA com suporte para múltiplos provedores (Perplexity e Gemini) e especialização por assunto.

## 🚀 Funcionalidades

- **Múltiplos Provedores**: Escolha entre Perplexity AI e Google Gemini
- **Especialização por Assunto**: Código, Programação ou Dados
- **Guard Rails**: Validação inteligente de mensagens em PT/EN
- **Gerenciamento de Sessões**: Mantenha o contexto da conversa
- **Multilíngue**: Suporte para Português e Inglês

## 📋 Pré-requisitos

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

Edite o arquivo `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_server
PERPLEXITY_API_KEY=sua_chave_perplexity
GEMINI_API_KEY=sua_chave_gemini
PORT=3000
NODE_ENV=development
```

## 🏃 Executando

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 API Endpoints

### POST /search

Realiza uma consulta de IA.

**Body:**
```json
{
  "message": "Como fazer um loop em JavaScript?",
  "subject": "programacao",
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "sessionId": "session_123" // opcional
}
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `message` | string | Sim | Mensagem/pergunta do usuário |
| `subject` | string | Sim | Assunto: `codigo`, `programacao`, ou `dados` |
| `provider` | string | Não | Provedor: `perplexity` ou `gemini` (padrão: `perplexity`) |
| `model` | string | Não | Modelo específico do provedor |
| `sessionId` | string | Não | ID da sessão para manter contexto |

**Modelos Disponíveis:**

**Perplexity:**
- `sonar` (padrão)
- `sonar-pro`
- `sonar-reasoning`
- `sonar-reasoning-pro`
- `sonar-deep-research`

**Gemini:**
- `gemini-2.0-flash-exp` (padrão)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

**Resposta:**
```json
{
  "sessionId": "session_123",
  "subject": "programacao",
  "provider": "gemini",
  "message": "Como fazer um loop em JavaScript?",
  "model": "gemini-2.0-flash-exp",
  "content": "Para fazer um loop em JavaScript...",
  "citations": [],
  "messageCount": 2
}
```

### GET /session/:sessionId

Obtém informações sobre uma sessão específica.

### GET /sessions

Lista todas as sessões ativas.

### DELETE /session/:sessionId

Deleta uma sessão específica.

### DELETE /sessions

Limpa todas as sessões.

### GET /health

Verifica o status do servidor.

## 🛡️ Guard Rails

O sistema possui validações inteligentes bilíngues (PT/EN) que:

- ✅ Validam relevância do tópico
- ✅ Detectam palavras fora do escopo
- ✅ Limitam tamanho de mensagens
- ✅ Protegem contra padrões suspeitos
- ✅ Suportam termos técnicos em português e inglês

## 🔄 Assuntos Disponíveis

### `codigo`
Desenvolvimento de software, Git, CI/CD, Docker, arquitetura, testes.

### `programacao`
Linguagens de programação, algoritmos, estruturas de dados, frameworks.

### `dados`
Ciência de dados, análise, machine learning, bancos de dados, BI.

## 📝 Exemplos de Uso

### Usando Perplexity
```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is a REST API?",
    "subject": "codigo",
    "provider": "perplexity",
    "model": "sonar-pro"
  }'
```

### Usando Gemini
```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explique recursão em Python",
    "subject": "programacao",
    "provider": "gemini"
  }'
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📄 Licença

ISC © Gael Gomes

## 🔗 Links

- [Repositório](https://github.com/eugaelgomes/ai-mcp)
- [Issues](https://github.com/eugaelgomes/ai-mcp/issues)
