gsap.to(".hero__ring", {
  y: 100,
  duration: 1,
  ease: "power2.out",
  repeat: -1,
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

