// api/contact.js
const ALLOWED_ORIGINS = [
  "https://bakrhasan.vercel.app",
  // "https://your-custom-domain.com",   // أضفه لو اشتريت دومين لاحقًا
];

const LIMIT = 5;                         // أقصى عدد رسائل
const WINDOW_MS = 10 * 60 * 1000;        // خلال 10 دقائق لكل IP
const hits = new Map();

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const clean = (s) =>
  String(s ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();

const clientIp = (req) =>
  String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  (req.socket && req.socket.remoteAddress) ||
  "unknown";

function isLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {                 // تنظيف الذاكرة
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

const reply = (res, status, body) => res.status(status).json(body);

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // 1) POST فقط
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { ok: false, error: "method_not_allowed" });
  }

  // 2) الطلب لازم يجي من موقعك
  const origin = req.headers.origin || "";
  const isDev = process.env.VERCEL_ENV !== "production";
  const originOk =
    ALLOWED_ORIGINS.includes(origin) ||
    (isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin));
  if (!originOk) return reply(res, 403, { ok: false, error: "forbidden" });

  // 3) الإعدادات
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return reply(res, 500, { ok: false, error: "server_error" });
  }

  // 4) حد المعدّل
  if (isLimited(clientIp(req))) {
    res.setHeader("Retry-After", String(WINDOW_MS / 1000));
    return reply(res, 429, { ok: false, error: "rate_limited" });
  }

  // 5) قراءة الجسم
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return reply(res, 400, { ok: false, error: "bad_request" });
  }

  // 6) فخ البوتات: الحقل المخفي لو اتملى → نرد "نجاح" ولا نرسل شيئًا
  if (clean(body.hp_field)) return reply(res, 200, { ok: true });

  // 7) التحقق من البيانات
  const name = clean(body.name);
  const email = clean(body.email);
  let message = clean(body.message);

  if (!name || name.length > 100)
    return reply(res, 400, { ok: false, error: "invalid_name" });
  if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return reply(res, 400, { ok: false, error: "invalid_email" });
  if (message.length < 3 || message.length > 3000)
    return reply(res, 400, { ok: false, error: "invalid_message" });

  // حد تليجرام 4096 حرفًا، والتهريب يزيد الطول
  while (esc(message).length > 3500) message = message.slice(0, -100);

  const text =
    `<b>📩 رسالة جديدة من الموقع</b>\n\n` +
    `👤 <b>الاسم:</b> ${esc(name)}\n` +
    `📧 <b>الإيميل:</b> ${esc(email)}\n` +
    `💬 <b>الرسالة:</b>\n${esc(message)}`;

  // 8) الإرسال لتليجرام
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: controller.signal,
    });
    const data = await r.json().catch(() => ({}));

    if (!r.ok || !data.ok) {
      console.error("Telegram error:", r.status, data.description);
      return reply(res, 502, { ok: false, error: "upstream_error" });
    }
    return reply(res, 200, { ok: true });
  } catch (err) {
    console.error("Telegram request failed:", err && err.name);
    return reply(res, 502, { ok: false, error: "upstream_error" });
  } finally {
    clearTimeout(timer);
  }
};