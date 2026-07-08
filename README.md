# 🚀 CRM Platform

> **Sistema de CRM completo** com Java 21 + Spring Boot + Angular 17 + Keycloak + IA  
> Ideal para portfólio — siga o guia abaixo para colocar no ar em menos de 1 hora!

---

## 📋 Índice

1. [O que é este projeto?](#-o-que-é-este-projeto)
2. [Pré-requisitos](#-pré-requisitos)
3. [Passo 1 — Criar o repositório no GitHub](#-passo-1--criar-o-repositório-no-github)
4. [Passo 2 — Clonar no IntelliJ](#-passo-2--clonar-no-intellij)
5. [Passo 3 — Rodar com Docker (modo mais fácil)](#-passo-3--rodar-com-docker-modo-mais-fácil)
6. [Passo 4 — Rodar backend e frontend separadamente](#-passo-4--rodar-backend-e-frontend-separadamente)
7. [Usuários de teste](#-usuários-de-teste)
8. [Acessando o sistema](#-acessando-o-sistema)
9. [Funcionalidades](#-funcionalidades)
10. [Habilitar IA real (OpenAI)](#-habilitar-ia-real-openai)
11. [Deploy para o LinkedIn (Railway)](#-deploy-para-o-linkedin-railway)
12. [Estrutura do projeto](#-estrutura-do-projeto)
13. [Tecnologias usadas](#-tecnologias-usadas)

---

## 💡 O que é este projeto?

Um CRM (Customer Relationship Management) completo, com:
- **Login seguro** com dois tipos de usuário (empresa e cliente)
- **Cadastro de clientes** com CRUD completo
- **Funil de leads** (do contato inicial ao fechamento)
- **Gestão de tarefas** com alertas de atraso
- **Dashboard com gráficos** e **insights de IA** automáticos
- Tudo containerizado com Docker — roda com **um único comando**

---

## 🛠 Pré-requisitos

Instale estas ferramentas antes de começar. Clique em cada link para baixar:

| Ferramenta | Para quê serve | Link |
|---|---|---|
| **Git** | Versionamento de código | https://git-scm.com/downloads |
| **Docker Desktop** | Rodar banco, Keycloak e app em containers | https://www.docker.com/products/docker-desktop |
| **IntelliJ IDEA** | IDE para editar o projeto | https://www.jetbrains.com/idea/download (Community é gratuito) |
| **Node.js 20+** | Rodar o frontend Angular | https://nodejs.org (versão LTS) |
| **Java 21** | Compilar o backend | https://adoptium.net |

**Como verificar se está instalado:**
```bash
# Abra o terminal (CMD no Windows / Terminal no Mac/Linux) e rode:
git --version        # deve mostrar: git version 2.x.x
docker --version     # deve mostrar: Docker version 26.x.x
node --version       # deve mostrar: v20.x.x
java --version       # deve mostrar: openjdk 21.x.x
```

---

## 📁 Passo 1 — Criar o repositório no GitHub

> **O GitHub é como um "Google Drive para código"** — salva seu projeto na nuvem e permite que recrutadores vejam seu trabalho.

### 1.1 Criar conta no GitHub (se não tiver)
1. Acesse https://github.com
2. Clique em **"Sign up"** e crie sua conta gratuita

### 1.2 Criar o repositório
1. Depois de logar, clique no **"+"** no canto superior direito
2. Clique em **"New repository"**
3. Preencha:
   - **Repository name:** `crm-platform`
   - **Description:** `CRM Platform com Java 21, Spring Boot, Angular 17, Keycloak e IA`
   - Marque **"Public"** (para aparecer no LinkedIn)
   - **NÃO** marque "Initialize this repository with a README" (já temos um)
4. Clique em **"Create repository"**

### 1.3 Subir o projeto para o GitHub
Abra o terminal na pasta onde você descompactou o projeto e rode:

```bash
# Entre na pasta do projeto (ajuste o caminho)
cd crm-platform

# Inicializa o Git (cria a "memória" do projeto)
git init

# Adiciona todos os arquivos
git add .

# Faz o primeiro commit (como salvar o documento)
git commit -m "feat: initial CRM Platform setup"

# Conecta com o seu repositório no GitHub
# ATENÇÃO: troque SEU_USUARIO pelo seu usuário do GitHub!
git remote add origin https://github.com/SEU_USUARIO/crm-platform.git

# Sobe o código para o GitHub
git branch -M main
git push -u origin main
```

✅ **Pronto!** Acesse `https://github.com/SEU_USUARIO/crm-platform` e veja o código lá.

---

## 💻 Passo 2 — Clonar no IntelliJ

> **Clonar** é "baixar o projeto do GitHub para o seu computador de forma inteligente" — o IntelliJ entende a estrutura do Maven automaticamente.

1. Abra o **IntelliJ IDEA**
2. Na tela inicial, clique em **"Get from VCS"**  
   *(ou pelo menu: File → New → Project from Version Control)*
3. Cole a URL do seu repositório:  
   `https://github.com/SEU_USUARIO/crm-platform.git`
4. Escolha onde salvar (ex: `C:\projetos\crm-platform` ou `~/projetos/crm-platform`)
5. Clique em **"Clone"**
6. O IntelliJ vai perguntar se quer abrir como projeto Maven — clique **"Yes"**
7. **Aguarde** enquanto ele baixa as dependências (pode demorar 2-5 minutos na primeira vez)

---

## 🐳 Passo 3 — Rodar com Docker (modo mais fácil)

> **Docker** é como uma "caixa mágica" que instala e roda tudo automaticamente, sem você precisar configurar banco de dados, Keycloak, etc.

### 3.1 Certifique-se que o Docker Desktop está aberto
- Abra o Docker Desktop e aguarde aparecer "Engine running" (ícone verde)

### 3.2 Configure as variáveis de ambiente
```bash
# Na pasta raiz do projeto (crm-platform/), rode:
cp .env.example .env
# O arquivo .env já tem valores padrão, não precisa alterar nada para começar
```

### 3.3 Suba tudo com um único comando
```bash
# Na pasta raiz do projeto:
docker compose up --build

# Isso vai:
# 1. Baixar as imagens do PostgreSQL e Keycloak (1ª vez demora ~5 min)
# 2. Compilar o backend Java
# 3. Compilar o frontend Angular
# 4. Subir tudo conectado
```

### 3.4 Aguarde os serviços iniciarem
Você saberá que está pronto quando ver no terminal:
```
crm_backend  | Started CrmPlatformApplication in 8.xxx seconds
crm_frontend | nginx: ready to accept connections
```

### 3.5 Parar os containers
```bash
# Para parar (preserva os dados do banco):
Ctrl + C
docker compose down

# Para parar E apagar todos os dados:
docker compose down -v
```

---

## ⚙️ Passo 4 — Rodar backend e frontend separadamente

> Útil quando você está **desenvolvendo** e quer recarregamento automático ao salvar arquivos.

### 4.1 Sobe só o banco e o Keycloak
```bash
docker compose up postgres keycloak -d
# O -d roda em background (não trava o terminal)
```

### 4.2 Roda o backend (IntelliJ ou terminal)

**Pelo IntelliJ:**
1. Abra `backend/src/main/java/com/crm/platform/CrmPlatformApplication.java`
2. Clique na seta verde ▶️ ao lado da classe
3. Aguarde aparecer: `Started CrmPlatformApplication`

**Pelo terminal:**
```bash
cd backend
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

### 4.3 Roda o frontend
```bash
cd frontend
npm install          # Instala as dependências (só na 1ª vez)
npm start            # Inicia o servidor de desenvolvimento
```

---

## 👤 Usuários de teste

Estes usuários são criados automaticamente pelo Keycloak:

| Usuário | Senha | Acesso |
|---|---|---|
| `admin.empresa` | `empresa123` | ✅ Tudo (clientes, leads, tarefas, dashboard) |
| `usuario.cliente` | `cliente123` | 👁️ Somente dashboard e relatórios |

---

## 🌐 Acessando o sistema

Após subir tudo, abra no navegador:

| Serviço | URL | Para quê |
|---|---|---|
| **Frontend (CRM)** | http://localhost:4200 | Usar o sistema |
| **Backend (API)** | http://localhost:8080/api | Chamadas REST |
| **Swagger UI** | http://localhost:8080/api/swagger-ui.html | Testar a API visualmente |
| **Keycloak Admin** | http://localhost:8180 | Gerenciar usuários/roles |

**Login no Keycloak Admin:**
- Usuário: `admin`
- Senha: `admin123`

---

## ✨ Funcionalidades

### Dashboard
- Métricas em tempo real: clientes ativos, leads, tarefas abertas
- **Gráfico de rosca** com distribuição do funil de leads
- **Cards de IA** com insights automáticos (sem OpenAI funciona com heurísticas)

### Clientes
- Lista paginada com busca em tempo real (nome, email, empresa)
- Criar, editar, desativar (soft delete — dados históricos preservados)
- Página de detalhe com todas as tarefas do cliente

### Leads
- Funil de vendas: Novo → Contato → Qualificado → Proposta → Negociação → Ganho/Perdido
- Mover lead no funil com 1 clique
- Filtro por status

### Tarefas
- Associadas a clientes específicos
- Alertas visuais para tarefas em atraso
- Marcar como concluída com 1 clique

---

## 🤖 Habilitar IA real (OpenAI)

Por padrão, os insights são gerados por **heurísticas locais** (funciona sem chave).  
Para usar o **GPT real**:

1. Crie uma conta em https://platform.openai.com e gere uma chave API
2. No arquivo `.env`, mude:
```
OPENAI_API_KEY=sk-sua-chave-real-aqui
OPENAI_ENABLED=true
```
3. Reinicie os containers:
```bash
docker compose down
docker compose up --build
```

---

## 🌍 Deploy para o LinkedIn (Railway)

> **Railway** hospeda seu projeto de graça (com limite de horas mensais) e te dá uma URL pública. Perfeito para o portfólio!

### Passo a passo Railway

**1. Crie uma conta no Railway**
- Acesse https://railway.app
- Clique em **"Login with GitHub"** — use a mesma conta do GitHub

**2. Crie um novo projeto**
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Selecione **"crm-platform"**
4. O Railway vai detectar o `docker-compose.yml` automaticamente

**3. Configure o banco de dados**
1. No projeto, clique em **"New Service"** → **"Database"** → **"PostgreSQL"**
2. O Railway cria o banco e gera as variáveis automaticamente

**4. Configure as variáveis de ambiente**
No painel do Railway, clique em seu serviço backend → **"Variables"**:
```
DB_URL=${{Postgres.DATABASE_URL}}
KEYCLOAK_URL=https://seu-keycloak.railway.app
OPENAI_ENABLED=false
```

**5. Obtenha a URL pública**
- Após o deploy, clique em **"Settings"** → **"Networking"** → **"Generate Domain"**
- Você receberá algo como: `https://crm-platform-abc123.railway.app`

**6. Adicione no LinkedIn**
1. Acesse seu perfil no LinkedIn
2. Em "Projetos" → **"Adicionar projeto"**
3. **Nome:** `CRM Platform - Java 21 + Spring Boot + Angular + IA`
4. **URL:** Cole a URL do Railway
5. **Descrição sugerida:**
> Sistema CRM completo desenvolvido com Java 21, Spring Boot 3, Angular 17, autenticação OAuth2/Keycloak e insights inteligentes via OpenAI. Backend com Spring Security, JPA, Flyway e PostgreSQL. Frontend com Angular Material e Chart.js. Containerizado com Docker Compose.

---

## 📁 Estrutura do projeto

```
crm-platform/
├── 📄 pom.xml                    ← Maven pai (gerencia os módulos)
├── 📄 docker-compose.yml         ← Sobe tudo com 1 comando
├── 📄 .env.example               ← Template de variáveis de ambiente
│
├── 🗂️ backend/                   ← Spring Boot
│   ├── 📄 pom.xml
│   ├── 🐋 Dockerfile
│   └── src/main/java/com/crm/platform/
│       ├── config/               ← Segurança, JPA, OpenAI
│       ├── controller/           ← REST endpoints
│       ├── domain/               ← Entidades JPA e Enums
│       ├── dto/                  ← Request/Response DTOs (Java Records)
│       ├── exception/            ← Tratamento global de erros
│       ├── mapper/               ← MapStruct (Entity ↔ DTO)
│       ├── repository/           ← Spring Data JPA
│       └── service/              ← Lógica de negócio
│   └── src/main/resources/
│       ├── application.yml       ← Configurações do Spring
│       └── db/migration/         ← Scripts SQL do Flyway (V1-V4)
│
├── 🗂️ frontend/                  ← Angular 17
│   ├── 📄 package.json
│   ├── 📄 angular.json
│   ├── 🐋 Dockerfile
│   ├── 📄 nginx.conf
│   └── src/app/
│       ├── core/                 ← Guards, Interceptors, Services
│       ├── features/             ← Páginas (dashboard, clients, leads, tasks)
│       └── shared/               ← Models e componentes reutilizáveis
│
└── 🗂️ keycloak/
    └── realm-export.json         ← Configuração do Keycloak (roles e usuários)
```

---

## 🛠 Tecnologias usadas

### Backend
| Tecnologia | Versão | Para quê |
|---|---|---|
| Java | 21 | Linguagem principal (Records, Sealed Classes) |
| Spring Boot | 3.2.5 | Framework web |
| Spring Security + OAuth2 | 6.x | Autenticação via JWT/Keycloak |
| Spring Data JPA + Hibernate | 6.x | Acesso ao banco de dados |
| Flyway | 10.x | Versionamento do banco (migrations SQL) |
| MapStruct | 1.5.5 | Mapeamento Entity ↔ DTO (gerado em compile-time) |
| Lombok | 1.18.32 | Reduz boilerplate (getters, setters, builders) |
| PostgreSQL | 16 | Banco de dados principal |
| SpringDoc/Swagger | 2.5.0 | Documentação automática da API |
| JUnit 5 + Mockito | latest | Testes unitários e de integração |

### Frontend
| Tecnologia | Versão | Para quê |
|---|---|---|
| Angular | 17 | Framework SPA (standalone components) |
| Angular Material | 17 | Componentes de UI prontos e profissionais |
| TypeScript | 5.4 | JavaScript com tipagem estática |
| Chart.js + ng2-charts | 4.x / 6.x | Gráficos do dashboard |
| Keycloak-js | 23 | Integração com autenticação Keycloak |
| RxJS | 7.8 | Programação reativa (Observables) |

### Infraestrutura
| Tecnologia | Versão | Para quê |
|---|---|---|
| Keycloak | 23 | Servidor de identidade (OAuth2/OpenID Connect) |
| Docker + Docker Compose | latest | Containerização e orquestração local |
| Nginx | alpine | Servidor web para o frontend em produção |
| Railway | — | Deploy gratuito para portfólio |

---

## ❓ Problemas comuns

**"Port 5432 already in use"**
> O PostgreSQL local está rodando na mesma porta.  
> Solução: `docker compose down` e depois pare o PostgreSQL local.

**"Cannot connect to Docker daemon"**
> O Docker Desktop não está aberto.  
> Solução: Abra o Docker Desktop e aguarde o ícone ficar verde.

**"npm install falhou"**
> Versão do Node muito antiga.  
> Solução: Instale o Node.js 20 LTS em https://nodejs.org

**"Keycloak demorando muito para iniciar"**
> Normal na 1ª vez — o Keycloak demora ~60 segundos.  
> Aguarde aparecer `Keycloak ... started` no terminal.

**Frontend mostrando 401 Unauthorized**
> O token JWT expirou ou não foi enviado.  
> Solução: Faça logout e login novamente.

---

## 📝 Licença

MIT License — use à vontade para seu portfólio!

---

*Desenvolvido com ❤️ para portfólio sênior — Java + Spring Boot + Angular + Keycloak + IA*
