import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN || "https://checks.energy,https://www.checks.energy")
  .split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const norm = origin.replace(/\/$/, "");
    const ok = allowedOrigins.some(o => o.replace(/\/$/, "") === norm);
    return ok ? cb(null, true) : cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/health", async (req, res) => {
  try {
    const q = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, service: "checks-portal-api", db_time: q.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/v1/dashboard/summary", (req, res) => {
  res.json({
    kpis: { credits_available: 34, activities_open: 3, reports_available: 2, operators_active: 2 },
    generated_at: new Date().toISOString()
  });
});

app.get("/api/v1/activities", (req, res) => {
  res.json({
    items: [{ id: 5001, public_code: "AT-2026-00124", customer_reference_name: "Mario Rossi", status: "report_available", outcome: "compatible" }],
    total: 1
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Checks Portal API listening on ${port}`));
