<<<<<<< HEAD
# NestJS API Middleware

A production-ready NestJS middleware service for wrapping external APIs with API key authentication.

## Features

✅ API Key authentication (database-backed)  
✅ Request forwarding (transparent passthrough)  
✅ Rate limiting per API key  
✅ PostgreSQL + TypeORM  
✅ Docker Compose for local development  
✅ Admin API for key management  
✅ Key expiration support  
✅ Usage tracking  

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start with Docker

```bash
docker-compose up -d
```

### 3. Start Locally (without Docker)

```bash
# Install dependencies
npm install

# Start PostgreSQL (if not using Docker)
# Make sure PostgreSQL is running on localhost:5432

# Start the application
npm run start:dev
```

## API Endpoints

### Admin API (Key Management)

**Base URL:** `http://localhost:3000/admin/api-keys`

#### Create API Key
```bash
POST /admin/api-keys
Content-Type: application/json

{
  "name": "Mobile App",
  "serviceName": "my-mobile-app",
  "rateLimit": 100
}

Response:
{
  "message": "API Key created successfully. Save this key, it will not be shown again!",
  "apiKey": "abc123...",
  "details": { ... }
}
```

#### List All Keys
```bash
GET /admin/api-keys
```

#### Get Single Key
```bash
GET /admin/api-keys/:id
```

#### Update Key
```bash
PATCH /admin/api-keys/:id
Content-Type: application/json

{
  "isActive": false,
  "rateLimit": 50
}
```

#### Delete Key
```bash
DELETE /admin/api-keys/:id
```

### Proxy API (Main Usage)

**Base URL:** `http://localhost:3000/proxy`

All requests to `/proxy/*` will be forwarded to the target API.

#### Authentication

Include your API key in one of these ways:

**Option 1: Header (recommended)**
```bash
curl -H "X-API-Key: your_api_key_here" \
  http://localhost:3000/proxy/users
```

**Option 2: Authorization Bearer**
```bash
curl -H "Authorization: Bearer your_api_key_here" \
  http://localhost:3000/proxy/users
```

**Option 3: Query Parameter**
```bash
curl http://localhost:3000/proxy/users?api_key=your_api_key_here
```

## Configuration

Edit `.env` file:

```env
# Target API Configuration
TARGET_API_BASE_URL=https://api.example.com
TARGET_API_KEY=your_target_api_key_here

# Rate Limiting (requests per minute)
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Database Schema

### api_keys table
- `id` - UUID primary key
- `key` - Hashed API key (bcrypt)
- `name` - Human-readable name
- `serviceName` - Service identifier
- `isActive` - Enable/disable key
- `rateLimit` - Requests per minute
- `lastUsedAt` - Last usage timestamp
- `expiresAt` - Expiration date (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Development

```bash
# Development mode with hot-reload
npm run start:dev

# Build for production
npm run build

# Production mode
npm run start:prod

# Run tests
npm run test
```

## Security Notes

- API keys are hashed with bcrypt before storage
- Plain keys are only shown once during creation
- Rate limiting is enforced per API key
- Keys can be disabled without deletion
- Support for key expiration

## License

MIT
=======
# nestjs-api-middleware
nestjs-api-middleware
>>>>>>> e9b0463e4d2b1cbafd45d39a123355ec5125f785
