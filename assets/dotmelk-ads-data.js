/* ===========================================================================
   Dotmelk · shared ads dataset
   Single source of truth for: ads list, map price-pins, and compare page.
   Assessment (ارزیابی محیطی داتملک) = 6 dimensions + overall score/tier.
   a = [امکانات, ویژگی‌ها, قیمت, دسترسی‌ها, توسعه, محدودیت‌ها]
   ========================================================================= */
(function () {
  // dimension labels + color group (p = primary/purple, g = teal/green)
  window.DM_DIMS = [
    ["امکانات", "p"],
    ["ویژگی‌ها", "p"],
    ["قیمت", "p"],
    ["دسترسی‌ها", "p"],
    ["توسعه", "g"],
    ["محدودیت‌ها", "g"],
  ];

  // overall score → quality tier (single source of truth — 6 levels)
  // color/soft/text are CSS var strings (vars must exist in the consuming page).
  window.DM_tier = function (s) {
    if (s >= 85) return { l: "ملک ممتاز", c: "exc", color: "var(--success)", soft: "var(--success-soft)", text: "var(--success-text)", rec: "خرید توصیه می‌شود", risk: "ریسک بسیار پایین" };
    if (s >= 70) return { l: "بسیار خوب", c: "good", color: "var(--info)", soft: "var(--info-soft)", text: "var(--info-text)", rec: "خرید توصیه می‌شود", risk: "ریسک پایین" };
    if (s >= 55) return { l: "خوب", c: "fair", color: "var(--teal)", soft: "var(--teal-soft)", text: "var(--teal)", rec: "قابل بررسی", risk: "ریسک متوسط" };
    if (s >= 40) return { l: "متوسط", c: "mid", color: "var(--warning)", soft: "var(--warning-soft)", text: "var(--warning-text)", rec: "با احتیاط", risk: "ریسک نسبی" };
    if (s >= 25) return { l: "ضعیف", c: "weak", color: "var(--orange)", soft: "var(--orange-soft)", text: "var(--orange)", rec: "بررسی دقیق", risk: "ریسک بالا" };
    return { l: "پرریسک", c: "risk", color: "var(--danger)", soft: "var(--danger-soft)", text: "var(--danger-text)", rec: "توصیه نمی‌شود", risk: "ریسک بسیار بالا" };
  };

  // EN digits → FA digits
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  window.DM_fa = function (n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); };

  window.DM_ADS = [
    {
      key: "a1", type: "sale", typeLabel: "فروش", status: "public", statusLabel: "عمومی",
      urgent: true, vip: false, code: "۵۴۲۱",
      title: "آپارتمان ۱۳۵ متری نوساز در سعادت‌آباد",
      specs: "۱۳۵ متری · ۳ خواب · طبقه ۴ · سند تک‌برگ",
      price: '<span class="label">مبلغ:</span> ۱۲٫۸ میلیارد <small>تومان</small>',
      area: "تهران، سعادت‌آباد — محله کاج", time: "امروز", agency: "آژانس آسمان",
      media: ["↻", "▦"], a: [85, 80, 62, 90, 72, 25], score: 85,
      pin: { right: 400, top: 360, label: "۱۲٫۸ میلیارد" }, pinM: { right: 280, top: 280, label: "۱۲٫۸ میلیارد" },
    },
    {
      key: "a2", type: "rent", typeLabel: "رهن و اجاره", status: "agency", statusLabel: "املاک",
      urgent: false, vip: true, code: "۶۳۱۸",
      title: "واحد ۹۰ متری بازسازی‌شده در مرزداران",
      specs: "۹۰ متری · ۲ خواب · طبقه ۲ · پارکینگ",
      price: '<span class="label">ودیعه:</span> ۷۰۰م <span class="sep"></span> <span class="label">اجاره:</span> ۲۵م',
      area: "تهران، مرزداران — محله آریافر", time: "امروز", agency: "املاک خانه نو",
      media: ["▦"], a: [70, 72, 68, 75, 60, 35], score: 72,
      pin: { right: 560, top: 720, label: "ودیعه ۷۰۰م" }, pinM: { right: 420, top: 600, label: "ودیعه ۷۰۰م" },
    },
    {
      key: "a3", type: "rent", typeLabel: "رهن و اجاره", status: "expired", statusLabel: "منقضی شده",
      urgent: false, vip: false, code: "۶۹۰۲",
      title: "آپارتمان ۸۰ متری رهن کامل در ولنجک",
      specs: "۸۰ متری · ۲ خواب · طبقه ۳ · بازسازی",
      price: '<span class="agreed">رهن کامل</span> <span class="sep"></span> ۱٫۲ میلیارد <small>ودیعه</small>',
      area: "تهران، ولنجک — محله یمن", time: "۵ روز پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [55, 50, 80, 60, 45, 40], score: 58,
      pin: { right: 300, top: 520, label: "رهن کامل" }, pinM: { right: 240, top: 460, label: "رهن کامل" },
    },
    {
      key: "a4", type: "participation", typeLabel: "مشارکت", status: "folk", statusLabel: "مردمی",
      urgent: false, vip: false, code: "۴۸۸۹",
      title: "زمین ۴۲۰ متری مشارکت در ساخت — نیاوران",
      specs: "۴۲۰ متری · کلنگی · سند تک‌برگ · بر ۱۴",
      price: '<span class="label">حداقل سرمایه:</span> <span class="agreed">توافقی</span>',
      area: "تهران، نیاوران — محله جماران", time: "۲ روز پیش", agency: "دفتر شمال شهر",
      media: [], a: [65, 60, 70, 55, 85, 30], score: 68,
      pin: { right: 700, top: 300, label: "توافقی" }, pinM: { right: 620, top: 320, label: "توافقی" },
    },
    {
      key: "a5", type: "presell", typeLabel: "پیش‌فروش", status: "waiting", statusLabel: "در انتظار",
      urgent: false, vip: false, code: "۷۰۳۴",
      title: "پیش‌فروش واحد ۱۱۰ متری در پروژه چیتگر",
      specs: "۱۱۰ متری · ۲ خواب · تحویل ۱۴۰۶ · منطقه ۲۲",
      price: '<span class="label">پیش‌پرداخت:</span> ۳٫۲ میلیارد <small>تومان</small>',
      area: "تهران، چیتگر — منطقه ۲۲", time: "دیروز", agency: "گروه آرتا",
      media: ["▷"], a: [60, 65, 58, 62, 75, 38], score: 60,
      pin: { right: 980, top: 440, label: "۳٫۲ میلیارد" }, pinM: { right: 720, top: 520, label: "۳٫۲ میلیارد" },
    },
    {
      key: "a6", type: "short", typeLabel: "اجاره کوتاه‌مدت", status: "public", statusLabel: "عمومی",
      urgent: false, vip: false, code: "۸۱۱۵",
      title: "سوئیت مبله‌ی روزانه نزدیک برج میلاد",
      specs: "۶۰ متری · ۱ خواب · مبله · روزانه",
      price: '<span class="label">اجاره شبانه:</span> از ۲٫۵ میلیون <small>تومان</small>',
      area: "تهران، گیشا — محله نصر", time: "امروز", agency: "آگهی‌دهنده شخصی",
      media: [], a: [72, 68, 55, 80, 50, 28], score: 70,
      pin: { right: 480, top: 620, label: "شبانه ۲٫۵م" }, pinM: { right: 360, top: 380, label: "شبانه ۲٫۵م" },
    },
    {
      key: "a7", type: "sale", typeLabel: "فروش", status: "edit", statusLabel: "نیاز به ویرایش",
      urgent: false, vip: false, code: "۵۲۷۰",
      title: "کلنگی ۲۲۰ متری مناسب بازسازی در امانیه",
      specs: "۲۲۰ متری · کلنگی · سند منگوله‌دار",
      price: '<span class="label">مبلغ:</span> <span class="agreed">توافقی</span>',
      area: "تهران، امانیه — محله دروس", time: "۳ روز پیش", agency: "آژانس آسمان",
      media: [], a: [40, 38, 75, 45, 30, 60], score: 42,
    },
    {
      key: "a8", type: "participation", typeLabel: "مشارکت", status: "archived", statusLabel: "بایگانی شده",
      urgent: false, vip: false, code: "۴۱۰۲",
      title: "ملک کلنگی ۳۰۰ متری برای مشارکت در لواسان",
      specs: "۳۰۰ متری · کلنگی · باغ‌ویلا",
      price: '<span class="label">حداقل سرمایه:</span> از ۴۵ میلیارد <small>تومان</small>',
      area: "لواسان — محله ایگل", time: "هفته پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [52, 55, 60, 50, 65, 45], score: 55,
    },
    {
      key: "a9", type: "presell", typeLabel: "پیش‌فروش", status: "rejected", statusLabel: "رد شده",
      urgent: false, vip: false, code: "۷۷۸۱",
      title: "پیش‌فروش برج مسکونی در زعفرانیه",
      specs: "۱۸۰ متری · ۳ خواب · تحویل ۱۴۰۷",
      price: '<span class="label">پیش‌پرداخت:</span> ۵ میلیارد <small>تومان</small>',
      area: "تهران، منطقه ۱ — زعفرانیه", time: "۴ روز پیش", agency: "گروه آرتا",
      media: [], a: [35, 40, 55, 42, 30, 70], score: 38,
    },
    {
      key: "a10", type: "sale", typeLabel: "فروش", status: "deleted", statusLabel: "حذف شده",
      urgent: false, vip: false, code: "۳۳۵۰",
      title: "واحد ۶۰ متری سرمایه‌ای در نازی‌آباد",
      specs: "۶۰ متری · ۱ خواب · طبقه ۵",
      price: '<span class="label">مبلغ:</span> ۴ میلیارد <small>تومان</small>',
      area: "تهران، نازی‌آباد — بازار دوم", time: "هفته پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [50, 48, 65, 52, 45, 50], score: 50,
    },
  ];
})();
