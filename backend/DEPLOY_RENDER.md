# Orbit Backend on Render

This backend remains a Dockerized microservices app. Render should build each service from the monorepo using the existing Dockerfiles and the `backend` directory as the Docker build context so imports from `shared/` continue to work.

## Service Architecture

| Service | Type | Dockerfile | Context | Public | Port | Health |
| ------- | ---- | ---------- | ------- | ------ | ---- | ------ |
| Gateway | Web Service | `backend/gateway/Dockerfile` | `backend` | Yes | `8000` / `$PORT` | `/health` |
| Auth | Private Service | `backend/services/auth/Dockerfile` | `backend` | No | `8001` / `$PORT` | `/health` |
| Chat | Private Service | `backend/services/chat/Dockerfile` | `backend` | No | `8002` / `$PORT` | `/health` |
| Billing | Private Service | `backend/services/billing/Dockerfile` | `backend` | No | `8004` / `$PORT` | `/health` |
| Agent | Private Service | `backend/services/agent/Dockerfile` | `backend` | No | `8003` / `$PORT` | `/health` |
| Redis | Key Value | Managed | N/A | No | `6379` | N/A |

Only `orbit-gateway` should be public. All other HTTP services should be Render Private Services.

## Render Services

Create services in this order:

1. `orbit-redis` as a private Render Key Value/Redis-compatible datastore.
2. `orbit-auth` private service.
3. `orbit-chat` private service.
4. `orbit-billing` private service.
5. `orbit-agent` private service.
6. `orbit-gateway` public web service.

For each Docker service set:

- Docker build context: `backend`
- Dockerfile path: the path shown in the table above
- Health check path: `/health`
- Environment: `NODE_ENV=production`

The Blueprint can set `healthCheckPath` for the public gateway. Render's Blueprint spec documents HTTP health-check paths for web services, so configure private service health checks from the Render dashboard if your workspace exposes that setting for Private Services. Otherwise Render will use its default private-service process checks.

## Private URLs

After Render creates the private services, copy their internal/private URLs into these variables:

- Gateway: `AUTH_SERVICE_URL`, `CHAT_SERVICE_URL`, `AGENT_SERVICE_URL`, `BILLING_SERVICE_URL`
- Billing: `AUTH_SERVICE_URL`
- Agent: `AUTH_SERVICE_URL`, `CHAT_SERVICE_URL`, `BILLING_SERVICE_URL`

Use the Render private service hostnames. Do not use public URLs for service-to-service calls.

## Environment Variables by Service

Gateway:

- `NODE_ENV=production`
- `PORT=8000`
- `FRONTEND_URL=https://orbit-two-azure.vercel.app`
- `REDIS_URL`
- `AUTH_SERVICE_URL`
- `CHAT_SERVICE_URL`
- `AGENT_SERVICE_URL`
- `BILLING_SERVICE_URL`

Auth:

- `NODE_ENV=production`
- `PORT=8001`
- `FRONTEND_URL=https://orbit-two-azure.vercel.app`
- `COOKIE_SECURE=true`
- `MONGODB_URL`
- `REDIS_URL`
- `FIREBASE_SERVICE_ACCOUNT`

Chat:

- `NODE_ENV=production`
- `PORT=8002`
- `FRONTEND_URL=https://orbit-two-azure.vercel.app`
- `MONGODB_URL`

Billing:

- `NODE_ENV=production`
- `PORT=8004`
- `FRONTEND_URL=https://orbit-two-azure.vercel.app`
- `MONGODB_URL`
- `AUTH_SERVICE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Agent:

- `NODE_ENV=production`
- `PORT=8003`
- `FRONTEND_URL=https://orbit-two-azure.vercel.app`
- `MONGODB_URL`
- `REDIS_URL`
- `AUTH_SERVICE_URL`
- `CHAT_SERVICE_URL`
- `BILLING_SERVICE_URL`
- `GOOGLE_API_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `TAVILY_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The agent uses LangChain provider packages for Gemini, Groq, OpenRouter, Tavily, and Qdrant. Keep all provider keys on Render only.

## Firebase

Do not commit `serviceAccountKey.json`.

Preferred Render setup:

- Set `FIREBASE_SERVICE_ACCOUNT` on `orbit-auth` as the full service-account JSON string.

Alternative:

- Use a Render Secret File for the Firebase JSON and update the auth service to read that mounted path before deploying.

## Cloudinary

Cloudinary is used by the agent service. Configure only these server-side variables on `orbit-agent`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Do not add AWS S3 variables or S3 deployment configuration.

## Vercel Integration

The backend accepts the production frontend via:

```env
FRONTEND_URL=https://orbit-two-azure.vercel.app
```

After `orbit-gateway` is deployed, set the frontend environment variable in Vercel to the actual public Render gateway URL:

```env
VITE_SERVER_URL=https://<actual-render-gateway-url>
```

Do not point Vercel at any private Render service.

## Local Docker Compose

Local development still uses `backend/docker-compose.yml`:

```bash
cd backend
docker compose config
docker compose up --build
```

Then check:

```bash
curl http://localhost:8000/health
docker compose ps
```

The local Docker network uses service names such as `auth-service`, `chat-service`, `billing-service`, `agent-service`, and `redis`.

## GitHub Actions

Render should be connected directly to the GitHub repository. AWS/EC2 deployment workflows have been removed from this repo for the Render deployment path.

## Blueprint

The root `render.yaml` defines the Docker services, uses Render Key Value for Redis, and marks secret values as `sync: false`. You still need to fill secret values and private service URLs in Render after service creation.
