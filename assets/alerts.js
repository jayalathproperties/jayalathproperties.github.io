/* JAYALATH PROPERTIES – "🔔 My property alerts" (like මගේ වගාව alerts)
   The visitor marks what they want once: Buy/Rent, district, town, property types, max budget.
   It is saved ON THEIR PHONE only (no login, nothing sent anywhere).
   Every time they open the site/app, matching properties are shown, with NEW on ones
   added since their last visit.
   Listings now come from the property cards on the page (each card has data-added="YYYY-MM-DD").
   In Milestone 1 the same function will read listings from Google Sheets instead. */
(function () {
  "use strict";
  var KEY = "jp-alert-v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function lang() { return (document.body && document.body.dataset.language) || "si"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var CATS = [
    ["Land", "ඉඩම්", "காணி"], ["House", "නිවාස", "வீடு"], ["Apartment", "මහල් නිවාස", "அடுக்குமாடி"],
    ["Villa", "විලා", "வில்லா"], ["Hotel", "හෝටල්", "ஹோட்டல்"], ["Guest House", "ආගන්තුක නිවාස", "விருந்தினர் இல்லம்"],
    ["Commercial Building", "වාණිජ ගොඩනැගිලි", "வணிகக் கட்டடம்"], ["Business for Sale", "විකිණීමට ඇති ව්‍යාපාර", "விற்பனைக்கு வணிகம்"]
  ];
  var LI = { en: 0, si: 1, ta: 2 };
  function catName(en) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === en) return CATS[i][LI[lang()]]; return en; }

  var T = {
    si: {
      kicker: "ඔබට ගැලපෙන දේපළ", title: "🔔 ඔබ සොයන දේපළ අලුතින් එන විට බලාගන්න",
      intro: "ඔබ කැමති නගරය සහ දේපළ වර්ගය එක් වරක් තෝරා තබන්න. වෙබ් අඩවියට / App එකට නැවත පිවිසෙන සෑම විටම, ඔබට ගැලපෙන නව දේපළ මෙහි පෙන්වයි.",
      set: "🔔 මට අවශ්‍ය දේපළ තෝරාගන්න", edit: "✏️ වෙනස් කරන්න", clear: "ඉවත් කරන්න",
      looking: "ඔබ සොයන්නේ:", any: "ඕනෑම", anyDist: "ඕනෑම දිස්ත්‍රික්කයක්", anyTown: "ඕනෑම නගරයක්", upTo: "උපරිම රු.",
      buy: "මිලදී ගැනීමට", rent: "කුලියට",
      found: "ගැලපෙන දේපළ %N ක්", newN: "🆕 නව දේපළ %N ක්!", none: "දැනට ගැලපෙන දේපළ නැහැ. නව දේපළක් එක් වූ විට මෙහි පෙන්වයි.",
      newTag: "නව", view: "බලන්න →",
      tellJ: "💬 ජයලත් මහතාටත් කියන්න", tellJHint: "ඔබට ගැලපෙන දේපළක් ආ විට WhatsApp මඟින් දැනුම් දීමට.",
      mTitle: "ඔබට අවශ්‍ය දේපළ තෝරන්න", mNote: "මෙය ඔබේ දුරකථනයේ පමණක් සුරැකේ. කිසිවෙකුට යවන්නේ නැහැ.",
      lType: "ඔබට අවශ්‍ය", lDist: "දිස්ත්‍රික්කය", lTown: "නගරය / ප්‍රදේශය (අවශ්‍ය නම්)", lCats: "දේපළ වර්ගය (එකක් හෝ කිහිපයක්)", lMax: "උපරිම අයවැය (රු.) (අවශ්‍ය නම්)",
      save: "සුරකින්න", cancel: "අවලංගු කරන්න",
      appTitle: "📲 App එක ලබාගන්න", appText: "දේපළක් සොයාගැනීමට කාලය ගතවෙනවා. App එක විවෘත කරන සෑම විටම ඔබට ගැලපෙන නව දේපළ පහසුවෙන් දැකගත හැකියි.",
      iosTip: "iPhone: Safari හි Share (□↑) → \"Add to Home Screen\" → Add"
    },
    en: {
      kicker: "Properties for you", title: "🔔 See new properties that match what you want",
      intro: "Choose your preferred area and property type once. Each time you open the website or app, matching new properties are shown here.",
      set: "🔔 Choose what I'm looking for", edit: "✏️ Change", clear: "Remove",
      looking: "You are looking for:", any: "Any", anyDist: "Any district", anyTown: "Any town", upTo: "up to LKR",
      buy: "To buy", rent: "To rent",
      found: "%N matching properties", newN: "🆕 %N new properties!", none: "No matching properties yet. New ones will show here when they are listed.",
      newTag: "NEW", view: "View →",
      tellJ: "💬 Tell Jayalath too", tellJHint: "So he can WhatsApp you when a matching property comes in.",
      mTitle: "Choose the property you want", mNote: "This is saved only on your phone. Nothing is sent to anyone.",
      lType: "I want", lDist: "District", lTown: "Town / area (optional)", lCats: "Property type (one or more)", lMax: "Maximum budget (LKR) (optional)",
      save: "Save", cancel: "Cancel",
      appTitle: "📲 Get the app", appText: "Finding a property takes time. Each time you open the app, you can easily see new properties that match you.",
      iosTip: "iPhone: in Safari tap Share (□↑) → \"Add to Home Screen\" → Add"
    },
    ta: {
      kicker: "உங்களுக்குப் பொருந்தும் சொத்துகள்", title: "🔔 நீங்கள் தேடும் சொத்து புதிதாக வரும்போது பாருங்கள்",
      intro: "உங்களுக்கு விருப்பமான நகரத்தையும் சொத்து வகையையும் ஒருமுறை தேர்ந்தெடுங்கள். இணையதளம் / செயலியைத் திறக்கும் ஒவ்வொரு முறையும் உங்களுக்குப் பொருந்தும் புதிய சொத்துகள் இங்கே காட்டப்படும்.",
      set: "🔔 நான் தேடுவதைத் தேர்ந்தெடு", edit: "✏️ மாற்று", clear: "நீக்கு",
      looking: "நீங்கள் தேடுவது:", any: "ஏதேனும்", anyDist: "எந்த மாவட்டமும்", anyTown: "எந்த நகரமும்", upTo: "அதிகபட்சம் LKR",
      buy: "வாங்க", rent: "வாடகைக்கு",
      found: "பொருந்தும் சொத்துகள் %N", newN: "🆕 புதிய சொத்துகள் %N!", none: "இப்போது பொருந்தும் சொத்துகள் இல்லை. புதியவை பட்டியலிடப்பட்டதும் இங்கே காட்டப்படும்.",
      newTag: "புதியது", view: "பார்க்க →",
      tellJ: "💬 ஜயலத்திடமும் சொல்லுங்கள்", tellJHint: "பொருந்தும் சொத்து வந்ததும் WhatsApp மூலம் தெரிவிக்க.",
      mTitle: "நீங்கள் தேடும் சொத்தைத் தேர்ந்தெடுங்கள்", mNote: "இது உங்கள் தொலைபேசியில் மட்டுமே சேமிக்கப்படும். யாருக்கும் அனுப்பப்படாது.",
      lType: "எனக்கு வேண்டியது", lDist: "மாவட்டம்", lTown: "நகரம் / பகுதி (விருப்பம்)", lCats: "சொத்து வகை (ஒன்று அல்லது பல)", lMax: "அதிகபட்ச பட்ஜெட் (LKR) (விருப்பம்)",
      save: "சேமி", cancel: "ரத்து",
      appTitle: "📲 செயலியைப் பெறுங்கள்", appText: "சொத்தைத் தேட நேரம் எடுக்கும். செயலியைத் திறக்கும் ஒவ்வொரு முறையும் உங்களுக்குப் பொருந்தும் புதிய சொத்துகளை எளிதாகப் பார்க்கலாம்.",
      iosTip: "iPhone: Safari இல் Share (□↑) → \"Add to Home Screen\" → Add"
    }
  };
  function t(k) { return (T[lang()] || T.si)[k]; }

  /* ---------- saved wish (on the phone only) ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  /* ---------- listings (from the cards today; from Google Sheets in Milestone 1) ---------- */
  function listings() {
    return $$("#propertyCards .card").map(function (c) {
      var priceText = ($(".price", c) || {}).textContent || "";
      return {
        el: c, id: (($(".cardfoot .muted", c) || {}).textContent || "").trim(),
        title: (($("h3", c) || {}).textContent || "").trim(), priceText: priceText.trim(),
        price: Number(priceText.replace(/[^\d]/g, "")) || 0,
        type: c.dataset.type || "Buy", cat: c.dataset.cat || "", district: c.dataset.district || "", town: c.dataset.town || "",
        added: c.dataset.added || ""
      };
    });
  }
  function matches(p, x) {
    if (p.type && x.type !== p.type) return false;
    if (p.district && x.district !== p.district) return false;
    if (p.town && x.town !== p.town) return false;
    if (p.cats && p.cats.length && p.cats.indexOf(x.cat) < 0) return false;
    if (p.max && x.price && x.price > p.max) return false;
    return true;
  }

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent =
    "#myAlerts{padding:34px 0 10px}#myAlerts .abox{background:#fff;border:1.5px solid #b9d1e8;border-radius:16px;padding:18px;box-shadow:0 5px 18px rgba(20,55,90,.06)}" +
    "#myAlerts h2{margin:4px 0 6px;color:var(--navy,#12365c);font-size:22px}#myAlerts .ai{color:var(--muted,#68788a);margin:0 0 12px}" +
    ".al-sum{background:#eef5fc;border-radius:10px;padding:10px 12px;margin:0 0 10px;font-weight:700;color:#12365c}" +
    ".al-head{font-weight:900;color:#12365c;margin:10px 0 6px}.al-new{color:#b45309}" +
    ".al-list{display:grid;gap:8px;margin:0 0 12px}.al-item{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #dce5ee;border-radius:12px;padding:10px 12px;cursor:pointer;background:#fff;text-align:left;font:inherit;width:100%}" +
    ".al-item b{display:block;color:#17283b}.al-item small{color:#68788a}.al-tag{background:#f59e0b;color:#fff;border-radius:6px;padding:2px 7px;font-size:11px;font-weight:900;margin-right:6px}" +
    ".al-btns{display:flex;flex-wrap:wrap;gap:8px}.al-link{border:0;background:none;color:#b23a2e;text-decoration:underline;font:inherit;font-size:13px;cursor:pointer}" +
    ".al-app{margin-top:14px;border-top:1px dashed #dce5ee;padding-top:14px}.al-app p{margin:4px 0 10px;color:#68788a;font-size:14px}.al-ios{font-size:13px;background:#fff6df;border-radius:8px;padding:8px 10px;color:#765313}" +
    ".card.al-hl{outline:3px solid #f59e0b;outline-offset:3px}" +
    ".al-cats{display:grid;grid-template-columns:1fr 1fr;gap:8px}.al-cats label{display:flex;gap:8px;align-items:center;border:1px solid #dce5ee;border-radius:10px;padding:9px 10px;font-weight:700;font-size:14px;cursor:pointer}" +
    ".al-cats input{width:18px;height:18px;accent-color:#155da8}@media(max-width:620px){.al-cats{grid-template-columns:1fr}}";
  document.head.appendChild(css);

  /* ---------- the section on the home page ---------- */
  var sec;
  function build() {
    var props = $("#properties"); if (!props) return;
    sec = document.createElement("section"); sec.id = "myAlerts";
    sec.innerHTML = '<div class="wrap"><div class="abox"><div class="kicker al-k"></div><h2 class="al-t"></h2><div class="al-body"></div>' +
      '<div class="al-app" hidden><div class="al-head al-at"></div><p class="al-ap"></p>' +
      '<button type="button" class="btn install-btn" hidden onclick="installApp()"></button><div class="al-ios" hidden></div></div></div></div>';
    props.parentNode.insertBefore(sec, props);
    render();
  }
  function isStandalone() { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }

  function distLabel(en) {
    if (typeof sriLankaLocations === "undefined") return en;
    for (var i = 0; i < sriLankaLocations.length; i++) if (sriLankaLocations[i].en === en) return sriLankaLocations[i][lang()] || en;
    return en;
  }
  function summary(p) {
    var parts = [p.type === "Rent" ? t("rent") : t("buy"),
      p.cats && p.cats.length ? p.cats.map(catName).join(", ") : t("any"),
      p.district ? distLabel(p.district) + (p.town ? " – " + p.town : "") : t("anyDist")];
    if (p.max) parts.push(t("upTo") + " " + Number(p.max).toLocaleString("en-LK"));
    return parts.join(" • ");
  }

  function render() {
    if (!sec) return;
    $(".al-k", sec).textContent = t("kicker"); $(".al-t", sec).textContent = t("title");
    var p = load(), body = $(".al-body", sec);
    if (!p) {
      body.innerHTML = '<p class="ai">' + esc(t("intro")) + '</p><button type="button" class="btn al-set">' + esc(t("set")) + "</button>";
    } else {
      var all = listings().filter(function (x) { return matches(p, x); });
      var fresh = all.filter(function (x) { return x.added && p.lastSeen && x.added > p.lastSeen; });
      all.sort(function (a, b) { return (b.added || "").localeCompare(a.added || ""); });
      var head = fresh.length ? '<div class="al-head al-new">' + esc(t("newN").replace("%N", fresh.length)) + "</div>"
               : all.length ? '<div class="al-head">' + esc(t("found").replace("%N", all.length)) + "</div>" : "";
      var list = all.length ? '<div class="al-list">' + all.slice(0, 6).map(function (x) {
          var isNew = fresh.indexOf(x) >= 0;
          return '<button type="button" class="al-item" data-id="' + esc(x.id) + '"><span>' + (isNew ? '<span class="al-tag">' + esc(t("newTag")) + "</span>" : "") +
            "<b>" + esc(x.title) + "</b><small>" + esc(x.priceText) + " · " + esc(distLabel(x.district)) + " · " + esc(x.id) + "</small></span><span>" + esc(t("view")) + "</span></button>";
        }).join("") + "</div>" : '<p class="ai">' + esc(t("none")) + "</p>";
      body.innerHTML = '<div class="al-sum">' + esc(t("looking")) + " " + esc(summary(p)) + "</div>" + head + list +
        '<div class="al-btns"><button type="button" class="btn outline al-set">' + esc(t("edit")) + '</button>' +
        '<button type="button" class="btn outline al-tell" title="' + esc(t("tellJHint")) + '">' + esc(t("tellJ")) + '</button>' +
        '<button type="button" class="al-link al-clear">' + esc(t("clear")) + "</button></div>";
    }
    // app download area: only when not already running as the app
    var app = $(".al-app", sec), ios = $(".al-ios", sec), ib = $(".install-btn", sec);
    $(".al-at", sec).textContent = t("appTitle"); $(".al-ap", sec).textContent = t("appText");
    ib.textContent = t("appTitle"); ios.textContent = t("iosTip");
    var canInstall = !!window.installPrompt, iosTip = isIOS() && !isStandalone();
    ib.hidden = !canInstall; ios.hidden = !iosTip; app.hidden = isStandalone() || (!canInstall && !iosTip);
  }

  /* ---------- the "mark what I want" form ---------- */
  function openForm() {
    var p = load() || { type: "Buy", district: "", town: "", cats: [], max: "" };
    var m = document.createElement("div"); m.className = "modal show"; m.id = "alertModal";
    var dOpts = '<option value="">' + esc(t("anyDist")) + "</option>" +
      (typeof sriLankaLocations !== "undefined" ? sriLankaLocations : []).map(function (d) {
        return '<option value="' + esc(d.en) + '"' + (d.en === p.district ? " selected" : "") + ">" + esc(d[lang()] || d.en) + "</option>"; }).join("");
    m.innerHTML = '<div class="modalbox"><div class="modalhead"><div><div class="kicker">' + esc(t("kicker")) + '</div><h2 style="margin:3px 0;color:var(--navy)">' + esc(t("mTitle")) +
      '</h2></div><button type="button" class="close al-x">×</button></div><p class="notice">' + esc(t("mNote")) + '</p>' +
      '<form class="al-form"><div class="formgrid">' +
      '<div class="field"><label>' + esc(t("lType")) + '</label><select name="type"><option value="Buy"' + (p.type !== "Rent" ? " selected" : "") + ">" + esc(t("buy")) +
      '</option><option value="Rent"' + (p.type === "Rent" ? " selected" : "") + ">" + esc(t("rent")) + "</option></select></div>" +
      '<div class="field"><label>' + esc(t("lMax")) + '</label><input name="max" type="number" min="0" inputmode="numeric" value="' + esc(p.max || "") + '" placeholder="5000000"></div>' +
      '<div class="field"><label>' + esc(t("lDist")) + '</label><select name="district">' + dOpts + "</select></div>" +
      '<div class="field"><label>' + esc(t("lTown")) + '</label><select name="town"></select></div>' +
      '<div class="field full"><label>' + esc(t("lCats")) + '</label><div class="al-cats">' + CATS.map(function (c) {
        return '<label><input type="checkbox" name="cat" value="' + esc(c[0]) + '"' + (p.cats && p.cats.indexOf(c[0]) >= 0 ? " checked" : "") + "> " + esc(c[LI[lang()]]) + "</label>"; }).join("") +
      "</div></div></div>" +
      '<div class="al-btns" style="margin-top:14px"><button type="submit" class="btn">' + esc(t("save")) + '</button><button type="button" class="btn outline al-x">' + esc(t("cancel")) + "</button></div></form></div>";
    document.body.appendChild(m);
    var f = $(".al-form", m), dSel = f.elements.district, tSel = f.elements.town;
    function fillTowns(keep) {
      var d = (typeof sriLankaLocations !== "undefined" ? sriLankaLocations : []).filter(function (x) { return x.en === dSel.value; })[0];
      tSel.innerHTML = '<option value="">' + esc(t("anyTown")) + "</option>" + (d ? d.towns.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + "</option>"; }).join("") : "");
      tSel.disabled = !d; if (keep) tSel.value = p.town || "";
    }
    fillTowns(true); dSel.addEventListener("change", function () { fillTowns(false); });
    function close() { m.remove(); }
    $$(".al-x", m).forEach(function (b) { b.addEventListener("click", close); });
    m.addEventListener("click", function (e) { if (e.target === m) close(); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var old = load();
      save({ type: f.elements.type.value, district: dSel.value, town: tSel.value,
             cats: $$('input[name="cat"]:checked', f).map(function (x) { return x.value; }),
             max: Number(f.elements.max.value) || "",
             lastSeen: old && old.lastSeen ? old.lastSeen : new Date().toISOString().slice(0, 10) });
      close(); render();
      try { if (window.gtag) gtag("event", "alert_saved", { language: lang() }); } catch (x) {}
    });
  }

  /* ---------- "Tell Jayalath too": opens the buyer request with these details filled in ---------- */
  function tellJayalath() {
    var p = load(); if (!p || typeof openBuyerModal !== "function") return;
    openBuyerModal();
    var set = function (id, v) { var e = document.getElementById(id); if (e && v) e.value = v; };
    set("buyerDistrict", p.district ? distLabel(p.district) : ""); set("buyerTown", p.town); set("buyerMax", p.max);
    if (p.cats && p.cats.length) set("buyerType", p.cats[0]);
    var det = document.getElementById("buyerDetails");
    if (det && !det.value) det.value = summary(p);
  }

  /* ---------- clicks ---------- */
  document.addEventListener("click", function (e) {
    if (!sec || !sec.contains(e.target)) return;
    if (e.target.closest(".al-set")) return openForm();
    if (e.target.closest(".al-clear")) { clear(); return render(); }
    if (e.target.closest(".al-tell")) return tellJayalath();
    var it = e.target.closest(".al-item");
    if (it) {
      var card = listings().filter(function (x) { return x.id === it.dataset.id; })[0];
      if (card) {
        if (typeof showAll === "function") showAll();
        card.el.scrollIntoView({ behavior: "smooth", block: "center" });
        card.el.classList.add("al-hl"); setTimeout(function () { card.el.classList.remove("al-hl"); }, 2500);
      }
    }
  });

  /* remember this visit when the visitor leaves, so next time only newer listings show as NEW */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "hidden") return;
    var p = load(); if (!p) return;
    p.lastSeen = new Date().toISOString().slice(0, 10); save(p);
  });

  new MutationObserver(render).observe(document.body, { attributes: true, attributeFilter: ["data-language"] });
  window.addEventListener("beforeinstallprompt", function () { setTimeout(render, 0); });
  window.addEventListener("appinstalled", function () { setTimeout(render, 0); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
