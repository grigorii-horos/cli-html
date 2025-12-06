# User Management API Documentation

Version 2.0 | Last Updated: December 2025

---

> [!NOTE]
> This API uses RESTful principles and returns JSON responses.

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## Authentication

All API requests require authentication using an API key or JWT token.

### API Key Authentication

Include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.example.com/users
```

### OAuth 2.0

For OAuth 2.0 authentication, follow these steps:

1. Obtain authorization code
2. Exchange code for access token
3. Use access token in requests

> [!IMPORTANT]
> Never expose your API keys in client-side code or public repositories.

## Base URL

```
https://api.example.com/v2
```

## Endpoints

### Users

#### List Users

Get a paginated list of users.

**Endpoint:** `GET /users`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20, max: 100) |
| sort | string | No | Sort field (name, email, created_at) |
| order | string | No | Sort order (asc, desc) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### Get User

Retrieve a specific user by ID.

**Endpoint:** `GET /users/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User ID |

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-12-01T14:20:00Z"
}
```

#### Create User

Create a new user account.

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secure_password_123",
  "role": "user"
}
```

**Validation Rules:**

- [x] `name` - Required, 2-100 characters
- [x] `email` - Required, valid email format
- [x] `password` - Required, minimum 8 characters
- [x] `role` - Optional, one of: admin, user, guest

**Response:** `201 Created`

```json
{
  "id": 151,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "created_at": "2025-12-01T15:00:00Z"
}
```

#### Update User

Update an existing user.

**Endpoint:** `PUT /users/{id}`

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

**Response:** `200 OK`

> [!TIP]
> Use PATCH instead of PUT for partial updates to improve performance.

#### Delete User

Delete a user account.

**Endpoint:** `DELETE /users/{id}`

**Response:** `204 No Content`

> [!WARNING]
> This action is permanent and cannot be undone. Consider soft deletion for production systems.

### Authentication Endpoints

#### Login

Authenticate and receive an access token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### Logout

Invalidate the current access token.

**Endpoint:** `POST /auth/logout`

**Response:** `200 OK`

#### Refresh Token

Get a new access token using a refresh token.

**Endpoint:** `POST /auth/refresh`

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Common Error Codes

AUTHENTICATION_FAILED
:   Invalid credentials provided

INVALID_TOKEN
:   Access token is invalid or expired

RESOURCE_NOT_FOUND
:   Requested resource does not exist

VALIDATION_ERROR
:   Request data failed validation

RATE_LIMIT_EXCEEDED
:   Too many requests in a short time

## Rate Limiting

> [!CAUTION]
> Exceeding rate limits will result in 429 responses and temporary blocking.

### Limits

| Plan | Requests per Minute | Requests per Day |
|------|---------------------|------------------|
| Free | 60 | 1,000 |
| Basic | 300 | 10,000 |
| Pro | 1,000 | 100,000 |

### Rate Limit Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1701432000
```

## Examples

### Complete User CRUD Flow

```bash
# 1. Create a user
curl -X POST https://api.example.com/v2/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# 2. Get user details
curl https://api.example.com/v2/users/1 \
  -H "Authorization: Bearer YOUR_API_KEY"

# 3. Update user
curl -X PUT https://api.example.com/v2/users/1 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith"}'

# 4. Delete user
curl -X DELETE https://api.example.com/v2/users/1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### JavaScript/TypeScript Example

```typescript
const API_URL = 'https://api.example.com/v2';
const API_KEY = 'your_api_key';

async function getUsers(page: number = 1) {
  const response = await fetch(`${API_URL}/users?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

async function createUser(userData: any) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
}
```

### Python Example

```python
import requests

API_URL = 'https://api.example.com/v2'
API_KEY = 'your_api_key'

headers = {
    'Authorization': f'Bearer {API_KEY}'
}

# Get users
response = requests.get(f'{API_URL}/users', headers=headers)
users = response.json()

# Create user
new_user = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'password': 'secret123'
}
response = requests.post(
    f'{API_URL}/users',
    headers=headers,
    json=new_user
)
```

## SDKs

Official SDKs are available for:

- **JavaScript/TypeScript** - `npm install @example/api-client`
- **Python** - `pip install example-api-client`
- **PHP** - `composer require example/api-client`
- **Ruby** - `gem install example-api-client`

## Support

Need help? Contact us:

- Email: api-support@example.com
- Documentation: https://docs.example.com
- Status Page: https://status.example.com

---

*API Version 2.0 | © 2025 Example Corp*
