/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Mock API de Magnus para el frontend.
 * Emula el backend real (ASP.NET Core) definido en el plan:
 *   - Prefijo /api/v1
 *   - Envelope de éxito: { data, meta }
 *   - Mock de autenticación (POST /auth/google devuelve un JWT falso)
 *   - Endpoints especiales: transactions/summary, gmail/sync, etc.
 *
 * Cuando exista el backend real, el frontend solo cambia EXPO_PUBLIC_API_URL.
 */
const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const db = router.db;
const middlewares = jsonServer.defaults({ logger: true });

const PORT = process.env.MOCK_PORT || 4000;
const PREFIX = "/api/v1";
const FAKE_TOKEN = "magnus-mock-jwt-token";
const FAKE_REFRESH = "magnus-mock-refresh-token";

const user = () => db.get("users").first().value();
const ok = (res, data, meta) => res.json(meta ? { data, meta } : { data });

/** Clave de mes "YYYY-MM". */
const monthKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/**
 * Fecha de referencia del mock: la transacción más reciente. Así el demo
 * funciona aunque el reloj real no coincida con los datos semilla.
 */
const refDate = () => {
  const dates = db
    .get("transactions")
    .filter((t) => !t.is_deleted)
    .map((t) => t.transaction_date)
    .value();
  if (!dates.length) return new Date().toISOString().slice(0, 10);
  return dates.reduce((a, b) => (a > b ? a : b));
};

/** Mes de referencia "YYYY-MM" basado en los datos. */
const refMonth = () => refDate().slice(0, 7);

/** Gastos (egresos) no eliminados del mes indicado. */
const expensesOfMonth = (month = refMonth()) =>
  db
    .get("transactions")
    .filter(
      (t) =>
        !t.is_deleted &&
        t.transaction_type === "expense" &&
        String(t.transaction_date).startsWith(month),
    )
    .value();

/** Ingresos no eliminados del mes indicado. */
const incomesOfMonth = (month = refMonth()) =>
  db
    .get("transactions")
    .filter(
      (t) =>
        !t.is_deleted &&
        t.transaction_type === "income" &&
        String(t.transaction_date).startsWith(month),
    )
    .value();

/** Total gastado (solo egresos) del mes. Nunca negativo. */
const spentOfMonth = (month = refMonth()) =>
  expensesOfMonth(month).reduce((s, t) => s + t.amount, 0);

/**
 * Total de ingresos adicionales del mes. Se suman al presupuesto definido
 * (aumentan el monto disponible) en lugar de descontarse del gastado.
 */
const incomeOfMonth = (month = refMonth()) =>
  incomesOfMonth(month).reduce((s, t) => s + t.amount, 0);

/** Días que faltan para terminar el mes de referencia (según su último día). */
const daysLeftInMonth = () => {
  const ref = refDate(); // "YYYY-MM-DD"
  const [y, m, d] = ref.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return Math.max(0, last - d);
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Latencia simulada para ver estados de carga reales en la app.
server.use((req, _res, next) => setTimeout(next, 250));

/* ----------------------------- AUTH (mock) ----------------------------- */
server.post(`${PREFIX}/auth/google`, (_req, res) =>
  ok(res, { token: FAKE_TOKEN, refresh_token: FAKE_REFRESH, user: user() }),
);
server.post(`${PREFIX}/auth/refresh`, (_req, res) =>
  ok(res, { token: FAKE_TOKEN, refresh_token: FAKE_REFRESH }),
);
server.delete(`${PREFIX}/auth/logout`, (_req, res) => res.status(204).end());
server.get(`${PREFIX}/auth/me`, (_req, res) => ok(res, user()));
server.get(`${PREFIX}/users/me`, (_req, res) => ok(res, user()));

/* ------------------------ TRANSACTIONS: summary ------------------------ */
server.get(`${PREFIX}/transactions/summary`, (_req, res) => {
  const txs = expensesOfMonth();
  const totalSpent = txs.reduce((sum, t) => sum + t.amount, 0);

  const byCategory = {};
  txs.forEach((t) => {
    byCategory[t.category_id] = (byCategory[t.category_id] || 0) + t.amount;
  });
  const categories = db.get("categories").value();
  const breakdown = Object.entries(byCategory)
    .map(([categoryId, amount]) => {
      const cat = categories.find((c) => c.id === categoryId);
      return {
        category_id: categoryId,
        category_name: cat ? cat.name : "Sin categoría",
        icon: cat ? cat.icon : "📦",
        color_hex: cat ? cat.color_hex : "#98A2B3",
        amount,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  ok(res, {
    total_spent: totalSpent,
    currency: "CRC",
    transaction_count: txs.length,
    by_category: breakdown,
  });
});

/* ------------------------- BUDGETS: mes actual ------------------------- */
server.get(`${PREFIX}/budgets/current`, (_req, res) => {
  const month = refMonth();
  const budget = db.get("budgets").find({ user_id: user().id, month }).value();
  ok(res, {
    id: budget ? budget.id : null,
    month,
    amount: budget ? budget.amount : 0,
    currency: budget ? budget.currency : "CRC",
    spent: spentOfMonth(month),
    income: incomeOfMonth(month),
    days_left: daysLeftInMonth(),
  });
});

server.put(`${PREFIX}/budgets/current`, (req, res) => {
  const month = refMonth();
  const amount = Number(req.body?.amount) || 0;
  const existing = db
    .get("budgets")
    .find({ user_id: user().id, month })
    .value();

  if (existing) {
    db.get("budgets").find({ id: existing.id }).assign({ amount }).write();
  } else {
    db.get("budgets")
      .push({
        id: `b${Date.now()}`,
        user_id: user().id,
        month,
        amount,
        currency: "CRC",
      })
      .write();
  }

  const budget = db.get("budgets").find({ user_id: user().id, month }).value();
  ok(res, {
    id: budget.id,
    month,
    amount: budget.amount,
    currency: budget.currency,
    spent: spentOfMonth(month),
    income: incomeOfMonth(month),
    days_left: daysLeftInMonth(),
  });
});

/* --------------------- TRANSACTIONS: alta manual ----------------------- */
server.post(`${PREFIX}/transactions`, (req, res) => {
  const body = req.body || {};
  const tx = {
    id: `t${Date.now()}`,
    user_id: user().id,
    category_id: body.category_id ?? null,
    amount: Number(body.amount) || 0,
    currency: body.currency || "CRC",
    description: body.description || "",
    merchant_name: body.merchant_name || "Movimiento manual",
    source: "manual",
    transaction_type: body.transaction_type === "income" ? "income" : "expense",
    transaction_date: body.transaction_date || refDate(),
    parsing_method: "manual",
    is_reviewed: true,
    is_deleted: false,
  };
  db.get("transactions").push(tx).write();
  res.status(201).json({ data: tx });
});

/* ------------------------------ GMAIL sync ----------------------------- */
server.get(`${PREFIX}/gmail/oauth/status`, (_req, res) =>
  ok(res, {
    connected: true,
    email: user().email,
    expires_at: "2026-07-27T12:00:00Z",
  }),
);

server.get(`${PREFIX}/gmail/sync/status`, (_req, res) => {
  const last = db
    .get("sync_jobs")
    .orderBy(["created_at"], ["desc"])
    .first()
    .value();
  ok(res, last || null);
});

server.get(`${PREFIX}/gmail/sync/history`, (_req, res) => {
  const jobs = db.get("sync_jobs").orderBy(["created_at"], ["desc"]).value();
  ok(res, jobs, { total: jobs.length });
});

server.post(`${PREFIX}/gmail/sync`, (_req, res) => {
  const now = new Date().toISOString();
  const job = {
    id: `sj${Date.now()}`,
    user_id: user().id,
    status: "completed",
    emails_fetched: Math.floor(Math.random() * 6) + 2,
    transactions_created: Math.floor(Math.random() * 4) + 1,
    error_message: null,
    started_at: now,
    completed_at: now,
    created_at: now,
  };
  db.get("sync_jobs").push(job).write();
  ok(res, job);
});

/* ---------------- Adaptador de query params BE -> json-server ---------- */
// El frontend usa los params del backend real (page, page_size, sort...).
// Los traducimos a los de json-server (_page, _limit, _sort, _order).
// Operamos sobre req.url porque el rewriter re-parsea el query string desde ahí.
server.use((req, _res, next) => {
  if (!req.url.startsWith(PREFIX)) return next();

  const url = new URL(req.url, "http://mock");
  const p = url.searchParams;
  const move = (from, to) => {
    if (p.has(from)) {
      p.set(to, p.get(from));
      p.delete(from);
    }
  };

  move("page", "_page");
  move("page_size", "_limit");
  move("date_from", "transaction_date_gte");
  move("date_to", "transaction_date_lte");

  if (p.has("sort")) {
    const s = p.get("sort");
    const desc = s.endsWith("_desc");
    p.set("_sort", s.replace(/_(desc|asc)$/, ""));
    p.set("_order", desc ? "desc" : "asc");
    p.delete("sort");
  }

  req.url = url.pathname + (p.toString() ? `?${p.toString()}` : "");
  next();
});

/* ----------------- Reescritura de recursos REST estándar --------------- */
server.use(
  jsonServer.rewriter({
    "/api/v1/trusted-senders": "/trusted_senders",
    "/api/v1/trusted-senders/:id": "/trusted_senders/:id",
    "/api/v1/transactions/search": "/transactions",
    "/api/v1/*": "/$1",
  }),
);

/* --------------------------- Envelope de salida ------------------------ */
router.render = (req, res) => {
  const data = res.locals.data;
  if (Array.isArray(data)) {
    const totalHeader = res.getHeader("X-Total-Count");
    const total = totalHeader != null ? Number(totalHeader) : data.length;
    const params = new URL(req.url, "http://mock").searchParams;
    const pageSize = Number(params.get("_limit")) || data.length || total;
    const page = Number(params.get("_page")) || 1;
    res.json({ data, meta: { page, page_size: pageSize, total } });
  } else {
    res.json({ data });
  }
};

server.use(router);

server.listen(PORT, () => {
  console.log(
    `\n🐶 Magnus mock API corriendo en http://localhost:${PORT}${PREFIX}\n`,
  );
});
