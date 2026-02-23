# Render — checklist rapida
1. Create **Postgres** (prima il DB)
2. Create **Web Service** (repo backend)
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment:
   - NODE_ENV=production
   - DATABASE_URL=<Render Postgres Internal URL>
   - CORS_ORIGIN=https://checks.energy,https://www.checks.energy
6. Test:
   - /health
   - /api/v1/dashboard/summary
