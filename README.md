# 🚀 Orbit --- AI Workspace for Chat, Code & Content Creation

::: {align="center"}
### An AI-first, microservice-powered workspace for conversation, coding, research, document generation and multimodal creation.

**React + Vite · Node.js · Express · Docker · Redis · MongoDB · Firebase
· Cloudinary · Razorpay · Render · Vercel**

[![Live
Frontend](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://orbit-two-azure.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://orbit-gateway-dtse.onrender.com)
[![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/govindpathak18/orbit)
:::

------------------------------------------------------------------------

## ✨ What is Orbit?

**Orbit** is a full-stack, AI-first web platform designed around a
scalable microservice architecture.

Instead of building every AI capability into one large backend, Orbit
separates responsibilities into focused services:

-   **API Gateway** --- the single backend entry point and request
    router
-   **Auth Service** --- authentication and user management
-   **Chat Service** --- conversations and messages
-   **Agent Service** --- AI orchestration and specialized agents
-   **Billing Service** --- credits, plans and payments
-   **Redis** --- shared fast-access infrastructure
-   **MongoDB** --- persistent application data
-   **Cloudinary** --- media/file storage
-   **Vercel** --- production frontend hosting
-   **Render** --- production backend hosting

The result is a platform that can be extended with new AI capabilities
without turning the backend into a monolith.

------------------------------------------------------------------------

# 🎯 Why Orbit?

Modern AI products are not just chat interfaces. They need:

-   authentication
-   persistent conversations
-   multiple AI providers
-   file and media handling
-   specialized AI workflows
-   usage/credit management
-   payments
-   scalable service boundaries
-   secure API routing
-   production deployment

Orbit brings these pieces together in one project.

### Core idea

``` text
                    ┌──────────────────────────┐
                    │       Orbit Frontend     │
                    │      React + Vite        │
                    │     Redux + Axios        │
                    └────────────┬─────────────┘
                                 │
                                 │ HTTPS
                                 ▼
                    ┌──────────────────────────┐
                    │      API Gateway         │
                    │ Express + Proxy + Auth   │
                    └────────────┬─────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
     ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
     │    Auth     │      │    Chat     │      │    Agent    │
     │   Service   │      │   Service   │      │   Runtime   │
     └─────────────┘      └─────────────┘      └──────┬──────┘
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │  AI / RAG / │
                                               │  Generation  │
                                               └─────────────┘

                    ┌──────────────────────────┐
                    │        Billing           │
                    │ Credits + Razorpay       │
                    └──────────────────────────┘

                         Shared Infrastructure
                    ┌────────────┬─────────────┐
                    ▼            ▼             ▼
                  Redis       MongoDB      Cloudinary
```

------------------------------------------------------------------------

# 🌟 Key Features

## 🤖 Multi-Agent AI Workspace

Orbit is built around an extensible agent runtime rather than a single
AI endpoint.

Supported agent capabilities include:

-   💬 AI Chat
-   💻 Coding assistance
-   🖼️ Image generation
-   📄 PDF assistance/generation
-   📊 PPT assistance/generation
-   🔎 RAG and retrieval workflows
-   👁️ Vision capabilities
-   🌐 Web/search-assisted workflows

Agents live under:

``` text
backend/services/agent/agents/
```

This makes adding a new agent a focused change rather than a rewrite of
the backend.

------------------------------------------------------------------------

## 💬 Persistent AI Conversations

Orbit supports a complete conversation lifecycle:

-   Create conversation
-   Retrieve conversations
-   Update conversations
-   Delete conversations
-   Save messages
-   Retrieve messages
-   Associate messages with authenticated users

Example API flow:

``` text
POST   /api/chat/create-conversation
GET    /api/chat/get-conversations
POST   /api/chat/update-conversation
DELETE /api/chat/delete-conversation/:id
POST   /api/chat/save-message
GET    /api/chat/get-messages/:id
```

------------------------------------------------------------------------

## 🔐 Authentication & User Context

Authentication is handled by a dedicated service.

The gateway protects authenticated routes and forwards user context to
downstream services using internal request headers.

Example internal headers:

``` text
x-user-id
x-user-email
x-user-avatar
```

This keeps downstream services focused on their business logic while the
gateway handles authentication concerns.

------------------------------------------------------------------------

## 💳 Credits, Plans & Payments

Orbit includes a dedicated billing microservice for:

-   user credits
-   plans
-   payment processing
-   Razorpay integration
-   credit deduction during AI operations

AI usage can therefore be tied to a controlled credit system instead of
exposing unrestricted model usage.

------------------------------------------------------------------------

## ☁️ Cloudinary File & Media Storage

Orbit uses Cloudinary for media/file workflows.

This allows generated or uploaded assets to be stored outside the
application containers.

Relevant environment variables:

``` env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

------------------------------------------------------------------------

## ⚡ Redis Infrastructure

Redis is shared between services where fast-access state/caching is
required.

Services receive the connection through:

``` env
REDIS_URL=
```

The Redis configuration is centralized under:

``` text
backend/shared/redis/
```

------------------------------------------------------------------------

# 🧠 AI Provider Integrations

Orbit is designed to work with multiple AI/model providers rather than
coupling the entire platform to one provider.

Depending on the enabled agent, the backend can use provider credentials
such as:

``` env
GOOGLE_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
QDRANT_API_KEY=
QDRANT_URL=
TAVILY_API_KEY=
```

This provider-oriented design makes it possible to use different
models/services for different workloads.

------------------------------------------------------------------------

# 🏗️ Microservice Architecture

Orbit uses a service-oriented backend:

  Service      Responsibility
  ------------ --------------------------------------------------------
  Gateway      API routing, authentication middleware, CORS, proxying
  Auth         Authentication and user management
  Chat         Conversations and messages
  Agent        AI orchestration and specialized agents
  Billing      Credits, plans and payments
  Redis        Shared fast-access infrastructure
  MongoDB      Persistent application data
  Cloudinary   Media/file storage

### Why microservices?

The architecture provides clear boundaries between responsibilities.

For example:

``` text
Chat logic
    ≠
AI orchestration
    ≠
Authentication
    ≠
Billing
```

Each area can evolve independently and can be scaled or deployed
separately.

------------------------------------------------------------------------

# 🌐 API Gateway

The gateway is the public backend entry point.

Production:

``` text
https://orbit-gateway-dtse.onrender.com
```

The frontend communicates with the gateway rather than directly calling
individual services.

### Gateway routes

``` text
/api/auth/*
/api/me
/api/chat/*
/api/agent/*
/api/billing/*
```

### Request flow

``` text
Browser
   │
   │ /api/chat/get-conversations
   ▼
Gateway
   │
   │ authentication
   │ user context
   ▼
Chat Service
   │
   ▼
MongoDB
```

This centralizes:

-   authentication
-   CORS
-   security headers
-   logging
-   request routing
-   user context propagation

------------------------------------------------------------------------

# 🔁 Request Proxying

Orbit uses `express-http-proxy` for service-to-service routing.

The gateway dynamically resolves service targets from environment
variables:

``` env
AUTH_SERVICE_URL=
CHAT_SERVICE_URL=
AGENT_SERVICE_URL=
BILLING_SERVICE_URL=
```

Authenticated requests are forwarded with relevant user information.

Example:

``` text
/api/chat/get-conversations
            │
            ▼
Gateway
            │
            ▼
https://orbit-chat-d98e.onrender.com/get-conversations
```

This keeps public API routes stable even if internal services change.

------------------------------------------------------------------------

# 🖥️ Frontend

The frontend is built with:

-   React
-   Vite
-   Redux
-   Axios
-   modern component-based UI architecture

The frontend includes UI flows for:

-   AI chat
-   conversations/sidebar
-   coding
-   PDF workflows
-   PPT workflows
-   image generation
-   search/research
-   billing
-   user authentication

Production frontend:

``` text
https://orbit-two-azure.vercel.app
```

Frontend API configuration:

``` env
VITE_API_URL=https://orbit-gateway-dtse.onrender.com
```

------------------------------------------------------------------------

# 📦 Repository Structure

``` text
orbit/
│
├── backend/
│   │
│   ├── gateway/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── Dockerfile
│   │   └── index.js
│   │
│   ├── services/
│   │   │
│   │   ├── agent/
│   │   │   ├── agents/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── utils/
│   │   │   ├── Dockerfile
│   │   │   └── index.js
│   │   │
│   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── Dockerfile
│   │   │   └── index.js
│   │   │
│   │   ├── billing/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── Dockerfile
│   │   │   └── index.js
│   │   │
│   │   └── chat/
│   │       ├── controllers/
│   │       ├── routes/
│   │       ├── Dockerfile
│   │       └── index.js
│   │
│   ├── shared/
│   │   └── redis/
│   │       └── redis.js
│   │
│   ├── docker-compose.yml
│   ├── render.yaml
│   ├── .env.example
│   └── DEPLOY_RENDER.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── redux/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

  Technology   Purpose
  ------------ ------------------------
  React        UI
  Vite         Frontend tooling/build
  Redux        Application state
  Axios        API communication

## Backend

  Technology             Purpose
  ---------------------- ---------------------
  Node.js                Runtime
  Express                HTTP services
  `express-http-proxy`   Gateway routing
  Helmet                 Security headers
  CORS                   Cross-origin access
  Morgan                 HTTP logging
  Cookie Parser          Cookie handling
  Docker                 Containerization

## Data & Infrastructure

  Technology   Purpose
  ------------ --------------------------
  MongoDB      Persistent data
  Redis        Shared fast-access state
  Cloudinary   Media/file storage
  Firebase     Authentication
  Razorpay     Payments

## AI / Retrieval

  Technology   Purpose
  ------------ ---------------------------
  Google AI    Model workloads
  Groq         Model workloads
  OpenRouter   Model routing
  Qdrant       Vector search
  Tavily       Search/research workflows

## Deployment

  Platform   Usage
  ---------- -----------------------
  Vercel     Frontend
  Render     Backend microservices
  Docker     Service containers
  GitHub     Source control

------------------------------------------------------------------------

# 🐳 Local Development

## Prerequisites

Install:

-   Node.js 18+
-   Docker
-   Docker Compose
-   MongoDB or a MongoDB-compatible managed database
-   Redis or a managed Redis instance
-   required AI provider credentials

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone https://github.com/govindpathak18/orbit.git
cd orbit
```

------------------------------------------------------------------------

## 2. Configure backend environment

Create your local environment files from the examples provided.

Never commit production secrets.

Typical configuration includes:

``` env
NODE_ENV=development
PORT=8000

REDIS_URL=
MONGODB_URL=

FRONTEND_URL=http://localhost:5173

AUTH_SERVICE_URL=
CHAT_SERVICE_URL=
AGENT_SERVICE_URL=
BILLING_SERVICE_URL=
```

Add the required provider credentials for the agents you want to run.

------------------------------------------------------------------------

## 3. Start the backend with Docker

``` bash
cd backend
docker-compose up --build
```

This starts the local backend service stack defined in:

``` text
backend/docker-compose.yml
```

------------------------------------------------------------------------

## 4. Start the frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

Open:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# ▶️ Run Individual Services

### Gateway

``` bash
cd backend/gateway
npm install
npm start
```

### Agent

``` bash
cd backend/services/agent
npm install
npm start
```

### Auth

``` bash
cd backend/services/auth
npm install
npm start
```

### Chat

``` bash
cd backend/services/chat
npm install
npm start
```

### Billing

``` bash
cd backend/services/billing
npm install
npm start
```

------------------------------------------------------------------------

# ☁️ Production Deployment

Orbit is deployed using a split frontend/backend architecture.

``` text
GitHub
 │
 ├──────────────────────► Vercel
 │                         │
 │                         └── React + Vite
 │
 └──────────────────────► Render
                           │
                           ├── Gateway
                           ├── Auth
                           ├── Chat
                           ├── Agent
                           └── Billing
```

## Vercel

Production frontend:

``` text
https://orbit-two-azure.vercel.app
```

Required frontend variable:

``` env
VITE_API_URL=https://orbit-gateway-dtse.onrender.com
```

After changing a `VITE_*` variable, the frontend must be
rebuilt/redeployed because Vite injects these variables during the
build.

------------------------------------------------------------------------

## Render

The repository includes:

``` text
render.yaml
```

This defines the Render Blueprint configuration for the backend
services.

Production services:

``` text
Gateway:
https://orbit-gateway-dtse.onrender.com

Auth:
https://orbit-auth.onrender.com

Chat:
https://orbit-chat-d98e.onrender.com

Agent:
https://orbit-agent.onrender.com

Billing:
https://orbit-billing.onrender.com
```

Each service is independently containerized.

------------------------------------------------------------------------

# 🔐 Production Environment Configuration

## Gateway

``` env
FRONTEND_URL=https://orbit-two-azure.vercel.app
REDIS_URL=<managed-redis-url>

AUTH_SERVICE_URL=https://orbit-auth.onrender.com
CHAT_SERVICE_URL=https://orbit-chat-d98e.onrender.com
AGENT_SERVICE_URL=https://orbit-agent.onrender.com
BILLING_SERVICE_URL=https://orbit-billing.onrender.com
```

## Agent

``` env
FRONTEND_URL=https://orbit-two-azure.vercel.app

MONGODB_URL=<mongodb-url>
REDIS_URL=<managed-redis-url>

AUTH_SERVICE_URL=https://orbit-auth.onrender.com
CHAT_SERVICE_URL=https://orbit-chat-d98e.onrender.com
BILLING_SERVICE_URL=https://orbit-billing.onrender.com

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

GOOGLE_API_KEY=<api-key>
GROQ_API_KEY=<api-key>
OPENROUTER_API_KEY=<api-key>

QDRANT_API_KEY=<api-key>
QDRANT_URL=<qdrant-url>
TAVILY_API_KEY=<api-key>
```

## Billing

``` env
MONGODB_URL=<mongodb-url>
AUTH_SERVICE_URL=https://orbit-auth.onrender.com

RAZORPAY_KEY_ID=<razorpay-key>
RAZORPAY_KEY_SECRET=<razorpay-secret>
```

## Chat

``` env
MONGODB_URL=<mongodb-url>
FRONTEND_URL=https://orbit-two-azure.vercel.app
```

## Auth

Firebase and database credentials are configured through Render
environment variables/secrets.

------------------------------------------------------------------------

# ❤️ Health Checks

Each backend service exposes a health endpoint:

``` text
/health
```

Gateway:

``` text
https://orbit-gateway-dtse.onrender.com/health
```

Auth:

``` text
https://orbit-auth.onrender.com/health
```

Chat:

``` text
https://orbit-chat-d98e.onrender.com/health
```

Agent:

``` text
https://orbit-agent.onrender.com/health
```

Billing:

``` text
https://orbit-billing.onrender.com/health
```

Healthy response:

``` json
{
  "status": "ok"
}
```

------------------------------------------------------------------------

# 🔄 Example End-to-End AI Request

A typical authenticated AI request follows this flow:

``` text
┌──────────────────────┐
│      React UI        │
└──────────┬───────────┘
           │
           │ POST /api/agent/...
           ▼
┌──────────────────────┐
│    API Gateway       │
│                      │
│ • CORS               │
│ • Authentication     │
│ • User context       │
│ • Proxying           │
└──────────┬───────────┘
           │
           │ x-user-id
           │ x-user-email
           │ Authorization
           ▼
┌──────────────────────┐
│    Agent Service     │
│                      │
│ • Agent selection    │
│ • AI orchestration   │
│ • Credits            │
│ • Retrieval          │
│ • Generation         │
└───────┬──────────────┘
        │
        ├──────────► AI Provider
        │
        ├──────────► Redis
        │
        ├──────────► MongoDB
        │
        └──────────► Cloudinary
```

------------------------------------------------------------------------

# 💳 Example Credit Flow

AI operations can be integrated with the billing system:

``` text
User
 │
 ▼
AI Request
 │
 ▼
Gateway Authentication
 │
 ▼
Agent Service
 │
 ▼
Check / Deduct Credits
 │
 ▼
Execute AI Operation
 │
 ▼
Store / Upload Result
 │
 ▼
Return Result
```

This provides a foundation for controlling AI usage and connecting model
operations with monetization.

------------------------------------------------------------------------

# 🧱 Design Principles

Orbit follows several engineering principles:

### 1. Separation of concerns

Authentication, AI, chat and billing are independent services.

### 2. Gateway-first API design

The frontend interacts with one public backend entry point.

### 3. Environment-driven configuration

Service URLs, credentials and infrastructure configuration are not
hardcoded.

### 4. Containerized deployment

Every backend service can be built and deployed independently using
Docker.

### 5. Extensible AI architecture

New agents can be added under the agent runtime without restructuring
the entire application.

### 6. Production-oriented infrastructure

The project uses managed services and cloud deployment rather than
relying only on localhost development.

------------------------------------------------------------------------

# 🔒 Security

Orbit follows basic production security practices including:

-   Helmet security headers
-   CORS configuration
-   authenticated gateway routes
-   environment-based secrets
-   user context propagation
-   rate limiting where configured
-   separation of public gateway and internal service responsibilities

### Never commit

``` text
.env
.env.*
serviceAccountKey.json
database credentials
Redis credentials
Cloudinary secrets
Razorpay secrets
AI provider API keys
```

Use Vercel and Render environment variables/secrets for production
credentials.

------------------------------------------------------------------------

# 🐛 Troubleshooting

## Gateway returns 502 Bad Gateway

Check:

1.  The downstream service is running.
2.  The corresponding service URL exists in the gateway environment.
3.  The URL is a complete `https://...` URL.
4.  The downstream `/health` endpoint responds successfully.
5.  The service is listening on `0.0.0.0` and Render's `PORT`.

Example:

``` text
Frontend
   ↓
Gateway
   ↓
502
   ↓
Check downstream service
```

------------------------------------------------------------------------

## `Invalid URL` / `undefined/save-message`

An error such as:

``` text
Invalid URL
input: 'undefined/save-message'
```

usually means a required environment variable is missing.

For example:

``` env
CHAT_SERVICE_URL=https://orbit-chat-d98e.onrender.com
```

must be available to the service making the request.

------------------------------------------------------------------------

## Frontend cannot reach backend

Check:

``` env
VITE_API_URL=https://orbit-gateway-dtse.onrender.com
```

Then redeploy the Vercel frontend.

------------------------------------------------------------------------

## Redis connection fails

Verify:

``` env
REDIS_URL=<managed-redis-url>
```

and make sure the Redis instance is reachable from Render.

------------------------------------------------------------------------

## MongoDB connection fails

Verify:

``` env
MONGODB_URL=<mongodb-url>
```

and confirm the database accepts connections from the deployed service.

------------------------------------------------------------------------

# 📊 Current Production Architecture

``` text
                          INTERNET
                              │
                              ▼
                  ┌─────────────────────┐
                  │      VERCEL         │
                  │   Orbit Frontend    │
                  │   React + Vite      │
                  └──────────┬──────────┘
                             │
                             │ HTTPS
                             ▼
                  ┌─────────────────────┐
                  │       RENDER        │
                  │    API Gateway      │
                  └──────────┬──────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
       ┌─────────┐      ┌─────────┐     ┌─────────┐
       │  AUTH   │      │  CHAT   │     │  AGENT  │
       └────┬────┘      └────┬────┘     └────┬────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                       ┌─────▼─────┐
                       │  BILLING  │
                       └───────────┘

          ┌──────────────┐     ┌──────────────┐
          │   MongoDB    │     │    Redis     │
          └──────────────┘     └──────────────┘

                       ┌──────────────┐
                       │  Cloudinary  │
                       └──────────────┘
```

------------------------------------------------------------------------

# 🚀 Roadmap

Potential future improvements:

-   [ ] Streaming AI responses
-   [ ] More specialized agents
-   [ ] Improved RAG pipelines
-   [ ] Background job processing
-   [ ] Observability and centralized logging
-   [ ] Automated integration tests
-   [ ] Better service-level metrics
-   [ ] Custom domains
-   [ ] CI/CD pipeline improvements
-   [ ] Autoscaling for high-demand services

------------------------------------------------------------------------

# 📚 What This Project Demonstrates

Orbit is more than a CRUD application. It demonstrates practical
full-stack and backend engineering concepts:

### Frontend Engineering

-   React component architecture
-   Vite
-   Redux state management
-   API integration
-   Authentication-aware UI
-   Multi-mode AI workspace

### Backend Engineering

-   Node.js
-   Express
-   REST APIs
-   middleware architecture
-   authentication
-   authorization
-   proxy-based API gateway
-   microservices
-   service-to-service communication
-   request context propagation

### AI Engineering

-   multi-agent architecture
-   model provider integration
-   retrieval/RAG workflows
-   vector search
-   multimodal generation
-   document generation
-   AI usage/credit management

### Infrastructure

-   Docker
-   Docker Compose
-   Render
-   Vercel
-   Redis
-   MongoDB
-   Cloudinary

### Payments

-   Razorpay
-   plans
-   credits
-   payment workflows

------------------------------------------------------------------------

# 🧑‍💻 Developer

**Govind Pathak**

Built as a full-stack AI platform to explore production-oriented
architecture, microservices, AI orchestration and cloud deployment.

### Project

GitHub:

https://github.com/govindpathak18/orbit

### Live Demo

https://orbit-two-azure.vercel.app

------------------------------------------------------------------------

# ⭐ If you find Orbit interesting

Star the repository and explore the architecture.

The project is designed to be extended --- new agents, providers,
integrations and services can be added without changing the fundamental
architecture.

------------------------------------------------------------------------

::: {align="center"}
### Built with ❤️ using React, Node.js, Docker, Redis, MongoDB and modern AI infrastructure.

**Orbit --- One workspace. Multiple AI capabilities.**
:::
