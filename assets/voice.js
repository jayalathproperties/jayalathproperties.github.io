/* JAYALATH PROPERTIES – voice search (🎤) and read aloud (🔊)
   Uses only the phone/browser's own free voice features. No paid service.
   - 🎤 Voice search: say e.g. "Dambulla land", "දඹුල්ල ඉඩම්", "கண்டியில் வீடு".
   - 🔊 Read aloud: on property cards, blog cards and About, in the selected language.
   If the browser cannot do it, the buttons simply do not appear. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function lang() { return (document.body && document.body.dataset.language) || "si"; }

  var T = {
    si: { mic: "🎤 කතා කර සොයන්න", listening: "🎤 අහගෙන ඉන්නවා… දැන් කතා කරන්න (උදා: දඹුල්ල ඉඩම්)", heard: "ඇහුණේ: ", none: "ගැළපෙන දෙයක් හඳුනාගත්තේ නැහැ. නැවත උත්සාහ කරන්න හෝ පහත තෝරන්න.",
          err: "ඇහුණේ නැහැ. 🎤 ඔබලා නැවත කතා කරන්න.", denied: "Microphone අවසරය නැහැ. Browser settings එකෙන් අවසර දෙන්න.",
          read: "හඬින් අහන්න", stop: "නවත්වන්න", noVoice: "මෙම දුරකථනයේ සිංහල හඬක් නැහැ. Settings → Text-to-speech එකෙන් සිංහල හඬ install කරන්න." },
    en: { mic: "🎤 Search by voice", listening: "🎤 Listening… speak now (e.g. Dambulla land)", heard: "Heard: ", none: "Couldn't match a place or property type. Try again or use the boxes below.",
          err: "Didn't catch that. Tap 🎤 and speak again.", denied: "Microphone permission is off. Allow it in your browser settings.",
          read: "Listen", stop: "Stop", noVoice: "This phone has no English voice installed." },
    ta: { mic: "🎤 பேசித் தேடுங்கள்", listening: "🎤 கேட்கிறது… இப்போது பேசுங்கள் (எ.கா: கண்டியில் வீடு)", heard: "கேட்டது: ", none: "இடம் அல்லது சொத்து வகை பொருந்தவில்லை. மீண்டும் முயலுங்கள் அல்லது கீழே தேர்ந்தெடுங்கள்.",
          err: "கேட்கவில்லை. 🎤 அழுத்தி மீண்டும் பேசுங்கள்.", denied: "மைக்ரோஃபோன் அனுமதி இல்லை. Browser settings இல் அனுமதி வழங்குங்கள்.",
          read: "கேளுங்கள்", stop: "நிறுத்து", noVoice: "இந்தத் தொலைபேசியில் தமிழ் குரல் இல்லை. Settings → Text-to-speech இல் நிறுவுங்கள்." }
  };
  function t(k) { return (T[lang()] || T.si)[k]; }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".vs-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:14px}" +
    ".vs-mic{border:0;border-radius:999px;padding:11px 18px;font:inherit;font-weight:800;background:#fff;color:#155da8;box-shadow:0 5px 16px rgba(0,0,0,.18);cursor:pointer}" +
    ".vs-mic.on{background:#b23a2e;color:#fff;animation:vsPulse 1s infinite}@keyframes vsPulse{50%{opacity:.65}}" +
    ".vs-msg{color:#e1edf8;font-size:14px;font-weight:600;min-height:1em}" +
    ".rd-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #b9d1e8;background:#fff;color:#155da8;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;font-weight:800;cursor:pointer;margin-top:8px}" +
    ".rd-btn.on{background:#155da8;color:#fff;border-color:#155da8}" +
    ".rd-note{font-size:12px;color:#b23a2e;margin-top:6px}" +
    "@media (prefers-reduced-motion:reduce){.vs-mic.on{animation:none}}";
  document.head.appendChild(css);

  /* =====================================================================
     🎤 VOICE SEARCH (Chrome on Android / desktop)
     ===================================================================== */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var VOICE_LANG = { si: "si-LK", ta: "ta-LK", en: "en-US" };

  // Words people say → property type (value used by the search box)
  var TYPE_WORDS = [
    ["Guest House", ["guest house", "guesthouse", "ආගන්තුක", "ගෙස්ට් හවුස්", "விருந்தினர்"]],
    ["Business for Sale", ["business", "ව්‍යාපාර", "බිස්නස්", "வியாபார"]],
    ["Commercial Building", ["commercial", "shop", "building", "වාණිජ", "කඩ", "ගොඩනැගිලි", "வணிக", "கடை", "கட்டட"]],
    ["Apartment", ["apartment", "flat", "මහල්", "ඇපාර්ට්මන්ට්", "அடுக்கு"]],
    ["Villa", ["villa", "විලා", "வில்லா"]],
    ["Hotel", ["hotel", "හෝටල", "ஹோட்டல்"]],
    ["House", ["house", "home", "නිවස", "නිවාස", "ගෙය", "ගෙදර", "ගෙවල්", "வீடு", "வீட்"]],
    ["Land", ["land", "plot", "ඉඩම", "ඉඩම්", "காணி", "நிலம்"]]
  ];
  var RENT_WORDS = ["rent", "rental", "කුලී", "කුලිය", "වාඩකය", "வாடகை"];

  // Sinhala names for towns, so "දඹුල්ල ඉඩම්" also finds Dambulla
  var SI_TOWNS = {"Dehiwala":"දෙහිවල","Mount Lavinia":"ගල්කිස්ස","Moratuwa":"මොරටුව","Maharagama":"මහරගම","Sri Jayawardenepura Kotte":"කෝට්ටේ","Nugegoda":"නුගේගොඩ","Piliyandala":"පිළියන්දල","Homagama":"හෝමාගම","Avissawella":"අවිස්සාවේල්ල","Hanwella":"හංවැල්ල","Padukka":"පාදුක්ක","Negombo":"මීගමුව","Ja-Ela":"ජා-ඇල","Wattala":"වත්තල","Kandana":"කඳාන","Ragama":"රාගම","Kiribathgoda":"කිරිබත්ගොඩ","Kadawatha":"කඩවත","Minuwangoda":"මිනුවන්ගොඩ","Veyangoda":"වේයන්ගොඩ","Nittambuwa":"නිට්ටඹුව","Divulapitiya":"දිවුලපිටිය","Panadura":"පානදුර","Horana":"හොරණ","Beruwala":"බේරුවල","Aluthgama":"අලුත්ගම","Matugama":"මතුගම","Bandaragama":"බණ්ඩාරගම","Ingiriya":"ඉඟිරිය","Wadduwa":"වාද්දුව","Peradeniya":"පේරාදෙණිය","Katugastota":"කටුගස්තොට","Gampola":"ගම්පොළ","Nawalapitiya":"නාවලපිටිය","Kadugannawa":"කඩුගන්නාව","Kundasale":"කුණ්ඩසාලේ","Digana":"දිගන","Wattegama":"වත්තේගම","Galagedara":"ගලගෙදර","Dambulla":"දඹුල්ල","Ukuwela":"උකුවෙල","Rattota":"රත්තොට","Galewela":"ගලේවෙල","Naula":"නාඋල","Pallepola":"පල්ලේපොල","Hatton":"හැටන්","Talawakelle":"තලවකැලේ","Ginigathhena":"ගිනිගත්හේන","Lindula":"ලින්දුල","Kotagala":"කොටගල","Hanguranketha":"හඟුරන්කෙත","Ambalangoda":"අම්බලන්ගොඩ","Hikkaduwa":"හික්කඩුව","Elpitiya":"ඇල්පිටිය","Baddegama":"බද්දේගම","Balapitiya":"බලපිටිය","Karapitiya":"කරාපිටිය","Ahangama":"අහංගම","Habaraduwa":"හබරාදූව","Weligama":"වැලිගම","Akuressa":"අකුරැස්ස","Hakmana":"හක්මණ","Deniyaya":"දෙනියාය","Kamburupitiya":"කඹුරුපිටිය","Dikwella":"දික්වැල්ල","Kekanadura":"කෙකනදුර","Tangalle":"තංගල්ල","Tissamaharama":"තිස්සමහාරාම","Beliatta":"බෙලිඅත්ත","Ambalantota":"අම්බලන්තොට","Walasmulla":"වලස්මුල්ල","Middeniya":"මිද්දෙනිය","Point Pedro":"පේදුරුතුඩුව","Chavakachcheri":"චාවකච්චේරි","Paranthan":"පරන්තන්","Talaimannar":"තලෙයිමන්නාරම","Omanthai":"ඕමන්තේ","Eravur":"ඒරාවූර්","Kattankudy":"කාත්තාන්කුඩි","Valaichchenai":"වාලච්චේන","Kalmunai":"කල්මුණේ","Akkaraipattu":"අක්කරෙයිපත්තු","Sammanthurai":"සම්මාන්තුරේ","Pottuvil":"පොතුවිල්","Uhana":"උහන","Maha Oya":"මහඔය","Kinniya":"කින්නියා","Mutur":"මූදූර්","Kantale":"කන්තලේ","Nilaveli":"නිලාවේලි","Kuliyapitiya":"කුලියාපිටිය","Wariyapola":"වාරියපොළ","Narammala":"නාරම්මල","Pannala":"පන්නල","Nikaweratiya":"නිකවැරටිය","Mawathagama":"මාවතගම","Polgahawela":"පොල්ගහවෙල","Bingiriya":"බිංගිරිය","Alawwa":"අලව්ව","Ibbagamuwa":"ඉබ්බාගමුව","Chilaw":"හලාවත","Wennappuwa":"වෙන්නප්පුව","Nattandiya":"නාත්තණ්ඩිය","Marawila":"මාරවිල","Dankotuwa":"දංකොටුව","Anamaduwa":"ආනමඩුව","Kalpitiya":"කල්පිටිය","Kekirawa":"කැකිරාව","Eppawala":"එප්පාවල","Mihintale":"මිහින්තලේ","Nochchiyagama":"නොච්චියාගම","Thambuttegama":"තඹුත්තේගම","Galenbindunuwewa":"ගලෙන්බිඳුණුවැව","Medawachchiya":"මැදවච්චිය","Hingurakgoda":"හිඟුරක්ගොඩ","Kaduruwela":"කදුරුවෙල","Medirigiriya":"මැදිරිගිරිය","Welikanda":"වැලිකන්ද","Bakamuna":"බකමූණ","Bandarawela":"බණ්ඩාරවෙල","Haputale":"හපුතලේ","Ella":"ඇල්ල","Welimada":"වැලිමඩ","Mahiyanganaya":"මහියංගනය","Passara":"පස්සර","Diyatalawa":"දියතලාව","Hali Ela":"හාලිඇල","Wellawaya":"වැල්ලවාය","Bibile":"බිබිල","Buttala":"බුත්තල","Siyambalanduwa":"සියඹලාණ්ඩුව","Thanamalwila":"තණමල්විල","Kataragama":"කතරගම","Balangoda":"බලන්ගොඩ","Embilipitiya":"ඇඹිලිපිටිය","Pelmadulla":"පැල්මඩුල්ල","Eheliyagoda":"ඇහැළියගොඩ","Kuruwita":"කුරුවිට","Kahawatta":"කහවත්ත","Kalawana":"කලවාන","Mawanella":"මාවනැල්ල","Warakapola":"වරකාපොළ","Rambukkana":"රඹුක්කන","Ruwanwella":"රුවන්වැල්ල","Dehiowita":"දෙහිඕවිට","Yatiyanthota":"යටියන්තොට","Deraniyagala":"දැරණියගල","Galigamuwa":"ගලිගමුව"};
  // English words must match as whole words ("Ella" must not match "Wellawaya"); Sinhala/Tamil match anywhere
  function has(text, w) {
    w = String(w || "").toLowerCase(); if (!w) return false;
    if (/^[a-z0-9 .'-]+$/.test(w)) return new RegExp("(^|[^a-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)").test(text);
    return text.indexOf(w) >= 0;
  }

  function understand(said) {
    var text = " " + said.toLowerCase() + " ";
    var out = { type: null, cat: null, district: null, town: null };
    for (var i = 0; i < TYPE_WORDS.length && !out.cat; i++)
      for (var j = 0; j < TYPE_WORDS[i][1].length; j++)
        if (has(text, TYPE_WORDS[i][1][j])) { out.cat = TYPE_WORDS[i][0]; break; }
    for (var r = 0; r < RENT_WORDS.length; r++) if (has(text, RENT_WORDS[r])) out.type = "Rent";
    var locs = (typeof sriLankaLocations !== "undefined") ? sriLankaLocations : [];
    // a town (any district) is the most exact match
    for (var d = 0; d < locs.length && !out.town; d++)
      for (var k = 0; k < locs[d].towns.length; k++)
        if (has(text, locs[d].towns[k]) || has(text, SI_TOWNS[locs[d].towns[k]])) { out.town = locs[d].towns[k]; out.district = locs[d].en; break; }
    if (!out.district)
      for (var e = 0; e < locs.length; e++)
        if (has(text, locs[e].en) || has(text, locs[e].si) || has(text, locs[e].ta)) { out.district = locs[e].en; break; }
    return out;
  }

  function applySearch(said) {
    var u = understand(said), msg = $(".vs-msg");
    if (!u.cat && !u.district && !u.type) { msg.textContent = t("heard") + "“" + said + "” – " + t("none"); return; }
    var typeEl = $("#searchType"), catEl = $("#searchCat"), dEl = $("#searchDistrict"), tEl = $("#searchTown");
    if (typeEl) typeEl.value = u.type || "Buy";
    if (catEl) catEl.value = u.cat || "All properties";
    if (dEl) { dEl.value = u.district || "Any district"; if (typeof updateTownOptions === "function") updateTownOptions(); }
    if (tEl) tEl.value = u.town || "Any town";
    msg.textContent = t("heard") + "“" + said + "”";
    if (typeof searchProperties === "function") searchProperties();
    var p = $("#properties"); if (p) setTimeout(function () { p.scrollIntoView({ behavior: "smooth", block: "start" }); }, 350);
    try { if (window.gtag) gtag("event", "voice_search", { language: lang() }); } catch (x) {}
  }

  function setupMic() {
    var search = $(".hero .search");
    if (!SR || !search) return;
    var row = document.createElement("div"); row.className = "vs-row";
    row.innerHTML = '<button type="button" class="vs-mic"></button><span class="vs-msg" aria-live="polite"></span>';
    search.parentNode.insertBefore(row, search.nextSibling);
    var btn = $(".vs-mic", row), msg = $(".vs-msg", row), rec = null, listening = false;
    btn.addEventListener("click", function () {
      if (listening && rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = VOICE_LANG[lang()] || "si-LK"; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onstart = function () { listening = true; btn.classList.add("on"); msg.textContent = t("listening"); };
      rec.onresult = function (ev) { applySearch((ev.results[0][0].transcript || "").replace(/[.។।]+$/, "").trim()); };
      rec.onerror = function (ev) { msg.textContent = t(ev.error === "not-allowed" || ev.error === "service-not-allowed" ? "denied" : "err"); };
      rec.onend = function () { listening = false; btn.classList.remove("on"); if (msg.textContent === t("listening")) msg.textContent = ""; };
      try { rec.start(); } catch (x) { msg.textContent = t("err"); }
    });
  }

  /* =====================================================================
     🔊 READ ALOUD
     ===================================================================== */
  var TTS = window.speechSynthesis;
  var SPEAK_LANG = { si: "si-LK", ta: "ta-IN", en: "en-US" };
  var current = null;

  function voiceFor(l) {
    var list = TTS ? TTS.getVoices() : [];
    var m = list.filter(function (v) { return (v.lang || "").toLowerCase().replace("_", "-").indexOf(l) === 0; });
    return { list: list, voice: m[0] || null };
  }
  function textOf(box) {
    var parts = $$("h2, h3, .loc, .price, .specs span, p", box)
      .filter(function (el) { return el.offsetParent !== null && !el.classList.contains("rd-note"); })
      .map(function (el) { return el.textContent.replace(/[📍→⌂]/g, " ").trim(); })
      .filter(Boolean);
    return parts.join(". ");
  }
  function stopAll() {
    if (TTS) TTS.cancel();
    $$(".rd-btn.on").forEach(function (b) { b.classList.remove("on"); b.textContent = "🔊 " + t("read"); });
    current = null;
  }
  function speak(btn, box) {
    if (current === btn) { stopAll(); return; }
    stopAll();
    var l = lang(), v = voiceFor(l), note = $(".rd-note", box);
    if (note) note.remove();
    if (v.list.length && !v.voice) {           // phone has voices, but none for this language
      var n = document.createElement("div"); n.className = "rd-note"; n.textContent = t("noVoice");
      btn.insertAdjacentElement("afterend", n); return;
    }
    var u = new SpeechSynthesisUtterance(textOf(box));
    u.lang = SPEAK_LANG[l]; if (v.voice) u.voice = v.voice; u.rate = 0.92;
    u.onend = u.onerror = function () { if (current === btn) stopAll(); };
    current = btn; btn.classList.add("on"); btn.textContent = "⏹ " + t("stop");
    TTS.speak(u);
    try { if (window.gtag) gtag("event", "read_aloud", { language: l }); } catch (x) {}
  }
  function addReadButtons() {
    if (!TTS || !window.SpeechSynthesisUtterance) return;
    var boxes = $$("#propertyCards .cardbody, #blogPage .cards .cardbody, #about .aboutgrid > div:last-child");
    boxes.forEach(function (box) {
      if ($(".rd-btn", box)) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "rd-btn";
      b.addEventListener("click", function () { speak(b, box); });
      var head = $("h2, h3", box);
      if (head) head.insertAdjacentElement("afterend", b); else box.appendChild(b);
    });
    relabel();
  }

  /* ---------- keep button text in the selected language ---------- */
  function relabel() {
    var m = $(".vs-mic"); if (m) { m.textContent = t("mic"); m.setAttribute("aria-label", t("mic")); }
    $$(".rd-btn").forEach(function (b) { b.textContent = (b.classList.contains("on") ? "⏹ " + t("stop") : "🔊 " + t("read")); b.setAttribute("aria-label", t("read")); });
    $$(".rd-note").forEach(function (n) { n.remove(); });
  }
  new MutationObserver(function () { stopAll(); relabel(); }).observe(document.body, { attributes: true, attributeFilter: ["data-language"] });
  if (TTS && "onvoiceschanged" in TTS) TTS.onvoiceschanged = function () {};  // wakes up the voice list on Android

  function start() { setupMic(); addReadButtons(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
