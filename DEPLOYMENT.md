# Deployment Guide

## Production Deployment

### 1. Environment Variables

Create a `.env` file with production values:

```env
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=api_middleware

# Target API
TARGET_API_BASE_URL=https://api.yourservice.com
TARGET_API_KEY=your-target-api-secret-key

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=1000
```

### 2. Database Setup

```bash
# Run migrations (TypeORM auto-creates tables in development)
# For production, disable synchronize and use migrations

# Create production database
psql -U postgres -c "CREATE DATABASE api_middleware;"
```

### 3. Build and Start

```bash
# Install production dependencies
npm ci --only=production

# Build
npm run build

# Start production server
npm run start:prod
```

### 4. Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/main.js --name api-middleware

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

---

## Docker Deployment

### Build and Push

```bash
# Build image
docker build -t your-registry/api-middleware:latest .

# Push to registry
docker push your-registry/api-middleware:latest
```

### Run with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  app:
    image: your-registry/api-middleware:latest
    env_file:
      - .env
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: always

volumes:
  postgres_data:
```

---

## Security Checklist

- [ ] Change default database credentials
- [ ] Use strong API keys (generated via admin API)
- [ ] Enable HTTPS (use reverse proxy like nginx)
- [ ] Set appropriate CORS origins
- [ ] Enable rate limiting
- [ ] Monitor API usage
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Disable TypeORM synchronize in production

---

## Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring

### Health Check Endpoint

Add to `src/app.controller.ts`:

```typescript
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date() };
}
```

### Logging

Use Winston or built-in NestJS logger for production logs.

---

## Backup Strategy

```bash
# Backup PostgreSQL database
pg_dump -U postgres api_middleware > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -U postgres api_middleware < backup_20260629_100000.sql
```
