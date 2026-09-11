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

const preloader = document.getElementById("preloader");

window.addEventListener("load", function () {
  preloader.style.transform = "translateY(-100%)";
});

const progressCircle = document.getElementById("progressCircle");
const circumference = progressCircle.getTotalLength();
progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = scrollTop / scrollHeight;

  const offset = circumference - progress * circumference;
  progressCircle.style.strokeDashoffset = offset;

  // السطر الجديد
  scrollProgressBar.style.width = (progress * 100) + "%";

  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTop > 200) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

document.getElementById("scrollTop").addEventListener("click", (e) => {
  e.preventDefault();
  if (typeof butter !== "undefined" && typeof butter.scrollTo === "function") {
    butter.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});


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

document.addEventListener('DOMContentLoaded', function () {
  new Splide('#services', {
    type        : 'loop',
    perPage     : 3,
    gap         : '2rem',
    autoplay    : true,      // تفعيل الانتقال التلقائي
    interval    : 3500,      // مدة العرض لكل شريحة (بالملّي)
    pauseOnHover: false,     // لا يوقف عند التحويم
    arrows      : false,     // إخفاء الأسهم
    pagination  : false,     // إخفاء النقاط
    breakpoints : {
      1024: { perPage: 2 },
      640 : { perPage: 1 }
    }
  }).mount();

  // تفعيل حركة الـ 3D Tilt كما قبل
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max       : 15,
    speed     : 400,
    glare     : true,
    'max-glare': 0.2,
  });
});
document.addEventListener('DOMContentLoaded', function () {
  new Splide('#reviews', {
    type        : 'loop',
    perPage     : 3,
    gap         : '2rem',
    autoplay    : true,      // تفعيل الانتقال التلقائي
    interval    : 3500,      // مدة العرض لكل شريحة (بالملّي)
    pauseOnHover: false,     // لا يوقف عند التحويم
    arrows      : false,     // إخفاء الأسهم
    pagination  : false,     // إخفاء النقاط
    breakpoints : {
      1024: { perPage: 2 },
      640 : { perPage: 1 }
    }
  }).mount();

  // تفعيل حركة الـ 3D Tilt كما قبل
  VanillaTilt.init(document.querySelectorAll('.review-card'), {
    max       : 15,
    speed     : 400,
    glare     : true,
    'max-glare': 0.2,
  });
});
// ===== Send Contact Form to Telegram =====
const TELEGRAM_BOT_TOKEN = "8616720811:AAH3fmGsv605vfUuHqT9tHNzG82wIfDxNog"; // مثال: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
const TELEGRAM_CHAT_ID   = "7321445096"; // مثال: 123456789

window.onload = function () {
  document.getElementById('contact__form').addEventListener('submit', function (event) {
    event.preventDefault();

    const form = event.target;
    const name    = form.user_name.value.trim();
    const email   = form.user_email.value.trim();
    const message = form.message.value.trim();

    const text =
      `📩 *رسالة جديدة من الموقع*\n\n` +
      `👤 *الاسم:* ${name}\n` +
      `📧 *الإيميل:* ${email}\n` +
      `💬 *الرسالة:*\n${message}`;

    Swal.fire({
      title: "Sending...",
      html: '<div style="color: #fff; font-size: 1.2rem;">Your message is being sent, please wait.</div>',
      icon: "info",
      color: "#fff",
      background: "#000",
      confirmButtonColor: "#4ce19e",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: "Markdown"
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.ok) {
              Swal.fire({
                title: "Message sent",
                text: "Message sent successfully!",
                icon: "success",
                color: "#fff",
                background: "#000",
                confirmButtonColor: "#4ce19e",
              });
              form.reset();
            } else {
              throw new Error("Telegram API error");
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Failed to send",
              text: "Failed to send message. Please try again.",
              color: "#fff",
              background: "#000",
              confirmButtonColor: "#4ce19e",
            });
          });
      }
    });
  });
};


      const skillsItems = document.querySelectorAll('.skills__item');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // يشتغل مرة واحدة بس
        }
      });
    },
    { threshold: 0.4 }
  );

  skillsItems.forEach(item => observer.observe(item));

  // ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll(".stats__number");

const animateCounter = (el) => {
  const target = +el.getAttribute("data-target");
  const duration = 1800; // بالملي ثانية
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    // easing (ease-out) لجعل الحركة أنعم
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((num) => statsObserver.observe(num));


// ===== Custom Cursor (GSAP) =====
(function () {
  const isDesktop = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!isDesktop || prefersReduced) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("has-custom-cursor");

  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (e) => {
    gsap.set(dot, { x: e.clientX, y: e.clientY });
    ringX = e.clientX;
    ringY = e.clientY;
  });

  gsap.ticker.add(() => {
    const currentX = gsap.getProperty(ring, "x") || 0;
    const currentY = gsap.getProperty(ring, "y") || 0;
    gsap.set(ring, {
      x: currentX + (ringX - currentX) * 0.18,
      y: currentY + (ringY - currentY) * 0.18,
    });
  });

  const growTargets = "a, button, [data-cursor-grow]";

  const onEnter = () =>
    gsap.to(ring, { scale: 2.2, duration: 0.3, opacity: 0.5 });
  const onLeave = () =>
    gsap.to(ring, { scale: 1, duration: 0.3, opacity: 1 });

  // نستخدم event delegation عشان يشتغل حتى على عناصر بتضاف بعدين
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(growTargets)) onEnter();
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(growTargets)) onLeave();
  });

  // إخفاء الكيرسور لما يخرج من الصفحة
  document.addEventListener("mouseleave", () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener("mouseenter", () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
})();