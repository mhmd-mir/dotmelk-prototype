/* ===========================================================================
   Dotmelk · shared ads dataset
   Single source of truth for: ads list, map price-pins, compare page, detail.
   - a   = [امکانات, ویژگی‌ها, قیمت, دسترسی‌ها, توسعه, محدودیت‌ها]  (assessment)
   - cmp = full comparable field set (used by compare page; fallback "—")
   ========================================================================= */
(function () {
  // assessment dimension labels + color group (p = primary/purple, g = teal/green)
  window.DM_DIMS = [
    ["امکانات", "p"], ["ویژگی‌ها", "p"], ["قیمت", "p"],
    ["دسترسی‌ها", "p"], ["توسعه", "g"], ["محدودیت‌ها", "g"],
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

  /* compare-table schema: groups → rows. row = [label, key, kind]
     kind: undefined=text · "m"=text+" متر" · "bool"=✓/✕ · "dim"=bar(key=index) · "tier"=overall
     key starting with "@" is read directly from the ad (e.g. @agency). */
  window.DM_CMP_GROUPS = [
    { t: "مشخصات کلی", ic: "⌂", rows: [
      ["نوع ملک", "ptype"], ["نوع معامله", "@typeLabel"], ["متراژ زمین", "land", "m"],
      ["متراژ بنا", "built", "m"], ["محله", "hood"], ["نوع سند", "doc"], ["جهت ساختمان", "dir"], ["کاربری", "usage"],
    ]},
    { t: "مشخصات ساختمان", ic: "▦", rows: [
      ["سال ساخت", "year"], ["وضعیت بنا", "cond"], ["تعداد طبقات", "floors"], ["طبقه واحد", "unitFloor"],
      ["واحد در طبقه", "perFloor"], ["تعداد اتاق", "rooms"], ["پارکینگ", "parking"],
      ["سیستم گرمایش", "heat"], ["سیستم سرمایش", "cool"], ["کف‌پوش", "floorMat"],
    ]},
    { t: "قیمت و پرداخت", ic: "﷼", rows: [
      ["قیمت / مبلغ", "total"], ["قیمت هر متر", "perMeter"], ["قابل تبدیل", "convert", "bool"],
      ["وام / تسهیلات", "loan"], ["شرایط پرداخت", "pay"],
    ]},
    { t: "امکانات واحد", ic: "✦", rows: [
      ["آسانسور", "elevator", "bool"], ["انباری", "storage", "bool"], ["بالکن", "balcony", "bool"],
      ["آیفون تصویری", "intercom", "bool"], ["درب ضد سرقت", "antitheft", "bool"], ["پنجره دوجداره", "dblwin", "bool"],
    ]},
    { t: "مشاعات ساختمان", ic: "◫", rows: [
      ["دوربین مداربسته", "cctv", "bool"], ["لابی", "lobby", "bool"], ["نگهبانی", "guard", "bool"], ["سالن ورزش", "gym", "bool"],
    ]},
    { t: "حیاط", ic: "❧", rows: [
      ["استخر / ذخیره آب", "pool", "bool"], ["روشنایی محوطه", "lighting", "bool"], ["درختان", "trees"],
    ]},
    { t: "ارزیابی محیطی داتملک", ic: "◎", rows: [
      ["امکانات", 0, "dim"], ["ویژگی‌ها", 1, "dim"], ["شاخص قیمت", 2, "dim"], ["دسترسی‌ها", 3, "dim"],
      ["توسعه", 4, "dim"], ["محدودیت‌ها", 5, "dim"], ["ارزیابی کلی", "score", "tier"],
    ]},
    { t: "دسترسی‌ها", ic: "⌖", rows: [
      ["فاصله تا مترو", "metro"], ["فاصله تا مدرسه", "school"], ["فاصله تا مرکز خرید", "mall"],
    ]},
    { t: "آگهی‌دهنده", ic: "☎", rows: [
      ["نوع آگهی‌دهنده", "advType"], ["آژانس / مشاور", "@agency"], ["کد آگهی", "@code"], ["تاریخ ثبت", "@time"],
    ]},
  ];

  window.DM_ADS = [
    {
      key: "a1", type: "sale", typeLabel: "فروش", status: "public", statusLabel: "عمومی",
      urgent: true, vip: false, code: "۵۴۲۱",
      title: "آپارتمان ۱۳۵ متری نوساز در سعادت‌آباد", specs: "۱۳۵ متری · ۳ خواب · طبقه ۴ · سند تک‌برگ",
      price: '<span class="label">مبلغ:</span> ۱۲٫۸ میلیارد <small>تومان</small>',
      area: "تهران، سعادت‌آباد — محله کاج", time: "امروز", agency: "آژانس آسمان",
      media: ["↻", "▦"], a: [85, 80, 62, 90, 72, 25], score: 85,
      pin: { right: 400, top: 360, label: "۱۲٫۸ میلیارد" }, pinM: { right: 280, top: 280, label: "۱۲٫۸ میلیارد" },
      cmp: { ptype: "آپارتمان", land: "۱۳۵", built: "۱۲۰", hood: "سعادت‌آباد — کاج", doc: "تک‌برگ", dir: "جنوبی", usage: "مسکونی",
        year: "۱۴۰۱", cond: "نوساز", floors: "۷", unitFloor: "۴", perFloor: "۲", rooms: "۳", parking: "۱",
        heat: "پکیج", cool: "کولر گازی", floorMat: "سرامیک و پارکت",
        total: "۱۲٫۸ میلیارد", perMeter: "۹۴٫۸ م", convert: false, loan: "قابل انتقال", pay: "نقد / مذاکره",
        elevator: true, storage: true, balcony: true, intercom: true, antitheft: true, dblwin: true,
        cctv: true, lobby: true, guard: true, gym: false, pool: true, lighting: true, trees: "آلبالو، گردو",
        metro: "۴۵۰ م", school: "۳۲۰ م", mall: "۵۲۰ م", advType: "آژانس املاک" },
    },
    {
      key: "a2", type: "rent", typeLabel: "رهن و اجاره", status: "agency", statusLabel: "املاک",
      urgent: false, vip: true, code: "۶۳۱۸",
      title: "واحد ۹۰ متری بازسازی‌شده در مرزداران", specs: "۹۰ متری · ۲ خواب · طبقه ۲ · پارکینگ",
      price: '<span class="label">ودیعه:</span> ۷۰۰م <span class="sep"></span> <span class="label">اجاره:</span> ۲۵م',
      area: "تهران، مرزداران — محله آریافر", time: "امروز", agency: "املاک خانه نو",
      media: ["▦"], a: [70, 72, 68, 75, 60, 35], score: 72,
      pin: { right: 560, top: 720, label: "ودیعه ۷۰۰م" }, pinM: { right: 420, top: 600, label: "ودیعه ۷۰۰م" },
      cmp: { ptype: "آپارتمان", land: "۹۰", built: "۹۰", hood: "مرزداران — آریافر", doc: "تک‌برگ", dir: "شمالی", usage: "مسکونی",
        year: "۱۳۹۰", cond: "بازسازی‌شده", floors: "۵", unitFloor: "۲", perFloor: "۳", rooms: "۲", parking: "۱",
        heat: "شوفاژ", cool: "کولر آبی", floorMat: "سرامیک",
        total: "ودیعه ۷۰۰م + اجاره ۲۵م", perMeter: "—", convert: true, loan: "—", pay: "ودیعه / اجاره",
        elevator: true, storage: true, balcony: false, intercom: true, antitheft: true, dblwin: false,
        cctv: true, lobby: false, guard: false, gym: false, pool: false, lighting: true, trees: "—",
        metro: "۶۰۰ م", school: "۴۰۰ م", mall: "۳۰۰ م", advType: "آژانس املاک" },
    },
    {
      key: "a3", type: "rent", typeLabel: "رهن و اجاره", status: "expired", statusLabel: "منقضی شده",
      urgent: false, vip: false, code: "۶۹۰۲",
      title: "آپارتمان ۸۰ متری رهن کامل در ولنجک", specs: "۸۰ متری · ۲ خواب · طبقه ۳ · بازسازی",
      price: '<span class="agreed">رهن کامل</span> <span class="sep"></span> ۱٫۲ میلیارد <small>ودیعه</small>',
      area: "تهران، ولنجک — محله یمن", time: "۵ روز پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [55, 50, 80, 60, 45, 40], score: 58,
      pin: { right: 300, top: 520, label: "رهن کامل" }, pinM: { right: 240, top: 460, label: "رهن کامل" },
      cmp: { ptype: "آپارتمان", land: "۸۰", built: "۸۰", hood: "ولنجک — یمن", doc: "قولنامه‌ای", dir: "جنوبی", usage: "مسکونی",
        year: "۱۳۸۸", cond: "بازسازی‌شده", floors: "۴", unitFloor: "۳", perFloor: "۲", rooms: "۲", parking: "۰",
        heat: "پکیج", cool: "کولر گازی", floorMat: "سرامیک",
        total: "رهن کامل ۱٫۲ میلیارد", perMeter: "—", convert: false, loan: "—", pay: "رهن کامل",
        elevator: false, storage: true, balcony: true, intercom: false, antitheft: false, dblwin: true,
        cctv: false, lobby: false, guard: false, gym: false, pool: false, lighting: false, trees: "—",
        metro: "۸۵۰ م", school: "۵۰۰ م", mall: "۷۰۰ م", advType: "شخصی" },
    },
    {
      key: "a4", type: "participation", typeLabel: "مشارکت", status: "folk", statusLabel: "مردمی",
      urgent: false, vip: false, code: "۴۸۸۹",
      title: "زمین ۴۲۰ متری مشارکت در ساخت — نیاوران", specs: "۴۲۰ متری · کلنگی · سند تک‌برگ · بر ۱۴",
      price: '<span class="label">حداقل سرمایه:</span> <span class="agreed">توافقی</span>',
      area: "تهران، نیاوران — محله جماران", time: "۲ روز پیش", agency: "دفتر شمال شهر",
      media: [], a: [65, 60, 70, 55, 85, 30], score: 68,
      pin: { right: 700, top: 300, label: "توافقی" }, pinM: { right: 620, top: 320, label: "توافقی" },
      cmp: { ptype: "زمین / کلنگی", land: "۴۲۰", built: "—", hood: "نیاوران — جماران", doc: "تک‌برگ", dir: "دو نبش", usage: "مسکونی",
        year: "—", cond: "کلنگی", floors: "—", unitFloor: "—", perFloor: "—", rooms: "—", parking: "—",
        heat: "—", cool: "—", floorMat: "—",
        total: "توافقی (مشارکت)", perMeter: "—", convert: false, loan: "—", pay: "قرارداد مشارکت",
        elevator: false, storage: false, balcony: false, intercom: false, antitheft: false, dblwin: false,
        cctv: false, lobby: false, guard: false, gym: false, pool: false, lighting: false, trees: "چند اصله",
        metro: "۱٫۲ کیلومتر", school: "۶۰۰ م", mall: "۹۰۰ م", advType: "آژانس املاک" },
    },
    {
      key: "a5", type: "presell", typeLabel: "پیش‌فروش", status: "waiting", statusLabel: "در انتظار",
      urgent: false, vip: false, code: "۷۰۳۴",
      title: "پیش‌فروش واحد ۱۱۰ متری در پروژه چیتگر", specs: "۱۱۰ متری · ۲ خواب · تحویل ۱۴۰۶ · منطقه ۲۲",
      price: '<span class="label">پیش‌پرداخت:</span> ۳٫۲ میلیارد <small>تومان</small>',
      area: "تهران، چیتگر — منطقه ۲۲", time: "دیروز", agency: "گروه آرتا",
      media: ["▷"], a: [60, 65, 58, 62, 75, 38], score: 60,
      pin: { right: 980, top: 440, label: "۳٫۲ میلیارد" }, pinM: { right: 720, top: 520, label: "۳٫۲ میلیارد" },
      cmp: { ptype: "آپارتمان", land: "۱۱۰", built: "۱۱۰", hood: "چیتگر — منطقه ۲۲", doc: "تک‌برگ (در دست اقدام)", dir: "غربی", usage: "مسکونی",
        year: "۱۴۰۶ (تحویل)", cond: "در حال ساخت", floors: "۱۲", unitFloor: "۸", perFloor: "۴", rooms: "۲", parking: "۱",
        heat: "از کف", cool: "اسپلیت", floorMat: "سرامیک",
        total: "پیش‌پرداخت ۳٫۲ میلیارد", perMeter: "۸۵ م", convert: false, loan: "مرحله‌ای", pay: "اقساطی تا تحویل",
        elevator: true, storage: true, balcony: true, intercom: true, antitheft: true, dblwin: true,
        cctv: true, lobby: true, guard: true, gym: true, pool: true, lighting: true, trees: "محوطه‌سازی",
        metro: "۱ کیلومتر", school: "۷۰۰ م", mall: "۴۰۰ م", advType: "سازنده / گروه" },
    },
    {
      key: "a6", type: "short", typeLabel: "اجاره کوتاه‌مدت", status: "public", statusLabel: "عمومی",
      urgent: false, vip: false, code: "۸۱۱۵",
      title: "سوئیت مبله‌ی روزانه نزدیک برج میلاد", specs: "۶۰ متری · ۱ خواب · مبله · روزانه",
      price: '<span class="label">اجاره شبانه:</span> از ۲٫۵ میلیون <small>تومان</small>',
      area: "تهران، گیشا — محله نصر", time: "امروز", agency: "آگهی‌دهنده شخصی",
      media: [], a: [72, 68, 55, 80, 50, 28], score: 70,
      pin: { right: 480, top: 620, label: "شبانه ۲٫۵م" }, pinM: { right: 360, top: 380, label: "شبانه ۲٫۵م" },
      cmp: { ptype: "سوئیت مبله", land: "۶۰", built: "۶۰", hood: "گیشا — نصر", doc: "—", dir: "جنوبی", usage: "اقامتی",
        year: "۱۳۹۸", cond: "مبله", floors: "۶", unitFloor: "۳", perFloor: "۲", rooms: "۱", parking: "۱",
        heat: "پکیج", cool: "کولر گازی", floorMat: "پارکت",
        total: "شبانه از ۲٫۵ میلیون", perMeter: "—", convert: false, loan: "—", pay: "روزانه / شبانه",
        elevator: true, storage: false, balcony: true, intercom: true, antitheft: true, dblwin: true,
        cctv: true, lobby: true, guard: false, gym: false, pool: false, lighting: true, trees: "—",
        metro: "۳۰۰ م", school: "—", mall: "۲۵۰ م", advType: "شخصی" },
    },
    {
      key: "a7", type: "sale", typeLabel: "فروش", status: "edit", statusLabel: "نیاز به ویرایش",
      urgent: false, vip: false, code: "۵۲۷۰",
      title: "کلنگی ۲۲۰ متری مناسب بازسازی در امانیه", specs: "۲۲۰ متری · کلنگی · سند منگوله‌دار",
      price: '<span class="label">مبلغ:</span> <span class="agreed">توافقی</span>',
      area: "تهران، امانیه — محله دروس", time: "۳ روز پیش", agency: "آژانس آسمان",
      media: [], a: [40, 38, 75, 45, 30, 60], score: 42,
      cmp: { ptype: "کلنگی", land: "۲۲۰", built: "۱۸۰", hood: "امانیه — دروس", doc: "منگوله‌دار", dir: "شمالی", usage: "مسکونی",
        year: "۱۳۷۵", cond: "کلنگی", floors: "۲", unitFloor: "—", perFloor: "۱", rooms: "۴", parking: "۲",
        heat: "بخاری", cool: "کولر آبی", floorMat: "موزائیک",
        total: "توافقی", perMeter: "—", convert: false, loan: "—", pay: "نقد",
        elevator: false, storage: true, balcony: true, intercom: false, antitheft: false, dblwin: false,
        cctv: false, lobby: false, guard: false, gym: false, pool: false, lighting: true, trees: "قدیمی",
        metro: "۹۰۰ م", school: "۴۰۰ م", mall: "۶۰۰ م", advType: "آژانس املاک" },
    },
    {
      key: "a8", type: "participation", typeLabel: "مشارکت", status: "archived", statusLabel: "بایگانی شده",
      urgent: false, vip: false, code: "۴۱۰۲",
      title: "ملک کلنگی ۳۰۰ متری برای مشارکت در لواسان", specs: "۳۰۰ متری · کلنگی · باغ‌ویلا",
      price: '<span class="label">حداقل سرمایه:</span> از ۴۵ میلیارد <small>تومان</small>',
      area: "لواسان — محله ایگل", time: "هفته پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [52, 55, 60, 50, 65, 45], score: 55,
      cmp: { ptype: "باغ‌ویلا / کلنگی", land: "۳۰۰", built: "۱۰۰", hood: "لواسان — ایگل", doc: "قولنامه‌ای", dir: "جنوبی", usage: "مسکونی",
        year: "۱۳۸۰", cond: "کلنگی", floors: "۱", unitFloor: "—", perFloor: "۱", rooms: "۳", parking: "۳",
        heat: "شوفاژ", cool: "—", floorMat: "سنگ",
        total: "از ۴۵ میلیارد (مشارکت)", perMeter: "—", convert: false, loan: "—", pay: "قرارداد مشارکت",
        elevator: false, storage: true, balcony: false, intercom: false, antitheft: false, dblwin: false,
        cctv: false, lobby: false, guard: true, gym: false, pool: true, lighting: true, trees: "باغ میوه",
        metro: "—", school: "۱٫۵ کیلومتر", mall: "۲ کیلومتر", advType: "شخصی" },
    },
    {
      key: "a9", type: "presell", typeLabel: "پیش‌فروش", status: "rejected", statusLabel: "رد شده",
      urgent: false, vip: false, code: "۷۷۸۱",
      title: "پیش‌فروش برج مسکونی در زعفرانیه", specs: "۱۸۰ متری · ۳ خواب · تحویل ۱۴۰۷",
      price: '<span class="label">پیش‌پرداخت:</span> ۵ میلیارد <small>تومان</small>',
      area: "تهران، منطقه ۱ — زعفرانیه", time: "۴ روز پیش", agency: "گروه آرتا",
      media: [], a: [35, 40, 55, 42, 30, 70], score: 38,
      cmp: { ptype: "آپارتمان (برج)", land: "۱۸۰", built: "۱۸۰", hood: "زعفرانیه — منطقه ۱", doc: "تک‌برگ (در دست اقدام)", dir: "جنوبی", usage: "مسکونی",
        year: "۱۴۰۷ (تحویل)", cond: "در حال ساخت", floors: "۲۰", unitFloor: "۱۲", perFloor: "۲", rooms: "۳", parking: "۲",
        heat: "از کف", cool: "فن‌کویل", floorMat: "سنگ",
        total: "پیش‌پرداخت ۵ میلیارد", perMeter: "۱۲۰ م", convert: false, loan: "مرحله‌ای", pay: "اقساطی",
        elevator: true, storage: true, balcony: true, intercom: true, antitheft: true, dblwin: true,
        cctv: true, lobby: true, guard: true, gym: true, pool: true, lighting: true, trees: "روف‌گاردن",
        metro: "۱٫۸ کیلومتر", school: "۸۰۰ م", mall: "۵۰۰ م", advType: "سازنده / گروه" },
    },
    {
      key: "a10", type: "sale", typeLabel: "فروش", status: "deleted", statusLabel: "حذف شده",
      urgent: false, vip: false, code: "۳۳۵۰",
      title: "واحد ۶۰ متری سرمایه‌ای در نازی‌آباد", specs: "۶۰ متری · ۱ خواب · طبقه ۵",
      price: '<span class="label">مبلغ:</span> ۴ میلیارد <small>تومان</small>',
      area: "تهران، نازی‌آباد — بازار دوم", time: "هفته پیش", agency: "آگهی‌دهنده شخصی",
      media: [], a: [50, 48, 65, 52, 45, 50], score: 50,
      cmp: { ptype: "آپارتمان", land: "۶۰", built: "۶۰", hood: "نازی‌آباد — بازار دوم", doc: "تک‌برگ", dir: "شرقی", usage: "مسکونی",
        year: "۱۳۹۵", cond: "معمولی", floors: "۶", unitFloor: "۵", perFloor: "۴", rooms: "۱", parking: "۰",
        heat: "پکیج", cool: "کولر گازی", floorMat: "سرامیک",
        total: "۴ میلیارد", perMeter: "۶۶ م", convert: false, loan: "قابل انتقال", pay: "نقد / مذاکره",
        elevator: true, storage: false, balcony: false, intercom: true, antitheft: false, dblwin: true,
        cctv: true, lobby: false, guard: false, gym: false, pool: false, lighting: false, trees: "—",
        metro: "۵۵۰ م", school: "۳۰۰ م", mall: "۲۰۰ م", advType: "شخصی" },
    },
  ];
})();
