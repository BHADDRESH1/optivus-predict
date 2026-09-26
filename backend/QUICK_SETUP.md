# Quick Setup Guide

## MongoDB Atlas Connection

Your MongoDB connection string has been configured in `.env` file. You just need to add your password.

## Step 1: Update MongoDB Password

**Option A: Using PowerShell Script (Recommended)**
```powershell
.\start-server.ps1 -MongoPassword 'YOUR_ACTUAL_PASSWORD'
```

**Option B: Manual Update**
1. Open `.env` file in the backend folder
2. Find this line:
   ```
   MONGO_URI=mongodb+srv://bhaddreshamudala:<db_password>@cluster0.ib6gg2i.mongodb.net/optivus?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Replace `<db_password>` with your actual MongoDB Atlas password
4. Save the file

## Step 2: Start the Server

**Using the helper script:**
```powershell
.\start-server.ps1 -MongoPassword 'YOUR_PASSWORD'
```

**Or manually:**
```powershell
npm start
```

## Step 3: Verify Server is Running

Open your browser and visit:
- Health Check: http://localhost:4000/health
- API Base: http://localhost:4000/api

You should see:
```json
{"ok": true, "time": "2024-..."}
```

## Step 4: (Optional) Seed Database

To create sample users and data:
```powershell
npm run seed
```

This creates:
- Admin: `admin@optivus.com` / `password123`
- Technician: `john@optivus.com` / `password123`
- Supervisor: `sarah@optivus.com` / `password123`

## Troubleshooting

### Connection Error
If you see MongoDB connection errors:
1. Verify your password is correct
2. Check if your IP is whitelisted in MongoDB Atlas
3. Ensure your MongoDB cluster is running

### Port Already in Use
If port 4000 is already in use:
1. Change `PORT=4000` to another port in `.env`
2. Update frontend `VITE_API_URL` accordingly

## Frontend Connection

The frontend will automatically connect to `http://localhost:4000/api` if:
- Backend is running on port 4000
- No `VITE_API_URL` is set in frontend `.env`

To use a different port, set in frontend `.env`:
```
VITE_API_URL=http://localhost:YOUR_PORT/api
```

