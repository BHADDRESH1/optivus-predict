# Quick Start Guide

## ⚠️ IMPORTANT: MongoDB Setup Required

The backend requires MongoDB to be running. Choose one option below:

### 🚀 Fastest Option: MongoDB Atlas (Free Cloud Database)

1. **Sign up for free MongoDB Atlas account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create account and free cluster (takes 2-3 minutes)

2. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/optivus`)

3. **Update `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/optivus
   ```

4. **Seed the database:**
   ```powershell
   npm run seed
   ```

5. **Start the server:**
   ```powershell
   npm run dev
   ```

### 📦 Alternative: Install MongoDB Locally

1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB service should start automatically
4. Run: `npm run seed` then `npm run dev`

---

## ✅ What's Already Done

- ✅ Backend dependencies installed
- ✅ `.env` file created with default settings
- ✅ Seed script created to populate database
- ✅ Backend server code ready
- ✅ API endpoints configured

## 📝 Next Steps

1. **Set up MongoDB** (choose one option above)
2. **Run seed script:** `npm run seed`
3. **Start backend:** `npm run dev`
4. **Backend will run on:** http://localhost:4000

## 🔑 Default Credentials (after seeding)

- **Admin:** admin@optivus.com / password123
- **User:** john@optivus.com / password123

## 🧪 Test the API

Once running, test the health endpoint:
```powershell
curl http://localhost:4000/health
```

Or visit in browser: http://localhost:4000/health

