# OPTIVUS Backend

Complete backend API for the OPTIVUS Hospital Equipment Maintenance Management System.

## Features

- ✅ User Authentication & Authorization (JWT)
- ✅ User Management (CRUD)
- ✅ Equipment Management (CRUD)
- ✅ Task/Maintenance Task Management
- ✅ Alert & Escalation System
- ✅ Maintenance History/Logs
- ✅ Reports & Analytics
- ✅ Calendar Integration
- ✅ AI Verification System
- ✅ Role-Based Access Control

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests
- **Morgan** for request logging
- **express-rate-limit** for rate limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=4000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/optivus
   JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
   CORS_ORIGIN=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=100
   ```

5. **Start MongoDB:**
   - If using local MongoDB, ensure it's running
   - If using MongoDB Atlas, update `MONGO_URI` with your connection string

6. **Seed database (optional):**
   ```bash
   npm run seed
   ```

7. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:4000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── equipmentController.js
│   │   ├── taskController.js
│   │   ├── alertController.js
│   │   ├── maintenanceLogController.js
│   │   ├── reportsController.js
│   │   ├── calendarController.js
│   │   └── aiVerificationController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Request validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Equipment.js
│   │   ├── Task.js
│   │   ├── Alert.js
│   │   └── MaintenanceLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── items.js
│   │   ├── equipment.js
│   │   ├── tasks.js
│   │   ├── alerts.js
│   │   ├── maintenanceLogs.js
│   │   ├── reports.js
│   │   ├── calendar.js
│   │   └── aiVerification.js
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   └── utils/
│       └── token.js           # JWT utilities
├── server.js                  # Main server file
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create equipment (Admin/Supervisor)
- `PUT /api/equipment/:id` - Update equipment (Admin/Supervisor)
- `DELETE /api/equipment/:id` - Delete equipment (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task (Admin/Supervisor)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create alert (Admin/Supervisor)
- `POST /api/alerts/check-overdue` - Check and create alerts for overdue tasks
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert (Admin only)

### Maintenance Logs
- `GET /api/maintenance-logs` - Get all maintenance logs
- `GET /api/maintenance-logs/:id` - Get maintenance log by ID
- `POST /api/maintenance-logs` - Create maintenance log
- `PUT /api/maintenance-logs/:id` - Update maintenance log
- `DELETE /api/maintenance-logs/:id` - Delete maintenance log (Admin only)

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics
- `GET /api/reports/compliance` - Get compliance report
- `GET /api/reports/equipment` - Get equipment report
- `GET /api/reports/tasks` - Get task report

### Calendar
- `GET /api/calendar/events` - Get calendar events
- `GET /api/calendar/upcoming` - Get upcoming events

### AI Verification
- `GET /api/ai-verification/pending` - Get pending verifications (Admin/Supervisor)
- `POST /api/ai-verification/verify/:taskId` - Verify task (Admin/Supervisor)

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after 15 minutes. Use the refresh token to get a new access token.

## Roles & Permissions

- **Admin**: Full access to all features
- **Hospital Head**: View-only access to most features
- **Supervisor**: Can manage tasks, equipment, and users (except delete)
- **Technician**: Can view and update assigned tasks only

## Database Models

### User
- Authentication and user profile information
- Roles: Admin, Hospital Head, Supervisor, Technician

### Equipment
- Hospital equipment/asset information
- Tracks service dates, status, vendor info

### Task
- Maintenance tasks assigned to technicians
- Tracks status, due dates, AI verification

### Alert
- System alerts and escalations
- Auto-generated for overdue tasks

### MaintenanceLog
- Historical maintenance records
- Tracks parts, costs, duration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `CORS_ORIGIN` | Allowed CORS origin | * |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 60000 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## Frontend Integration

The frontend should connect to the backend using the base URL:
```
http://localhost:4000/api
```

Set the environment variable in your frontend:
```env
VITE_API_URL=http://localhost:4000/api
```

## Development

### Running in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reload on file changes.

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique secrets for JWT tokens
3. Configure proper CORS origins
4. Use MongoDB Atlas or a managed MongoDB service
5. Set up proper rate limiting
6. Enable HTTPS
7. Use environment variables for all sensitive data

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGO_URI` is correct
- Verify network connectivity

### Authentication Issues
- Check JWT secrets are set correctly
- Verify token expiration times
- Ensure Authorization header format is correct

### CORS Issues
- Update `CORS_ORIGIN` in `.env`
- Ensure frontend URL matches CORS origin

## License

MIT

## Support

For issues and questions, please contact the development team.
