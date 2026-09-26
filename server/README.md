# Optivus Backend (minimal)

Quick steps to run the example backend (PowerShell):

```powershell
cd "c:/Users/MCB Mahesh/Downloads/copy-of-optivus (2)/server"
npm install
npm start
```

Server endpoints (demo):
- `GET /api/health` — health check
- `POST /api/login` — body: `{ username, password }`, returns a mock `token`
- Protected endpoints (send header `Authorization: Bearer <token>`):
  - `GET /api/equipment`, `POST /api/equipment`
  - `GET /api/maintenance`, `POST /api/maintenance`
  - `GET /api/reports`, `POST /api/reports`

Integration: update the frontend API URLs to `http://localhost:4000/api/...` or add a proxy.
