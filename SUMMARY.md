# 📋 Project Summary

**Project:** NestJS API Middleware  
**Created:** 2026-06-29  
**Status:** ✅ Ready to use

---

## 🎯 What Is This?

A **production-ready NestJS middleware** that wraps external APIs with API key authentication. Your services hit this middleware with their API keys, and the middleware forwards requests to your target API transparently.

---

## ✨ Features

✅ **API Key Authentication** - Database-backed with bcrypt hashing  
✅ **Transparent Passthrough** - Requests/responses forwarded unchanged  
✅ **Rate Limiting** - Configurable per API key  
✅ **PostgreSQL + TypeORM** - Robust data persistence  
✅ **Admin API** - Full CRUD for API key management  
✅ **Docker Ready** - docker-compose for local dev  
✅ **Key Expiration** - Optional expiration dates  
✅ **Usage Tracking** - Last used timestamps  
✅ **Enable/Disable Keys** - Without deletion  

---

## 📂 Project Location

```
~/Documents/app-dev/nestjs-api-middleware/
```

---

## 🏗️ Architecture

```
Client App (with your API key)
       ↓
[NestJS Middleware]
  - Validates API key from database
  - Checks rate limit
  - Forwards request
       ↓
Target API (with target API key)
       ↓
Response forwarded back unchanged
```

---

## 🚀 Quick Start

```bash
cd ~/Documents/app-dev/nestjs-api-middleware

# Setup
cp .env.example .env
docker-compose up -d postgres

# Start
npm run start:dev

# Create API key
curl -X POST http://localhost:3000/admin/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","serviceName":"test","rateLimit":100}'

# Use it
curl http://localhost:3000/proxy/endpoint \
  -H "X-API-Key: YOUR_KEY"
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Main documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 steps
- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - API usage examples
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code structure

---

## 🔑 API Endpoints

### Admin API (Key Management)
- `POST /admin/api-keys` - Create new API key
- `GET /admin/api-keys` - List all keys
- `GET /admin/api-keys/:id` - Get single key
- `PATCH /admin/api-keys/:id` - Update key (disable, change rate limit)
- `DELETE /admin/api-keys/:id` - Delete key

### Proxy API (Main Usage)
- `ALL /proxy/*` - Forward any HTTP method to target API

---

## 🛠️ Tech Stack

- **NestJS** - Framework
- **PostgreSQL** - Database
- **TypeORM** - ORM
- **Axios** - HTTP client
- **bcrypt** - Password hashing
- **@nestjs/throttler** - Rate limiting
- **class-validator** - Validation
- **Docker** - Containerization

---

## 🔒 Security Features

- API keys hashed with bcrypt before storage
- Plain keys shown only once during creation
- Rate limiting per API key
- Key expiration support
- Enable/disable without deletion
- CORS enabled (configurable)
- Input validation with class-validator

---

## 📊 Database Schema

```sql
api_keys
├── id (UUID)
├── key (hashed)
├── name
├── serviceName
├── isActive
├── rateLimit (requests/min)
├── lastUsedAt
├── expiresAt
├── createdAt
└── updatedAt
```

---

## 🎛️ Configuration (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=api_middleware

# Target API
TARGET_API_BASE_URL=https://api.example.com
TARGET_API_KEY=your_target_api_key

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## ✅ Next Steps

1. **Configure target API** - Edit `.env` with your real API URL and key
2. **Start PostgreSQL** - `docker-compose up -d postgres`
3. **Run the app** - `npm run start:dev`
4. **Create API keys** - Use admin API to generate keys
5. **Test it** - Send requests through `/proxy/*`
6. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for production

---

## 🤝 Usage Flow

1. Your service/app sends request to middleware with API key
2. Middleware validates key against database
3. If valid, middleware forwards request to target API
4. Target API responds
5. Middleware returns response unchanged to your service

---

## 📝 Example Integration

```typescript
// JavaScript/TypeScript
const response = await fetch('http://localhost:3000/proxy/users', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});
```

---

## 💡 Tips

- **Multiple services?** Create separate API keys for each
- **Need analytics?** Check `lastUsedAt` field in database
- **Rate limiting** Configure per key in database
- **Security** Always use HTTPS in production (nginx/reverse proxy)
- **Monitoring** Add health check endpoint for uptime monitoring

---

## 📞 Support

Check documentation files for detailed guides, or inspect the code:
- Services: `src/api-keys/` and `src/proxy/`
- Guards: `src/common/guards/`
- Config: `src/database/typeorm.config.ts`

---

**Project is ready to use! 🎉**
