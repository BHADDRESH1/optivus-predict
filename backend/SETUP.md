# Backend Setup Instructions

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Setup)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/optivus`)
4. Update `backend/.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/optivus
   ```
5. Run the seed script:
   ```powershell
   npm run seed
   ```
6. Start the server:
   ```powershell
   npm run dev
   ```

## Option 2: Local MongoDB Installation

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service (usually runs automatically on Windows)
4. The default connection string in `.env` should work: `mongodb://localhost:27017/optivus`
5. Run the seed script:
   ```powershell
   npm run seed
   ```
6. Start the server:
   ```powershell
   npm run dev
   ```

## Option 3: Docker (if Docker is installed)

1. Start MongoDB container:
   ```powershell
   docker compose up -d mongo
   ```
2. Run the seed script:
   ```powershell
   npm run seed
   ```
3. Start the server:
   ```powershell
   npm run dev
   ```

## After Setup

The backend will run on: http://localhost:4000

### Sample Users Created by Seed Script:
- **Admin**: admin@optivus.com / password123
- **User**: john@optivus.com / password123
- **User**: sarah@optivus.com / password123
- **User**: mike@optivus.com / password123

### API Endpoints:
- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/items` - Get all items (protected)
- `POST /api/items` - Create item (protected)
- `GET /api/items/:id` - Get item by ID (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)

