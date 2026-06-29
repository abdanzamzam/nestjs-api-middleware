# 🚀 Quick Start Guide

## Step 1: Setup Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Wait for PostgreSQL to be ready (about 5 seconds)
```

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your target API
# Required: TARGET_API_BASE_URL and TARGET_API_KEY
```

## Step 3: Start the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# The server will start on http://localhost:3000
```

## Step 4: Create Your First API Key

```bash
curl -X POST http://localhost:3000/admin/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test App",
    "serviceName": "test-service",
    "rateLimit": 100
  }'
```

**Save the returned `apiKey` value!** You won't see it again.

## Step 5: Test the Proxy

```bash
# Replace YOUR_API_KEY with the key from step 4
curl http://localhost:3000/proxy/your-endpoint \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## What Happens?

1. ✅ Your request hits the middleware at `http://localhost:3000/proxy/*`
2. ✅ The middleware validates your API key
3. ✅ Request is forwarded to `TARGET_API_BASE_URL/*`
4. ✅ Response is returned to you unchanged

---

## Next Steps

- Read [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for more API examples
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the codebase

---

## Troubleshooting

### Database connection error
- Make sure PostgreSQL is running: `docker-compose ps`
- Check `.env` database credentials

### "API key is required" error
- Make sure you're sending the API key in headers or query params
- Check spelling: `X-API-Key` (case-sensitive)

### Target API error
- Verify `TARGET_API_BASE_URL` in `.env`
- Check if `TARGET_API_KEY` is correct
- Test target API directly first

---

## Commands Cheat Sheet

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Docker (full stack)
docker-compose up -d

# Stop Docker
docker-compose down

# View logs
docker-compose logs -f app
```
