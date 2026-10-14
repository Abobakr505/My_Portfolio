gsap.to(".hero__ring", {
  y: 100,
  duration: 1.5,
  ease: "power2.out",
  repeat: -1,
  rotate: 360,
  yoyo: true,
  scale: 1.1,
});

gsap.to(".hero__asterisk", {
  y: 100,
  x: 100,
  duration: 3,
  ease: "bonace.out",
  repeat: -1,
  yoyo: true,
  scale: 1.1,
    rotate: 360,
});

let pageTitle = document.title;
window.addEventListener("blur", () => {
  document.title = " Return to Website ❤️ ";
});

window.addEventListener("focus", () => {
  document.title = pageTitle;
});

// ===== Preloader =====
(function () {
  const el = document.getElementById("preloader");
  if (!el) return;

  const countEl = document.getElementById("plCount");
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MIN_TIME = reduce ? 300 : 1600;   // أقل مدة عرض
  const MAX_TIME = 8000;                  // أمان: لا تعلق أكثر من هذا

  root.classList.add("is-loading");

  let loaded = document.readyState === "complete";
  window.addEventListener("load", () => (loaded = true));

  const start = performance.now();
  let shown = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    el.classList.add("is-done");                       // يتلاشى المحتوى

    setTimeout(() => {
      el.classList.add("is-exit");                     // ترتفع الشاشة

      // الهيرو يبدأ حركته والستارة ترتفع
      setTimeout(() => {
        window.__preloaderDone = true;
        document.dispatchEvent(new Event("preloader:done"));
      }, reduce ? 0 : 450);

      setTimeout(() => {
        el.remove();
        root.classList.remove("is-loading");
      }, reduce ? 350 : 1000);
    }, reduce ? 0 : 450);
  };

  const render = () => {
    countEl.textContent = Math.round(shown);
    el.style.setProperty("--p", shown / 100);
  };

  const tick = (now) => {
    const t = now - start;
    const ratio = Math.min(t / MIN_TIME, 1);
    const target = loaded ? ratio * 100 : ratio * 90;  // يقف عند 90% حتى يكتمل التحميل

    shown += (target - shown) * 0.15;
    render();

    if ((loaded && shown >= 99.5) || t > MAX_TIME) {
      shown = 100;
      render();
      finish();
      return;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
})();

const progressCircle = document.getElementById("progressCircle");
const circumference = progressCircle.getTotalLength();
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

// ===== Scroll to top =====
(function () {
  const btn = document.getElementById("scrollTop");
  const ring = document.getElementById("progressCircle");
  const pct = document.getElementById("scrollPct");
  const bar = document.getElementById("scrollProgressBar");
  if (!btn || !ring) return;

  const length = ring.getTotalLength();
  ring.style.strokeDasharray = length;
  ring.style.strokeDashoffset = length;

  let ticking = false;

  const update = () => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const p = max > 0 ? Math.min(top / max, 1) : 0;

    ring.style.strokeDashoffset = length * (1 - p);
    if (pct) pct.textContent = Math.round(p * 100);
    if (bar) {
  bar.style.setProperty("--p", p);
  bar.classList.toggle("is-active", p > 0.003);
  bar.classList.toggle("is-complete", p > 0.995);
}     // شريط التقدّم العلوي (كان في الكود القديم)

    btn.classList.toggle("show", top > 200);
    btn.classList.toggle("is-complete", p > 0.98);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    btn.classList.add("is-go");
    setTimeout(() => btn.classList.remove("is-go"), 700);

    if (typeof butter !== "undefined" && typeof butter.scrollTo === "function") {
      butter.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
})();
document.getElementById("linky").addEventListener("click", (e) => {
  e.preventDefault();

  // 1. تأكد من تطابق الـ ID مع قسم الاتصال
  const contactSection = document.getElementById("contact");

  if (contactSection) {
    // 2. احسب الموقع بدقة مع وجود هيدر ثابت (إذا وجد)
    const offset = contactSection.offsetTop - 100; // اطرح ارتفاع الهيدر إن وجد

    if (typeof butter !== "undefined" && butter.scrollTo) {
      butter.scrollTo(offset);
    } else {
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  } else {
    console.error("عنصر الـ contact غير موجود!");
  }
});


// تعطيل النقر بزر الماوس الأيمن
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

// تعطيل تحديد النص والسحب
document.addEventListener("selectstart", function(e) {
  e.preventDefault();
});
document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});

// تعطيل الاختصارات الخاصة بالنسخ (مثل Ctrl+C, Ctrl+V, Ctrl+U, ...)
// يُنصح بإضافة المزيد من الاختصارات حسب الحاجة
document.addEventListener("keydown", function(e) {
  // منع (Ctrl+C), (Ctrl+V), (Ctrl+U) و (F12)
  if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "u")) {
    e.preventDefault();
  }
  // منع F12 (فتح أدوات المطور)
  if (e.keyCode === 123) {
    e.preventDefault();
  }
});

// ===== Services & Reviews sliders =====
document.addEventListener("DOMContentLoaded", () => {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initSlider(selector, cardSelector) {
    const slider = document.querySelector(selector);
    if (!slider) return;

    new Splide(selector, {
      type: "loop",
      perPage: 3,
      gap: "1.5rem",
      autoplay: !reduce,
      interval: 3500,
      pauseOnHover: true,
      arrows: false,
      pagination: true,
      breakpoints: {
        1024: { perPage: 2 },
        640: { perPage: 1 },
      },
    }).mount();

    // بعد mount حتى تُحسب النسخ المكرّرة (clones) أيضًا
    const cards = slider.querySelectorAll(cardSelector);

    if (!canHover || reduce) return;

    // بقعة ضوء تتبع المؤشر
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    // ميل 3D
    if (typeof VanillaTilt !== "undefined") {
      VanillaTilt.init(cards, {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
      });
    }
  }

  initSlider("#services", ".service-card");
  initSlider("#reviews", ".review-card");
});
// ===== Send Contact Form to Telegram =====
const TELEGRAM_BOT_TOKEN = "8616720811:AAH3fmGsv605vfUuHqT9tHNzG82wIfDxNog"; // مثال: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
const TELEGRAM_CHAT_ID   = "7321445096"; // مثال: 123456789

// ===== Contact form → Telegram =====
// ===== Contact form → Telegram (toast) =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact__form");
  if (!form) return;

  const submitBtn = document.getElementById("form_button");
  const COOLDOWN_MS = 30000;
  const STORAGE_KEY = "lastContactSend";

  // ---------- Toast ----------
  const wrap = document.createElement("div");
  wrap.className = "tst-wrap";
  document.body.appendChild(wrap);

  const ICONS = {
    loading: "fa-paper-plane",
    success: "fa-check",
    error: "fa-xmark",
    info: "fa-clock",
  };

  let current = null;

  const hideToast = (el) => {
    if (!el || el.classList.contains("is-out")) return;
    el.classList.add("is-out");
    const remove = () => {
      el.remove();
      if (current === el) current = null;
    };
    el.addEventListener("animationend", remove, { once: true });
    setTimeout(remove, 400);               // احتياط لو لم يعمل animationend
  };

  const toast = ({ type, title, text = "", duration = 0, actionLabel, onAction }) => {
    const isNew = !current;
    const el = current || document.createElement("div");
    current = el;

    el.className = `tst tst--${type}`;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.replaceChildren();

    // الأيقونة
    const icon = document.createElement("span");
    icon.className = "tst__icon";
    icon.innerHTML = `<i class="fa-solid ${ICONS[type]}"></i>`;

    // النص (textContent: آمن حتى لو كتب الزائر HTML في اسمه)
    const body = document.createElement("div");
    body.className = "tst__body";
    const t = document.createElement("b");
    t.className = "tst__title";
    t.textContent = title;
    body.appendChild(t);
    if (text) {
      const p = document.createElement("p");
      p.className = "tst__text";
      p.textContent = text;
      body.appendChild(p);
    }

    el.append(icon, body);

    // زر الإجراء
    if (actionLabel) {
      const act = document.createElement("button");
      act.type = "button";
      act.className = "tst__btn";
      act.textContent = actionLabel;
      act.addEventListener("click", () => {
        hideToast(el);
        onAction && onAction();
      });
      el.appendChild(act);
    }

    // زر الإغلاق (ليس أثناء الإرسال)
    if (type !== "loading") {
      const close = document.createElement("button");
      close.type = "button";
      close.className = "tst__close";
      close.setAttribute("aria-label", "Close");
      close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      close.addEventListener("click", () => hideToast(el));
      el.appendChild(close);
    }

    // شريط الوقت: عند انتهائه يُغلق التوست
    if (duration) {
      const bar = document.createElement("span");
      bar.className = "tst__bar";
      bar.style.animationDuration = duration + "ms";
      bar.addEventListener("animationend", () => hideToast(el), { once: true });
      el.appendChild(bar);
    }

    if (isNew) {
      wrap.appendChild(el);
    } else {
      // تحديث في المكان: حركة "pop" خفيفة
      el.classList.add("is-swap");
      setTimeout(() => el.classList.remove("is-swap"), 350);
    }
    return el;
  };

  const showSending = () =>
    toast({ type: "loading", title: "Sending your message…", text: "Just a moment, it's on its way." });

  const showSuccess = (name) =>
    toast({
      type: "success",
      title: "Message sent!",
      text: `Thanks${name ? ", " + name : ""}! I'll get back to you soon.`,
      duration: 5000,
    });

  const showError = (reason, retry) =>
    toast({
      type: "error",
      title: "Couldn't send your message",
      text: reason,
      duration: 8000,
      actionLabel: "Retry",
      onAction: retry,
    });

  const showWait = (seconds) =>
    toast({
      type: "info",
      title: "Hold on a moment",
      text: `Please wait ${seconds}s before sending another message.`,
      duration: 4000,
    });

  // ---------- Helpers ----------
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const getLast = () => {
    try { return +localStorage.getItem(STORAGE_KEY) || 0; } catch { return 0; }
  };
  const setLast = () => {
    try { localStorage.setItem(STORAGE_KEY, Date.now()); } catch {}
  };

  // ---------- Send ----------
  const send = async ({ name, email, message }) => {
    const text =
      `<b>📩 رسالة جديدة من الموقع</b>\n\n` +
      `👤 <b>الاسم:</b> ${esc(name)}\n` +
      `📧 <b>الإيميل:</b> ${esc(email)}\n` +
      `💬 <b>الرسالة:</b>\n${esc(message.slice(0, 3000))}`;

    submitBtn.disabled = true;
    showSending();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
          signal: controller.signal,
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error("api");

      setLast();
      form.reset();
      showSuccess(name);
    } catch (err) {
      const reason =
        err.name === "AbortError"
          ? "The request took too long. Check your connection and try again."
          : !navigator.onLine
          ? "You seem to be offline. Check your connection and try again."
          : "Something went wrong. Please try again in a moment.";
      showError(reason, () => send({ name, email, message }));
    } finally {
      clearTimeout(timeout);
      submitBtn.disabled = false;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const wait = Math.ceil((COOLDOWN_MS - (Date.now() - getLast())) / 1000);
    if (wait > 0) return showWait(wait);

    send({
      name: form.user_name.value.trim(),
      email: form.user_email.value.trim(),
      message: form.message.value.trim(),
    });
  });
});

// ===== Skills: level + count-up + spotlight =====
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".skills__item");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const countUp = (el, target) => {
    if (reduce) { el.textContent = target + "%"; return; }
    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + "%";
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  items.forEach((item) => {
    const level = parseFloat(getComputedStyle(item).getPropertyValue("--level")) || 0;
    const label = item.querySelector(".skills__description");

    item.style.setProperty("--lvl", level / 100);
    if (label) label.textContent = "0%";

    item._level = level;

    if (canHover && !reduce) {
      item.addEventListener("mousemove", (e) => {
        const r = item.getBoundingClientRect();
        item.style.setProperty("--mx", e.clientX - r.left + "px");
        item.style.setProperty("--my", e.clientY - r.top + "px");
      });
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        item.classList.add("is-visible");
        const label = item.querySelector(".skills__description");
        if (label) countUp(label, item._level);
        io.unobserve(item);
      });
    },
    { threshold: 0.4 }
  );

  items.forEach((item) => io.observe(item));
});

// ===== Custom Cursor (GSAP) =====
// ===== Custom Cursor 2.0 =====
(function () {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return;

  const dot = document.getElementById("cursorDot");
  const follow = document.getElementById("cursorFollow");
  const glow = document.getElementById("cursorGlow");
  const canvas = document.getElementById("cursorTrail");
  if (!dot || !follow) return;

  const stretchEl = follow.querySelector(".cursor-stretch");
  const ring = follow.querySelector(".cursor-ring");
  const label = follow.querySelector(".cursor-label");
  const body = document.body;
  body.classList.add("has-custom-cursor");

  // ---------- خيارات (اجعل أي ميزة false لإيقافها) ----------
  const OPTIONS = { trail: true, glow: true, stretch: true, sparks: true };

  // عناصر بنص داخل الحلقة (أو أضف data-cursor="Open" لأي عنصر)
  const LABELS = [
    [".case__main", "Gallery"],
    [".case__thumbs a", "Zoom"],
    [".cert", "Zoom"],
  ];

  // عناصر تلتصق بها الحلقة وتأخذ شكلها
  const MAGNET =
    ".hx__btn, .sx__btn, .cx__link, .pf, .header__social, #scrollTop, #form_button, .tst__btn, .tst__close";

  const TEXT_INPUTS =
    "input:not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]), textarea";
  const CLICKABLE =
    "a, button, label, select, summary, [role=button], [data-cursor-grow], .splide__pagination__page";

  const MODE_CLASS = {
    snap: "cursor-snap",
    text: "cursor-text",
    label: "cursor-label-on",
    hover: "cursor-hover",
  };

  if (!OPTIONS.glow && glow) glow.remove();
  const ctx = OPTIONS.trail && canvas ? canvas.getContext("2d") : null;
  if (!ctx && canvas) canvas.remove();

  // ---------- حالة ----------
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  const gpos = { x: 0, y: 0 };
  let ready = false;
  let mode = "";
  let snapped = null;
  let sw = 0, sh = 0;
  let lastMove = 0;
  let isIdle = false;
  let angle = 0;
  let sCur = 0;

  // ---------- الذيل ----------
  const pts = [];
  const LIFE = 380;
  let trailDirty = false;
  let cw = 0, ch = 0;

  const resize = () => {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };
  resize();
  window.addEventListener("resize", resize);

  const drawTrail = (now) => {
    if (!ctx) return;
    while (pts.length && now - pts[0].t > LIFE) pts.shift();

    if (!pts.length) {
      if (trailDirty) {
        ctx.clearRect(0, 0, cw, ch);
        trailDirty = false;
      }
      return;
    }

    ctx.clearRect(0, 0, cw, ch);
    trailDirty = true;

    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const life = 1 - (now - b.t) / LIFE;
      ctx.strokeStyle = `rgba(76,225,158,${(life * 0.5).toFixed(3)})`;
      ctx.lineWidth = 1 + life * 5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  };

  // ---------- الحالات ----------
  const setMode = (next) => {
    if (next === mode) return;
    if (mode) body.classList.remove(MODE_CLASS[mode]);
    mode = next;
    if (mode) body.classList.add(MODE_CLASS[mode]);
  };

  const snapTo = (el) => {
    if (snapped === el) return;
    snapped = el;
    sw = sh = 0;

    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el).borderTopLeftRadius;
    let rad = cs.includes("%")
      ? (parseFloat(cs) / 100) * Math.min(r.width, r.height)
      : parseFloat(cs) || 0;
    rad = Math.min(rad + 7, (Math.min(r.width, r.height) + 14) / 2);
    if (rad < 8) rad = 10;                      // عناصر بزوايا حادة
    ring.style.setProperty("--r", rad + "px");
  };

  const release = () => {
    if (!snapped) return;
    snapped = null;
    sw = sh = 0;
    ring.style.removeProperty("--w");
    ring.style.removeProperty("--h");
    ring.style.removeProperty("--r");
  };

  const evaluate = (t) => {
    if (!(t instanceof Element)) return;

    const magnet = t.closest(MAGNET);
    if (magnet) {
      snapTo(magnet);
      return setMode("snap");
    }
    release();

    if (t.closest(TEXT_INPUTS)) return setMode("text");

    let text = "";
    const custom = t.closest("[data-cursor]");
    if (custom) {
      text = custom.dataset.cursor;
    } else {
      for (const [sel, txt] of LABELS) {
        if (t.closest(sel)) { text = txt; break; }
      }
    }
    if (text) {
      label.textContent = text;
      return setMode("label");
    }

    setMode(t.closest(CLICKABLE) ? "hover" : "");
  };

  // ---------- الأحداث ----------
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMove = performance.now();

      if (!ready) {
        ready = true;
        pos.x = gpos.x = mouse.x;
        pos.y = gpos.y = mouse.y;
        body.classList.add("cursor-ready");
      }

      if (ctx && mode !== "snap" && mode !== "text") {
        pts.push({ x: mouse.x, y: mouse.y, t: lastMove });
        if (pts.length > 40) pts.shift();
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseover", (e) => evaluate(e.target));

  // بعد التمرير: أعد فحص العنصر تحت المؤشر
  let scrollTimer;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (ready) evaluate(document.elementFromPoint(mouse.x, mouse.y));
      }, 120);
    },
    { passive: true }
  );

  const burst = (x, y) => {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "cursor-spark";
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const d = 28 + Math.random() * 34;
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(a) * d + "px");
      s.style.setProperty("--dy", Math.sin(a) * d + "px");
      document.body.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    }
  };

  document.addEventListener("mousedown", (e) => {
    body.classList.add("cursor-down");

    const ripple = document.createElement("span");
    ripple.className = "cursor-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });

    if (OPTIONS.sparks) burst(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", () => body.classList.remove("cursor-down"));

  document.documentElement.addEventListener("mouseleave", () => body.classList.remove("cursor-ready"));
  document.documentElement.addEventListener("mouseenter", () => {
    if (ready) body.classList.add("cursor-ready");
  });

  // ---------- الحلقة الرئيسية ----------
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!ready) return;

    // النقطة: مباشرة
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;

    // هدف الحلقة
    let tx = mouse.x;
    let ty = mouse.y;
    let k = 0.18;

    if (snapped) {
      if (!snapped.isConnected || !snapped.matches(":hover")) {
        release();
        evaluate(document.elementFromPoint(mouse.x, mouse.y));
      } else {
        const r = snapped.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        tx = cx + (mouse.x - cx) * 0.14;      // ميل خفيف نحو المؤشر
        ty = cy + (mouse.y - cy) * 0.14;
        k = 0.28;

        const w = Math.round(r.width + 14);
        const h = Math.round(r.height + 14);
        if (w !== sw || h !== sh) {
          ring.style.setProperty("--w", w + "px");
          ring.style.setProperty("--h", h + "px");
          sw = w;
          sh = h;
        }
      }
    }

    pos.x += (tx - pos.x) * k;
    pos.y += (ty - pos.y) * k;
    follow.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

    // التمدد مع السرعة
    if (OPTIONS.stretch) {
      const dx = tx - pos.x;
      const dy = ty - pos.y;
      const dist = Math.hypot(dx, dy);
      const allowed = mode === "" || mode === "hover";
      const target = allowed ? Math.min(dist / 140, 0.45) : 0;

      if (dist > 1.5) angle = Math.atan2(dy, dx);
      sCur += (target - sCur) * 0.25;

      stretchEl.style.transform =
        sCur > 0.005
          ? `rotate(${angle}rad) scale(${1 + sCur}, ${1 - sCur * 0.45})`
          : "";
    }

    // التوهج المحيطي (أبطأ من الحلقة)
    if (glow) {
      gpos.x += (mouse.x - gpos.x) * 0.08;
      gpos.y += (mouse.y - gpos.y) * 0.08;
      glow.style.transform = `translate3d(${gpos.x}px, ${gpos.y}px, 0)`;
    }

    drawTrail(now);

    // سكون: نبض السونار
    const idle = now - lastMove > 1600;
    if (idle !== isIdle) {
      isIdle = idle;
      body.classList.toggle("cursor-idle", idle);
    }
  };

  requestAnimationFrame(frame);
})();

// ===== New Hero =====
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Typewriter ---
  const roles = ["Full Stack Developer", "Mobile App Developer", "React & Supabase Builder" , "AI-Assisted Developer"];
  const typedEl = document.querySelector(".hx__typed");

  if (typedEl) {
    if (reduce) {
      typedEl.textContent = roles[0];
    } else {
      let r = 0, c = 0, deleting = false;
      const tick = () => {
        const word = roles[r];
        typedEl.textContent = word.slice(0, c);
        let delay = deleting ? 40 : 80;

        if (!deleting && c === word.length) {
          deleting = true;
          delay = 1500;
        } else if (deleting && c === 0) {
          deleting = false;
          r = (r + 1) % roles.length;
          delay = 400;
        }
        c += deleting ? -1 : 1;
        setTimeout(tick, delay);
      };
      tick();
    }
  }

  // --- Entrance animation (بعد زوال الـ preloader) ---
  if (!reduce && typeof gsap !== "undefined") {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    tl.from(".hx__badge",    { y: 20, opacity: 0, duration: 0.6 })
      .from(".hx__greeting", { y: 20, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hx__title",    { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hx__role",     { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hx__desc",     { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hx__btn",      { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.3")
      .from(".hx__stats",    { y: 20, opacity: 0, duration: 0.6 }, "-=0.2")
      .from(".hx__frame",    { scale: 0.9, opacity: 0, duration: 1 }, 0.3)
      .from(".hx__chip",     { scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: "back.out(1.7)" }, "-=0.5");

    if (window.__preloaderDone) tl.play();
else document.addEventListener("preloader:done", () => tl.play(), { once: true });

    // حركة طفو للشرائح
    document.querySelectorAll(".hx__chip").forEach((chip, i) => {
      gsap.to(chip, {
        y: i % 2 ? -12 : 12,
        duration: 2.2 + i * 0.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }

  // --- أزرار التمرير (متوافقة مع butter.js) ---
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target =
        document.querySelector(btn.dataset.scroll) || document.querySelector(".projects");
      if (!target) return;
      const y = target.offsetTop - 100;
      if (typeof butter !== "undefined" && butter.scrollTo) {
        butter.scrollTo(y);
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });
});

// ===== Projects: auto type + filter =====
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".projects__item");
  const buttons = document.querySelectorAll(".projects__filters .pf");

  // تصنيف تلقائي من التاجز: أي مشروع فيه Native أو Expo = Mobile
  items.forEach((item) => {
    const tags = (item.querySelector(".projects__tags")?.textContent || "").toLowerCase();
    item.dataset.type = tags.includes("native") || tags.includes("expo") ? "mobile" : "web";
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));

      items.forEach((item) => {
        const show = filter === "all" || item.dataset.type === filter;
        item.classList.toggle("is-hidden", !show);

        if (show) {
          item.classList.remove("pf-pop");
          void item.offsetWidth;            // إعادة تشغيل الأنيميشن
          item.classList.add("pf-pop");
          setTimeout(() => item.classList.remove("pf-pop"), 500);
        }
      });

      // تحديث AOS وطول الصفحة (مهم مع butter.js)
      if (window.AOS) AOS.refresh();
      window.dispatchEvent(new Event("resize"));
    });
  });
});

// ===== Featured: photo count + "+N" badge =====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".case").forEach((box) => {
    const main = box.querySelector(".case__main");
    const thumbs = box.querySelectorAll(".case__thumbs a");
    if (!main) return;

    main.dataset.count = 1 + thumbs.length + " photos";

    if (thumbs.length > 4) {
      thumbs[3].dataset.more = thumbs.length - 4;
    }
  });
});

// ===== Hero: waving hand =====
document.addEventListener("DOMContentLoaded", () => {
  const hand = document.querySelector(".hx__wave");
  const greeting = document.querySelector(".hx__greeting");
  if (!hand || !greeting) return;

  const wave = () => {
    hand.classList.remove("is-waving");
    void hand.offsetWidth;            // إعادة تشغيل الحركة
    hand.classList.add("is-waving");
  };

  // أول تلويح بعد زوال الـ preloader (مع تأخير بسيط حتى يظهر النص أولًا)
  const first = () => setTimeout(wave, 900);
  if (window.__preloaderDone) first();
  else document.addEventListener("preloader:done", first, { once: true });

  // تلويح عند المرور بالماوس أو اللمس
  greeting.addEventListener("mouseenter", wave);
  greeting.addEventListener("touchstart", wave, { passive: true });
});
// ===== Decorations: parallax =====
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const items = [...document.querySelectorAll(".deco[data-speed]")].map((el) => ({
    el,
    host: el.closest(".decor-host") || el.parentElement,
    speed: parseFloat(el.dataset.speed) || 0,
    last: 0,
  }));
  if (!items.length) return;

  // أي أقسام ظاهرة الآن؟
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) =>
        e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
      ),
    { rootMargin: "150px" }
  );
  new Set(items.map((i) => i.host)).forEach((h) => io.observe(h));

  const frame = () => {
    requestAnimationFrame(frame);
    if (!visible.size) return;

    const half = window.innerHeight / 2;

    for (const it of items) {
      if (!visible.has(it.host)) continue;
      const r = it.host.getBoundingClientRect();
      const py = (r.top + r.height / 2 - half) * it.speed;

      if (Math.abs(py - it.last) > 0.2) {
        it.last = py;
        it.el.style.setProperty("--py", py.toFixed(1) + "px");
      }
    }
  };

  requestAnimationFrame(frame);
})();


// ===== Tech stack marquee =====
(function () {
  const section = document.querySelector(".mq");
  if (!section) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("mq--static");
    return;
  }

  const rows = [...section.querySelectorAll("[data-mq]")].map((el) => {
    const track = el.querySelector(".mq__track");
    return {
      el,
      track,
      group: track.firstElementChild,
      speed: parseFloat(el.dataset.mq) || 30,      // بكسل/ثانية
      dir: parseFloat(el.dataset.dir) || -1,       // -1 يسار، 1 يمين
      pos: 0,
      w: 0,
      mult: 1,
      hover: false,
      visible: false,
    };
  });

  const build = () =>
    rows.forEach((r) => {
      r.track.querySelectorAll("[data-clone]").forEach((n) => n.remove());
      // العرض من الـ layout (لا يتأثر بدوران الشريط)
      r.w = parseFloat(getComputedStyle(r.group).width) || 0;
      if (!r.w) return;
      const copies = Math.ceil(window.innerWidth / r.w) + 1;
      for (let i = 0; i < copies; i++) {
        const c = r.group.cloneNode(true);
        c.dataset.clone = "1";
        c.setAttribute("aria-hidden", "true");
        r.track.appendChild(c);
      }
    });

  build();
  window.addEventListener("load", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const r = rows.find((x) => x.el === e.target);
        if (r) r.visible = e.isIntersecting;
      }),
    { rootMargin: "150px" }
  );

  rows.forEach((r) => {
    io.observe(r.el);
    r.el.addEventListener("mouseenter", () => (r.hover = true));
    r.el.addEventListener("mouseleave", () => (r.hover = false));
  });

  let last = performance.now();
  let lastY = window.pageYOffset;
  let boost = 0;

  const frame = (now) => {
    requestAnimationFrame(frame);

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const y = window.pageYOffset;
    boost += (Math.min(Math.abs(y - lastY) * 0.08, 4) - boost) * 0.1;
    lastY = y;

    rows.forEach((r) => {
      if (!r.visible || !r.w) return;
      r.mult += ((r.hover ? 0.12 : 1) - r.mult) * 0.08;
      r.pos += -r.dir * r.speed * dt * r.mult * (1 + boost);
      r.pos = ((r.pos % r.w) + r.w) % r.w;
      r.track.style.transform = `translate3d(${-r.pos}px, 0, 0)`;
    });
  };

  requestAnimationFrame(frame);
})();

// ===== How I Work v2: tabs + autoplay =====
(function () {
  const root = document.querySelector(".hw2");
  if (!root) return;

  const tabs = [...root.querySelectorAll(".hw2__tab")];
  const panels = [...root.querySelectorAll(".hw2__panel")];
  const list = root.querySelector(".hw2__tabs");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const DUR = 6500;                 // مدة كل مرحلة (ملّي ثانية)
  let cur = 0;
  let elapsed = 0;
  let auto = !reduce;
  let visible = false;
  let hover = false;
  let last = performance.now();

  const prog = (k) => tabs[k].querySelector(".hw2__prog");

  const select = (n, byUser) => {
    cur = (n + tabs.length) % tabs.length;
    elapsed = 0;

    tabs.forEach((t, k) => {
      const on = k === cur;
      t.classList.toggle("is-active", on);
      t.classList.toggle("is-done", k < cur);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      prog(k).style.removeProperty("--pg");
      panels[k].classList.toggle("is-active", on);
    });

    // بعد تدخل الزائر: يتوقف التبديل التلقائي
    if (byUser) auto = false;
    if (!auto) prog(cur).style.setProperty("--pg", 1);
  };

  select(0, false);

  tabs.forEach((t, k) => t.addEventListener("click", () => select(k, true)));

  list.addEventListener("keydown", (e) => {
    const keys = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key], true);
    tabs[cur].focus();
  });

  if (canHover) {
    root.addEventListener("mouseenter", () => (hover = true));
    root.addEventListener("mouseleave", () => (hover = false));
  }

  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 }).observe(root);

  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = now - last;
    last = now;

    if (!auto || !visible || hover || document.hidden) return;

    elapsed += Math.min(dt, 50);
    const p = Math.min(elapsed / DUR, 1);
    prog(cur).style.setProperty("--pg", p.toFixed(3));

    if (p >= 1) select(cur + 1, false);
  };

  requestAnimationFrame(frame);
})();

// ===== Dock navbar =====
(function () {
  const dock = document.getElementById("dock");
  if (!dock) return;

  const logo = document.getElementById("dkLogo");
  const now = document.getElementById("dkNow");
  const items = [...dock.querySelectorAll(".dk__i")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // ---------- ظهور بعد الـ preloader ----------
  const show = () => {
    dock.classList.add("is-in");
    if (logo) logo.classList.add("is-in");
  };
  if (!document.getElementById("preloader") || window.__preloaderDone) show();
  else {
    document.addEventListener("preloader:done", show, { once: true });
    setTimeout(show, 9000);                       // أمان
  }

  // ---------- تمرير (متوافق مع butter.js) ----------
  const topOf = (el) => {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  };

  const goTo = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const y = Math.max(topOf(target) - 20, 0);
    if (typeof butter !== "undefined" && typeof butter.scrollTo === "function") butter.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  [...dock.querySelectorAll('a[href^="#"]'), ...(logo ? [logo] : [])].forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(a.getAttribute("href"));
    });
  });

  // ---------- القسم الحالي ----------
  const LABEL = {
    home: "Home", skills: "Skills", services: "Services",
    process: "Process", work: "Work", contact: "Contact",
  };
  const GROUP = {
    home: "home", skills: "skills", services: "services",
    process: "process", featured: "work", projects: "work", contact: "contact",
  };

  let current = "";
  let announce = false;
  let flashTimer;
  setTimeout(() => (announce = true), 2500);       // لا تُظهر الكبسولة عند أول تحميل

  const flash = (text) => {
    if (!now || dock.matches(":hover")) return;
    now.textContent = text;
    now.classList.add("is-show");
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => now.classList.remove("is-show"), 1300);
  };

  const setActive = (key) => {
    if (!key || key === current) return;
    current = key;
    items.forEach((a) => {
      const on = a.dataset.nav === key;
      a.classList.toggle("is-active", on);
      on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
    });
    if (announce) flash(LABEL[key]);
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(GROUP[e.target.id])),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  Object.keys(GROUP).forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
  setActive("home");

  // ---------- تكبير الأيقونات (ديسكتوب فقط) ----------
  if (canHover && !reduce) {
    const MAX = 0.55;                              // أقصى زيادة (1 → 1.55)
    const SIGMA = 70;                              // مدى تأثير المؤشر على الجيران
    const cur = items.map(() => 1);
    let centers = [];
    let mx = null;
    let raf = 0;

    const atRest = () => cur.every((v) => v < 1.03);

    const measure = () => {
      if (!atRest()) return;                       // القياس يجب أن يكون والأيقونات بحجمها الطبيعي
      centers = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };

    const step = () => {
      raf = 0;
      let moving = false;

      items.forEach((el, i) => {
        let target = 1;
        if (mx !== null && centers[i] !== undefined) {
          const d = mx - centers[i];
          target = 1 + MAX * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
        }
        cur[i] += (target - cur[i]) * 0.22;
        if (Math.abs(target - cur[i]) < 0.002) cur[i] = target;
        else moving = true;
        el.style.setProperty("--s", cur[i].toFixed(3));
      });

      if (moving) raf = requestAnimationFrame(step);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

    dock.addEventListener("mouseenter", () => { measure(); });
    dock.addEventListener("mousemove", (e) => { mx = e.clientX; kick(); }, { passive: true });
    dock.addEventListener("mouseleave", () => { mx = null; kick(); });

    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  }

  // ---------- جوال: الـ Dock يختفي أثناء الكتابة ----------
  if (coarse) {
    document.addEventListener("focusin", (e) => {
      if (e.target.matches("input, textarea, select")) dock.classList.add("is-away");
    });
    document.addEventListener("focusout", () => dock.classList.remove("is-away"));
  }
})();

// ===== Hero: image tilt + magnetic buttons + underline trigger =====
(function () {
  const hx = document.querySelector(".hx");
  if (!hx) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // رسم الخط تحت الاسم بعد زوال الـ preloader
  const ready = () => hx.classList.add("is-ready");
  if (window.__preloaderDone || !document.getElementById("preloader")) ready();
  else document.addEventListener("preloader:done", ready, { once: true });
  setTimeout(ready, 9000);

  if (!canHover || reduce) return;

  // ---------- ميل الصورة ----------
  const vis = hx.querySelector(".hx__visual");
  if (vis) {
    const MAX = 11;                                  // أقصى زاوية ميل
    const t = { rx: 0, ry: 0, gx: 50, gy: 50, tx: 0, ty: 0 };
    const c = { ...t };
    let raf = 0;
    let hovering = false;

    const apply = () => {
      vis.style.setProperty("--rx", c.rx.toFixed(2) + "deg");
      vis.style.setProperty("--ry", c.ry.toFixed(2) + "deg");
      vis.style.setProperty("--gx", c.gx.toFixed(1) + "%");
      vis.style.setProperty("--gy", c.gy.toFixed(1) + "%");
      vis.style.setProperty("--tx", c.tx.toFixed(1) + "px");
      vis.style.setProperty("--ty", c.ty.toFixed(1) + "px");
    };

    const loop = () => {
      raf = 0;
      let moving = false;
      for (const k in c) {
        c[k] += (t[k] - c[k]) * 0.12;
        if (Math.abs(t[k] - c[k]) > 0.02) moving = true;
      }
      apply();
      if (moving || hovering) raf = requestAnimationFrame(loop);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const clamp = (v) => Math.min(Math.max(v, 0), 1);

    vis.addEventListener("pointerenter", () => { hovering = true; kick(); });

    vis.addEventListener("pointermove", (e) => {
      const r = vis.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width);
      const py = clamp((e.clientY - r.top) / r.height);
      t.ry = (px - 0.5) * 2 * MAX;
      t.rx = -(py - 0.5) * 2 * MAX;
      t.gx = px * 100;
      t.gy = py * 100;
      t.tx = (px - 0.5) * 30;
      t.ty = (py - 0.5) * 30;
      kick();
    });

    vis.addEventListener("pointerleave", () => {
      hovering = false;
      t.rx = t.ry = t.tx = t.ty = 0;
      t.gx = t.gy = 50;
      kick();
    });
  }

  // ---------- أزرار تنجذب نحو المؤشر ----------
  hx.querySelectorAll(".hx__btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px");
      btn.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px");
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });
})();


document.addEventListener("DOMContentLoaded", () => {
  const whatsappButton = document.querySelector(".whatsapp-float");

  if (!whatsappButton) return;

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    whatsappButton.addEventListener("pointermove", (event) => {
      const bounds = whatsappButton.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      whatsappButton.style.setProperty("--pointer-x", `${x}%`);
      whatsappButton.style.setProperty("--pointer-y", `${y}%`);
      whatsappButton.classList.add("is-pointer-over");
    });

    whatsappButton.addEventListener("pointerleave", () => {
      whatsappButton.classList.remove("is-pointer-over");
    });
  }

  const revealButton = () => whatsappButton.classList.add("is-visible");

  if (window.__preloaderDone || !document.getElementById("preloader")) {
    revealButton();
  } else {
    document.addEventListener("preloader:done", revealButton, { once: true });
  }
});
