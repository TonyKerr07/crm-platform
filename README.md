# CRM Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Sistema de CRM completo com dashboard inteligente, funil de vendas e insights via IA.**

[Funcionalidades](#-funcionalidades) • [Arquitetura](#-arquitetura) • [Como rodar](#-como-rodar) • [API Docs](#-api-docs) • [Deploy](#-deploy)

</div>

---

## 📋 Sobre o Projeto

O **CRM Platform** é um sistema de gestão de relacionamento com clientes desenvolvido com stack moderna e padrões de nível sênior. Permite gerenciar clientes, leads em funil de vendas e tarefas, com um dashboard inteligente que usa IA para gerar insights automáticos sobre o negócio.

### Contexto e Motivação

Projeto desenvolvido para demonstrar domínio de arquitetura em camadas, integração entre frontend e backend desacoplados, versionamento de banco de dados, containerização e integração com APIs de IA — tecnologias exigidas em posições sênior no mercado atual.

---

## ✨ Funcionalidades

### Dashboard Inteligente
- Métricas em tempo real: clientes ativos, leads no funil, tarefas abertas e em atraso
- Gráfico de rosca com distribuição do funil de vendas por status
- **Cards de IA** gerados automaticamente com análise do negócio:
  - Taxa de conversão do funil
  - Crescimento de clientes mês a mês
  - Alertas de tarefas em atraso
  - Insights sobre leads em negociação

### Gestão de Clientes
- CRUD completo com busca em tempo real (nome, email, empresa)
- Soft delete — dados históricos preservados
- Página de detalhe com todas as tarefas do cliente

### Funil de Leads
- Sete estágios: Novo → Contato → Qualificado → Proposta → Negociação → Ganho/Perdido
- Atualização de status com um clique
- Filtro por estágio do funil
- Valor estimado por negócio

### Gestão de Tarefas
- Tarefas associadas a clientes específicos
- Alertas visuais automáticos para tarefas em atraso
- Marcar como concluída com um clique
- Filtro por status e cliente

---

## 🏗 Arquitetura

```
crm-platform/
├── backend/                          # Spring Boot 3.2.5 (Java 21)
│   └── src/main/java/com/crm/platform/
│       ├── config/                   # SecurityConfig, JpaAuditing, OpenAI
│       ├── controller/               # REST Controllers (Client, Lead, Task, Dashboard)
│       ├── domain/
│       │   ├── entity/               # JPA Entities com herança de BaseEntity
│       │   └── enums/                # LeadStatus, TaskStatus
│       ├── dto/
│       │   ├── request/              # Java Records para input (imutáveis, sem boilerplate)
│       │   └── response/             # Java Records para output
│       ├── exception/                # GlobalExceptionHandler (RFC 7807 ProblemDetail)
│       ├── mapper/                   # MapStruct (gerado em compile-time, zero reflexão)
│       ├── repository/               # Spring Data JPA com queries customizadas
│       └── service/                  # Lógica de negócio, regras, transações
│   └── src/main/resources/
│       ├── application.yml           # Configurações por ambiente
│       └── db/migration/             # Flyway V1-V4 (versionamento de banco)
│
├── frontend/                         # Angular 17 (Standalone Components)
│   └── src/app/
│       ├── core/
│       │   ├── guards/               # AuthGuard, RoleGuard
│       │   ├── interceptors/         # HTTP interceptor (auth token)
│       │   └── services/             # ClientService, LeadService, TaskService, DashboardService
│       ├── features/
│       │   ├── auth/                 # Login component
│       │   ├── dashboard/            # Dashboard com Chart.js
│       │   ├── clients/              # List + Detail + Form Dialog
│       │   ├── leads/                # List + Form Dialog + Status update
│       │   └── tasks/                # List + Form Dialog + Complete action
│       └── shared/
│           └── models/               # TypeScript interfaces (espelham os DTOs do backend)
│
├── keycloak/
│   └── realm-export.json             # Realm pré-configurado (roles EMPRESA/CLIENTE)
│
└── docker-compose.yml                # Orquestração local (postgres + keycloak + backend + frontend)
```

### Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---|---|---|
| Mapeamento Entity↔DTO | MapStruct | Gerado em compile-time, mais rápido que ModelMapper, erros em build time |
| Versionamento de banco | Flyway | Histórico auditável, migrations idempotentes, padrão de mercado |
| Tratamento de erros | RFC 7807 ProblemDetail | Padrão moderno do Spring 6, resposta consistente para o frontend |
| HTTP Client (Spring 6) | RestClient | Substituto moderno do RestTemplate, fluent API |
| Entidades base | BaseEntity com JPA Auditing | createdAt/updatedAt/createdBy automáticos em todas as entidades |
| Frontend state | SessionStorage | Simples e suficiente para demo; substituível por NgRx em escala |
| Lazy Loading Angular | Route-level code splitting | Carregamento inicial mais rápido, cada página carrega sob demanda |

---

## 🛠 Stack Tecnológica

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Java | 21 | Linguagem (Records, Pattern Matching, Virtual Threads ready) |
| Spring Boot | 3.2.5 | Framework principal |
| Spring Security | 6.2 | Autenticação e autorização |
| Spring Data JPA | 3.2 | Abstração de persistência |
| Hibernate | 6.4 | ORM |
| Flyway | 10.x | Migrations de banco de dados |
| MapStruct | 1.5.5 | Mapeamento Entity ↔ DTO |
| Lombok | 1.18.32 | Redução de boilerplate |
| SpringDoc/Swagger | 2.5.0 | Documentação automática da API |
| JUnit 5 + Mockito | latest | Testes unitários e de integração |

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| Angular | 17 | Framework SPA com Standalone Components |
| Angular Material | 17 | Design system (componentes UI) |
| TypeScript | 5.4 | Tipagem estática |
| Chart.js + ng2-charts | 4.x / 5.x | Gráficos do dashboard |
| RxJS | 7.8 | Programação reativa |

### Infraestrutura
| Tecnologia | Versão | Papel |
|---|---|---|
| PostgreSQL | 16 | Banco de dados principal |
| Docker + Compose | latest | Containerização |
| Nginx | alpine | Servidor web para o frontend em produção |
| Keycloak | 23 | Identity Provider (OAuth2 / OpenID Connect) |

---

## 🚀 Como Rodar

### Pré-requisitos

```bash
# Verifique se estão instalados:
java --version      # Java 21+
docker --version    # Docker 24+
node --version      # Node.js 20+
```

### Opção A — Tudo pelo Docker (mais simples)

```bash
# Clone o repositório
git clone https://github.com/TonyKerr07/crm-platform.git
cd crm-platform

# Suba tudo
docker compose up --build
```

Acesse http://localhost:4200 após ~5 minutos.

### Opção B — Desenvolvimento local (recomendado para editar código)

**Terminal 1 — Banco de dados:**
```bash
docker compose up postgres -d
```

**Terminal 2 — Backend:**
```bash
cd backend
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm install       # somente na primeira vez
npm start
```

Acesse http://localhost:4200

### Credenciais de Acesso

| Usuário | Senha | Perfil |
|---|---|---|
| `admin.empresa` | `empresa123` | Acesso completo ao sistema |
| `usuario.cliente` | `cliente123` | Acesso somente leitura |

---

## 📡 API Docs

Com o backend rodando, acesse a documentação interativa:

**Swagger UI:** http://localhost:8080/api/swagger-ui.html

### Endpoints principais

```
GET    /api/dashboard              → Métricas + insights de IA
GET    /api/clients?search=&page=  → Lista paginada de clientes
POST   /api/clients                → Criar cliente
PUT    /api/clients/{id}           → Atualizar cliente
DELETE /api/clients/{id}           → Desativar cliente (soft delete)

GET    /api/leads?status=&page=    → Lista de leads com filtros
POST   /api/leads                  → Criar lead
PATCH  /api/leads/{id}/status      → Mover no funil

GET    /api/tasks?clientId=        → Tarefas por cliente
POST   /api/tasks                  → Criar tarefa
PATCH  /api/tasks/{id}/complete    → Marcar como concluída
```

### Exemplo de resposta — Dashboard

```json
{
  "totalClients": 10,
  "activeClients": 8,
  "totalLeads": 15,
  "openTasks": 5,
  "overdueTasks": 1,
  "clientGrowthPercent": 15.5,
  "leadsByStatus": {
    "NOVO": 3,
    "NEGOCIACAO": 4,
    "GANHO": 2,
    "PERDIDO": 1
  },
  "aiInsights": [
    {
      "title": "🚀 Crescimento acelerado",
      "message": "Clientes ativos cresceram 15% este mês. Ótimo momento para expandir o time!",
      "type": "SUCCESS",
      "icon": "🚀"
    }
  ]
}
```

---

## 🧪 Testes

```bash
# Rodar todos os testes
cd backend
./mvnw test

# Com relatório de cobertura
./mvnw test jacoco:report
# Relatório em: target/site/jacoco/index.html
```

Os testes usam banco H2 em memória — não precisam de PostgreSQL rodando.

---

## 🌍 Deploy (Railway)

> Coloque o projeto online em ~10 minutos gratuitamente.

1. Crie conta em https://railway.app com sua conta GitHub
2. Clique em **New Project → Deploy from GitHub Repo**
3. Selecione o repositório `crm-platform`
4. Adicione o serviço de banco: **New Service → Database → PostgreSQL**
5. Configure as variáveis de ambiente no serviço backend:
   ```
   DB_URL=${{Postgres.DATABASE_URL}}
   OPENAI_API_KEY=sua-chave-aqui
   OPENAI_ENABLED=true
   ```
6. Clique em **Settings → Networking → Generate Domain** para obter a URL pública

---

## 🤖 Integração com OpenAI (Insights Inteligentes)

Por padrão, os insights são gerados por **heurísticas locais** e funcionam sem nenhuma configuração.

Para usar o **GPT real**:

1. Crie uma chave em https://platform.openai.com/api-keys
2. No arquivo `.env`:
   ```
   OPENAI_API_KEY=sk-sua-chave-aqui
   OPENAI_ENABLED=true
   ```
3. Reinicie o backend

Os insights passam a ser gerados pelo GPT-3.5 com base nas métricas reais do CRM.

---

## 📊 Banco de Dados

### Diagrama de Entidades

```
clients
├── id (UUID, PK)
├── name, email (unique), phone
├── company_name, document
├── notes, active (soft delete)
└── created_at, updated_at, created_by, updated_by

leads
├── id (UUID, PK)
├── name, email, phone, company_name
├── source, status (enum), estimated_value
├── responsible, notes
└── created_at, updated_at, created_by, updated_by

tasks
├── id (UUID, PK)
├── title, description, status (enum)
├── due_date, assigned_to
├── client_id (FK → clients)
└── created_at, updated_at, created_by, updated_by
```

### Migrations Flyway

| Versão | Arquivo | Descrição |
|---|---|---|
| V1 | `V1__create_clients.sql` | Tabela de clientes + índices |
| V2 | `V2__create_leads.sql` | Tabela de leads + constraints |
| V3 | `V3__create_tasks.sql` | Tabela de tarefas + FK |
| V4 | `V4__seed_data.sql` | Dados de exemplo para teste |

---

## 🔒 Segurança

- Autenticação via Keycloak (OAuth2 / OpenID Connect) em produção
- PKCE para fluxo de autorização no frontend
- CORS configurado explicitamente
- Soft delete — dados nunca são removidos permanentemente
- Auditoria automática (quem criou/modificou cada registro)
- Usuário não-root nos containers Docker

---

## 📁 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```bash
# Banco de dados
DB_URL=jdbc:postgresql://localhost:5432/crmdb
DB_USER=crmuser
DB_PASS=crmpassword

# Keycloak
KEYCLOAK_URL=http://localhost:8180

# OpenAI (opcional)
OPENAI_API_KEY=sk-...
OPENAI_ENABLED=false
```

---

## 🤝 Contribuindo

```bash
# Fork o projeto
git fork https://github.com/TonyKerr07/crm-platform

# Crie uma branch para sua feature
git checkout -b feat/minha-feature

# Commit seguindo Conventional Commits
git commit -m "feat(leads): adicionar campo de prioridade"

# Abra um Pull Request
```

### Padrão de commits

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `refactor:` | Refatoração sem mudança de comportamento |
| `docs:` | Documentação |
| `test:` | Testes |
| `chore:` | Configuração, build, dependências |

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Desenvolvido com ☕ Java, 🅰️ Angular e muita determinação.

**[⭐ Se este projeto te ajudou, deixe uma estrela!](https://github.com/TonyKerr07/crm-platform)**

</div>
