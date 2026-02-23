import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import crypto from "crypto";

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(express.json());

/* =========================
   CORS
========================= */
const allowedOrigins = (process.env.CORS_ORIGIN || "https://checks.energy,https://www.checks.energy")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // richieste server-to-server / browser senza origin
      if (!origin) return cb(null, true);

      const norm = origin.replace(/\/$/, "");
      const ok = allowedOrigins.some((o) => o.replace(/\/$/, "") === norm);

      return ok ? cb(null, true) : cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   DB
========================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/* =========================
   Auth config (server-side)
========================= */
const DASHBOARD_USER = process.env.DASHBOARD_USER || "demo";
const DASHBOARD_PASS = process.env.DASHBOARD_PASS || "demo123";
const AUTH_TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS || 1000 * 60 * 60 * 8); // 8h default

// store in-memory (ok per MVP/demo; su restart si azzera)
const sessionStore = new Map(); // token -> { username, expiresAt }

function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!m) {
    return res.status(401).json({ ok: false, error: "Missing Bearer token" });
  }

  const token = m[1].trim();
  const session = sessionStore.get(token);

  if (!session) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }

  if (Date.now() > session.expiresAt) {
    sessionStore.delete(token);
    return res.status(401).json({ ok: false, error: "Token expired" });
  }

  req.auth = {
    username: session.username,
    token,
    expiresAt: session.expiresAt,
  };

  next();
}

// pulizia periodica token scaduti
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessionStore.entries()) {
    if (session.expiresAt <= now) sessionStore.delete(token);
  }
}, 60 * 1000).unref();

/* =========================
   Public endpoints
========================= */
app.get("/health", async (req, res) => {
  try {
    const q = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, service: "checks-portal-api", db_time: q.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/v1/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "username and password are required" });
  }

  const userOk = safeEqual(username, DASHBOARD_USER);
  const passOk = safeEqual(password, DASHBOARD_PASS);

  if (!userOk || !passOk) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const token = createToken();
  const expiresAt = Date.now() + AUTH_TOKEN_TTL_MS;

  sessionStore.set(token, {
    username,
    expiresAt,
  });

  res.json({
    ok: true,
    token,
    token_type: "Bearer",
    expires_at: new Date(expiresAt).toISOString(),
    user: { username },
  });
});

app.post("/api/v1/auth/logout", requireAuth, (req, res) => {
  sessionStore.delete(req.auth.token);
  res.json({ ok: true });
});

app.get("/api/v1/auth/me", requireAuth, (req, res) => {
  res.json({
    ok: true,
    user: { username: req.auth.username },
    expires_at: new Date(req.auth.expiresAt).toISOString(),
  });
});

/* =========================
   Protected dashboard endpoints
========================= */
app.get("/api/v1/dashboard/summary", requireAuth, (req, res) => {
  res.json({
    kpis: {
      credits_available: 34,
      activities_open: 3,
      reports_available: 2,
      operators_active: 2,
    },
    generated_at: new Date().toISOString(),
    viewer: req.auth.username,
  });
});

app.get("/api/v1/activities", requireAuth, (req, res) => {
  res.json({
    items: [
      {
        id: 5001,
        public_code: "AT-2026-00124",
        customer_reference_name: "Mario Rossi",
        status: "report_available",
        outcome: "compatible",
      },
    ],
    total: 1,
  });
});

/* =========================
   Error handler (CORS / generic)
========================= */
app.use((err, req, res, next) => {
  console.error("API error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ ok: false, error: err.message || "Internal server error" });
});

/* =========================
   Start
========================= */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Checks Portal API listening on ${port}`);
});
