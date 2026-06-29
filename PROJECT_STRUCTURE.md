# Project Structure

```
nestjs-api-middleware/
├── src/
│   ├── api-keys/                    # API Key Management Module
│   │   ├── dto/
│   │   │   ├── create-api-key.dto.ts
│   │   │   └── update-api-key.dto.ts
│   │   ├── entities/
│   │   │   └── api-key.entity.ts
│   │   ├── api-keys.controller.ts   # Admin endpoints for key management
│   │   ├── api-keys.service.ts      # Business logic for keys
│   │   └── api-keys.module.ts
│   ├── common/
│   │   └── guards/
│   │       └── api-key.guard.ts     # Authentication guard
│   ├── proxy/                       # Main Proxy Module
│   │   ├── proxy.controller.ts      # Handles all proxy requests
│   │   ├── proxy.service.ts         # Forwards requests to target API
│   │   └── proxy.module.ts
│   ├── database/
│   │   └── typeorm.config.ts        # TypeORM configuration
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application entry point
├── docker-compose.yml               # Local development setup
├── Dockerfile                       # Production container
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── README.md                       # Main documentation
├── USAGE_EXAMPLES.md              # API usage examples
├── DEPLOYMENT.md                  # Deployment guide
└── package.json
```

## Key Files

### API Key Management
- **api-key.entity.ts**: Database schema for API keys
- **api-keys.service.ts**: CRUD operations, validation, hashing
- **api-keys.controller.ts**: Admin API endpoints

### Security
- **api-key.guard.ts**: Validates API keys on every proxy request

### Proxy
- **proxy.controller.ts**: Catches all requests to `/proxy/*`
- **proxy.service.ts**: Forwards requests transparently to target API

### Configuration
- **typeorm.config.ts**: Database connection settings
- **app.module.ts**: Wires all modules together
- **.env**: Configuration values (DB, target API, rate limits)
