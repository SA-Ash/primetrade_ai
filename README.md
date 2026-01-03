# PrimeTrade Platform

A full-stack task management platform with role-based authentication, built with FastAPI and React.

## Project Overview

PrimeTrade is a production-ready web application demonstrating modern full-stack development practices. The platform features secure authentication, role-based access control (User/Admin), and complete CRUD operations for task management.

**Live Endpoints:**
- Backend API: http://localhost:8000
- Frontend UI: http://localhost:5173
- API Documentation: http://localhost:8000/docs

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: MongoDB (async via Motor)
- **Authentication**: JWT tokens with python-jose
- **Password Security**: bcrypt hashing via passlib
- **Server**: Uvicorn ASGI server
- **Logging**: Structured logging with structlog

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Forms**: Formik with Yup validation
- **Notifications**: React Toastify

### Infrastructure
- **Containerization**: Docker Compose
- **Cache/Sessions**: Redis (optional for JWT blacklisting)

## Features

### Authentication System
- User registration with email validation
- Secure login with JWT token generation
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Token-based session management

### Task Management (CRUD)
- Create tasks with title and description
- Read all tasks (users see own tasks, admins see all)
- Update existing tasks
- Delete tasks with ownership validation
- Pagination support for task listings

### Admin Features
- View all tasks across all users
- Manage any task regardless of ownership
- Access to admin-only endpoints

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- MongoDB 6.0 or higher
- Poetry (Python dependency management)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
poetry install
```

3. Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
```

4. Start MongoDB (if not using Docker):
```bash
mongod --dbpath /path/to/data
```

5. Run the backend server:
```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

### Docker Compose Setup (Recommended)

Run the entire stack with one command:

```bash
docker-compose up --build
```

This starts:
- FastAPI backend on port 8000
- React frontend on port 5173
- MongoDB on port 27017
- Redis on port 6379

## API Documentation

### Interactive Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

### Authentication Endpoints

#### Register User
```
POST /v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "user"
}

Response: 201 Created
{
  "user_id": "...",
  "email": "user@example.com",
  "role": "user",
  "access": {
    "access_token": "eyJ...",
    "expires_in": 3600
  },
  "created_at": "2026-01-03T12:00:00Z"
}
```

#### Login
```
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "access_token": "eyJ...",
  "expires_in": 3600
}
```

### Task Endpoints

All task endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your_token>
```

#### List Tasks
```
GET /v1/tasks?skip=0&limit=100

Response: 200 OK
[
  {
    "id": "...",
    "title": "Task title",
    "description": "Task description",
    "owner_id": "...",
    "status": "pending",
    "created_at": "2026-01-03T12:00:00Z"
  }
]
```

#### Create Task
```
POST /v1/tasks
Content-Type: application/json

{
  "title": "New task",
  "description": "Task details"
}

Response: 201 Created
```

#### Get Single Task
```
GET /v1/tasks/{task_id}

Response: 200 OK
```

#### Update Task
```
PATCH /v1/tasks/{task_id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}

Response: 200 OK
```

#### Delete Task
```
DELETE /v1/tasks/{task_id}

Response: 204 No Content
```

### Admin Endpoints

Requires admin role in JWT token.

#### List All Tasks (Admin Only)
```
GET /v1/admin/tasks?skip=0&limit=100

Response: 200 OK
```

## Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependency injection (auth guards)
│   │   ├── router.py            # Main router aggregator
│   │   └── v1/
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── tasks.py         # Task CRUD endpoints
│   │       └── admin.py         # Admin-only endpoints
│   ├── core/
│   │   ├── config.py            # Application configuration
│   │   ├── security.py          # JWT and password utilities
│   │   └── logging.py           # Structured logging setup
│   ├── crud/
│   │   ├── user.py              # User database operations
│   │   └── task.py              # Task database operations
│   ├── db/
│   │   └── database.py          # MongoDB connection and helpers
│   ├── models/
│   │   ├── user.py              # User data models
│   │   └── task.py              # Task data models
│   ├── schemas/
│   │   ├── auth.py              # Auth request/response schemas
│   │   ├── user.py              # User schemas
│   │   └── task.py              # Task schemas
│   ├── services/
│   │   └── token.py             # JWT token generation
│   └── main.py                  # FastAPI application entry point
├── pyproject.toml               # Poetry dependencies
└── poetry.lock
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login interface
│   │   ├── RegisterPage.tsx     # Registration interface
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── TasksPage.tsx        # Task management interface
│   ├── services/
│   │   └── api.ts               # API client wrapper
│   ├── utils/
│   │   └── auth.ts              # Auth utilities and localStorage
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── package.json
└── vite.config.ts
```

## Security Features

### Authentication Security
- Passwords hashed using bcrypt with configurable rounds
- JWT tokens signed with HS256 (configurable to RS256 for production)
- Token expiration enforcement
- Email validation using RFC 5322 regex
- Password complexity requirements (minimum 8 characters)

### Authorization
- Role-based access control (RBAC)
- JWT payload includes user role for authorization decisions
- Dependency injection guards for protected routes
- Admin-only endpoints with role verification
- Task ownership validation for CRUD operations

### API Security
- CORS configuration with allowed origins
- Request validation via Pydantic models
- Structured error handling without sensitive data leakage
- Input sanitization to prevent injection attacks

### Frontend Security
- JWT tokens stored in localStorage with XSS mitigation
- Axios interceptors for automatic token injection
- Automatic logout on token expiration
- Protected routes with authentication checks
- Role-based UI rendering

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  hashed_password: String,
  role: String ("user" | "admin"),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  owner_id: String (references User._id),
  status: String ("pending" | "in_progress" | "done"),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Indexes
- Users: Unique index on `email`, index on `role`
- Tasks: Compound index on `(owner_id, status)` for efficient filtering

## Testing

### Backend Tests
```bash
cd backend
poetry run pytest
```

Tests cover:
- Authentication flows (register, login)
- JWT token generation and validation
- Task CRUD operations
- Authorization guards
- Database operations

### Frontend Tests
```bash
cd frontend
npm run test
```

Tests cover:
- Component rendering
- Form validation
- Protected route behavior
- API integration

## Scalability Considerations

### Horizontal Scaling
- **Stateless API Design**: FastAPI backend is fully stateless with JWT authentication, enabling horizontal scaling across multiple instances behind a load balancer
- **Load Balancing**: Use Nginx or AWS ALB to distribute traffic across multiple backend instances
- **Session Management**: Redis integration ready for distributed session storage and JWT blacklisting across instances

### Database Scaling
- **MongoDB Sharding**: Tasks collection can be sharded by `owner_id` hash for horizontal data distribution
- **Read Replicas**: MongoDB replica sets for read scaling and high availability
- **Connection Pooling**: Motor async driver with connection pooling for efficient database access
- **Indexing Strategy**: Compound indexes on frequently queried fields to optimize query performance

### Caching Strategy
- **Redis Integration**: Ready for caching frequently accessed data (user profiles, task lists)
- **API Response Caching**: Implement cache headers for GET endpoints
- **Database Query Caching**: Cache expensive aggregation queries with TTL

### Microservices Architecture
- **Service Decomposition**: Current monolithic structure can be split into:
  - Authentication Service (user management, JWT issuance)
  - Task Service (CRUD operations)
  - Admin Service (analytics, reporting)
- **API Gateway**: Kong or AWS API Gateway for routing, rate limiting, and authentication
- **Event-Driven Communication**: Use message queues (RabbitMQ, Kafka) for inter-service communication
- **Service Mesh**: Istio or Linkerd for service-to-service security and observability

### Performance Optimization
- **Async Operations**: FastAPI with async/await for non-blocking I/O operations
- **Database Query Optimization**: Projection queries to fetch only required fields
- **Pagination**: Implemented for task listings to prevent large payload transfers
- **CDN Integration**: Serve static frontend assets via CloudFront or Cloudflare
- **Compression**: Enable gzip compression for API responses

### Monitoring and Observability
- **Structured Logging**: Centralized logging with correlation IDs for request tracing
- **Metrics Collection**: Prometheus for API metrics, response times, error rates
- **Distributed Tracing**: OpenTelemetry integration for request flow visualization
- **Health Checks**: Endpoint monitoring for load balancer health checks

### Infrastructure as Code
- **Container Orchestration**: Kubernetes for automated deployment, scaling, and management
- **Auto-Scaling**: Horizontal Pod Autoscaler based on CPU/memory metrics
- **CI/CD Pipeline**: GitHub Actions for automated testing, building, and deployment
- **Blue-Green Deployment**: Zero-downtime deployments with traffic shifting

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
REDIS_URL=redis://localhost:6379
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Production Deployment

### Backend Deployment Checklist
1. Change JWT_SECRET to a strong random value
2. Use RS256 algorithm with public/private key pair
3. Enable HTTPS with valid SSL certificates
4. Configure CORS with specific production origins
5. Set up MongoDB with authentication enabled
6. Enable Redis for session management
7. Configure structured logging to external service
8. Set up monitoring and alerting
9. Enable rate limiting
10. Use environment-specific configuration

### Frontend Deployment Checklist
1. Build production bundle: `npm run build`
2. Serve via CDN or static hosting (Vercel, Netlify)
3. Configure environment variables for production API
4. Enable HTTPS
5. Set up error tracking (Sentry)
6. Configure CSP headers
7. Enable asset compression

## License

This project is for educational and demonstration purposes.

## Repository

GitHub: https://github.com/yourusername/primetrade
