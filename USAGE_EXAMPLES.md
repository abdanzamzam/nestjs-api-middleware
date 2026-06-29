# API Usage Examples

## 1. Create API Key

```bash
curl -X POST http://localhost:3000/admin/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Production",
    "serviceName": "mobile-app-prod",
    "rateLimit": 1000
  }'
```

**Response:**
```json
{
  "message": "API Key created successfully. Save this key, it will not be shown again!",
  "apiKey": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "details": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Mobile App Production",
    "serviceName": "mobile-app-prod",
    "rateLimit": 1000,
    "createdAt": "2026-06-29T10:00:00.000Z"
  }
}
```

⚠️ **Important:** Save the `apiKey` value immediately! It will not be shown again.

---

## 2. List All API Keys

```bash
curl http://localhost:3000/admin/api-keys
```

---

## 3. Using the Proxy

### Example: GET Request

```bash
# Using X-API-Key header (recommended)
curl -X GET http://localhost:3000/proxy/users \
  -H "X-API-Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"

# Using Authorization Bearer
curl -X GET http://localhost:3000/proxy/users \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"

# Using query parameter
curl -X GET "http://localhost:3000/proxy/users?api_key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
```

### Example: POST Request

```bash
curl -X POST http://localhost:3000/proxy/users \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Example: With Query Parameters

```bash
curl -X GET "http://localhost:3000/proxy/users?page=1&limit=10" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## 4. Update API Key

```bash
# Disable a key
curl -X PATCH http://localhost:3000/admin/api-keys/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'

# Change rate limit
curl -X PATCH http://localhost:3000/admin/api-keys/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "rateLimit": 500
  }'
```

---

## 5. Delete API Key

```bash
curl -X DELETE http://localhost:3000/admin/api-keys/123e4567-e89b-12d3-a456-426614174000
```

---

## Error Responses

### Missing API Key
```json
{
  "statusCode": 401,
  "message": "API key is required"
}
```

### Invalid API Key
```json
{
  "statusCode": 401,
  "message": "Invalid or expired API key"
}
```

### Rate Limit Exceeded
```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

---

## Integration Examples

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/proxy',
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Python (requests)

```python
import requests

headers = {
    'X-API-Key': 'YOUR_API_KEY'
}

# GET request
response = requests.get('http://localhost:3000/proxy/users', headers=headers)
users = response.json()

# POST request
data = {'name': 'John Doe', 'email': 'john@example.com'}
response = requests.post('http://localhost:3000/proxy/users', json=data, headers=headers)
```

### PHP (cURL)

```php
<?php
$apiKey = 'YOUR_API_KEY';

$ch = curl_init('http://localhost:3000/proxy/users');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$users = json_decode($response, true);

curl_close($ch);
?>
```

---

## Testing with Postman

1. **Create a new request**
2. **Set URL:** `http://localhost:3000/proxy/users`
3. **Add Header:**
   - Key: `X-API-Key`
   - Value: `YOUR_API_KEY`
4. **Send the request**

---

## Notes

- All requests to `/proxy/*` are forwarded to the target API configured in `.env`
- The middleware does not modify the request or response
- Rate limiting is per API key (configurable in database)
- API keys are hashed and cannot be retrieved after creation
- Use the admin API to manage keys (create, list, update, delete)
