/* JAYALATH PROPERTIES – WhatsApp messages (like TopGoviya)
  Every WhatsApp message from the website:
  - says it came from the JAYALATH PROPERTIES website
  - is in the visitor's selected language (සිංහල / English / தமிழ்)
  - lists only the details the visitor filled in
  The visitor still presses Send in WhatsApp themselves. */
(function () {
 "use strict";
 var WA_NUMBER = "94765606450";     // Jayalath's WhatsApp – change here only
 var SITE = "https://jayalathproperties.github.io/";

 var T = {
  si: {
   hello: "ආයුබෝවන් ජයලත් මහතා!",
   from: "*JAYALATH PROPERTIES වෙබ් අඩවියෙන් පණිවිඩයක්*",
   general: "මට දේපළක් ගැන තොරතුරු දැනගන්න ඕන.",
   buyerHead: "*මට දේපළක් සොයා දෙන්න*",
   sellerHead: "*දේපළ හිමිකරුගේ ඉල්ලීම*",
   inqHead: "*මෙම දේපළ ගැන විමසීමක්*",
   name: "නම", phone: "දුරකථන / WhatsApp", email: "ඊමේල්", country: "ජීවත් වන රට", lang: "කැමති භාෂාව",
   contact: "සම්බන්ධ කරගත යුතු ක්‍රමය", type: "දේපළ වර්ගය", district: "දිස්ත්‍රික්කය", town: "නගරය / ප්‍රදේශය",
   min: "අවම අයවැය (රු.)", max: "උපරිම අයවැය (රු.)", details: "අමතර විස්තර", request: "ඉල්ලීම",
   price: "අපේක්ෂිත මිල (රු.)", size: "ප්‍රමාණය", desc: "විස්තරය", prop: "දේපළ", id: "දේපළ අංකය",
   askPrice: "මිල", loc: "ස්ථානය", inq: "විමසීම", budget: "අයවැය (රු.)", visit: "නැරඹීමට කැමති දිනය / වේලාව", page: "පිටුව",
   buyerEnd: "කරුණාකර ගැළපෙන දේපළ ගැන මා අමතන්න.",
   sellerEnd: "දේපළේ ඡායාරූප මෙම WhatsApp chat එකෙන්ම එවන්නම්. කරුණාකර තහවුරු කිරීම, කොන්දේසි සහ ඊළඟ පියවර ගැන කතා කරමු.",
   inqEnd: "කරුණාකර මා අමතන්න."
  },
  en: {
   hello: "Hello Jayalath!",
   from: "*Message from the JAYALATH PROPERTIES website*",
   general: "I would like information about a property.",
   buyerHead: "*Please help me find a property*",
   sellerHead: "*Property owner request*",
   inqHead: "*Enquiry about this property*",
   name: "Name", phone: "Phone / WhatsApp", email: "Email", country: "Country I live in", lang: "Preferred language",
   contact: "Contact me by", type: "Property type", district: "District", town: "Town / area",
   min: "Minimum budget (LKR)", max: "Maximum budget (LKR)", details: "More details", request: "Request",
   price: "Expected price (LKR)", size: "Land size / floor area", desc: "Description", prop: "Property", id: "Property ID",
   askPrice: "Price", loc: "Location", inq: "Enquiry", budget: "Budget (LKR)", visit: "Preferred visit date / time", page: "Page",
   buyerEnd: "Please contact me about suitable properties.",
   sellerEnd: "I will send the property photos in this WhatsApp chat. Please let's discuss verification, terms and next steps.",
   inqEnd: "Please contact me."
  },
  ta: {
   hello: "வணக்கம் ஜயலத்!",
   from: "*JAYALATH PROPERTIES இணையதளத்திலிருந்து செய்தி*",
   general: "ஒரு சொத்து பற்றி தகவல் அறிய விரும்புகிறேன்.",
   buyerHead: "*எனக்கு ஒரு சொத்தைத் தேடித் தாருங்கள்*",
   sellerHead: "*சொத்து உரிமையாளர் கோரிக்கை*",
   inqHead: "*இந்தச் சொத்து பற்றிய விசாரணை*",
   name: "பெயர்", phone: "தொலைபேசி / WhatsApp", email: "மின்னஞ்சல்", country: "வசிக்கும் நாடு", lang: "விரும்பும் மொழி",
   contact: "தொடர்பு முறை", type: "சொத்து வகை", district: "மாவட்டம்", town: "நகரம் / பகுதி",
   min: "குறைந்தபட்ச பட்ஜெட் (LKR)", max: "அதிகபட்ச பட்ஜெட் (LKR)", details: "கூடுதல் விவரங்கள்", request: "கோரிக்கை",
   price: "எதிர்பார்க்கும் விலை (LKR)", size: "அளவு", desc: "விவரம்", prop: "சொத்து", id: "சொத்து எண்",
   askPrice: "விலை", loc: "இடம்", inq: "விசாரணை", budget: "பட்ஜெட் (LKR)", visit: "பார்வையிட விரும்பும் நாள் / நேரம்", page: "பக்கம்",
   buyerEnd: "பொருத்தமான சொத்துகள் பற்றி என்னைத் தொடர்புகொள்ளுங்கள்.",
   sellerEnd: "சொத்தின் புகைப்படங்களை இந்த WhatsApp உரையாடலில் அனுப்புகிறேன். சரிபார்ப்பு, நிபந்தனைகள் மற்றும் அடுத்த படிகள் பற்றி பேசுவோம்.",
   inqEnd: "தயவுசெய்து என்னைத் தொடர்புகொள்ளுங்கள்."
  }
 };
 function lang() { return (document.body && document.body.dataset.language) || "si"; }
 function t(k) { return (T[lang()] || T.si)[k]; }
 function el(id) { return document.getElementById(id); }
 function val(id) { var e = el(id); return e ? String(e.value || "").trim() : ""; }
 // for drop-downs, use the words the visitor actually saw (already in their language)
 function shown(id) { var e = el(id); if (!e) return ""; var o = e.selectedOptions && e.selectedOptions[0]; return o ? o.textContent.trim() : val(id); }
 function money(v) { var n = Number(String(v).replace(/[^\d.]/g, "")); return n ? n.toLocaleString("en-LK") : v; }
 function line(label, v) { return v ? "• "+ t(label) + ": "+ v : ""; }
 function build(head, rows, end) {
  return [t("hello"), t("from"), "", head, ""].concat(rows.filter(Boolean)).concat(["", end, "", ""+ SITE]).join("\n");
 }
 function track(where) { try { if (window.gtag) gtag("event", "whatsapp_click", { place: where, language: lang() }); } catch (x) {} }
 function openWA(text, where) {
  track(where);
  window.open("https://wa.me/"+ WA_NUMBER + "?text="+ encodeURIComponent(text), "_blank");
 }

 /* ---------- 1. plain WhatsApp buttons (header, menu, floating, bottom bar, contact, blog) ---------- */
 function generalText() { return [t("hello"), t("from"), "", t("general"), "", ""+ SITE].join("\n"); }
 function updateButtons() {
  var href = "https://wa.me/"+ WA_NUMBER + "?text="+ encodeURIComponent(generalText());
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="https://wa.me/"]'), function (a) {
   a.href = href;
   if (!a.dataset.waTracked) {
    a.dataset.waTracked = "1";
    a.addEventListener("click", function () {
     var place = a.classList.contains("whatsapp-float") ? "floating": a.closest(".mobilebar") ? "bottom_bar":
           a.closest(".mobile-drawer") ? "menu": a.closest("header") ? "header": a.closest("#blogPage") ? "blog": "contact";
     track(place);
    });
   }
  });
 }

 /* ---------- 2. "Help me find a property"form ---------- */
 window.submitBuyerRequest = function (e) {
  e.preventDefault();
  var min = val("buyerMin"), max = val("buyerMax");
  openWA(build(t("buyerHead"), [
   line("name", val("buyerName")), line("phone", val("buyerPhone")), line("email", val("buyerEmail")),
   line("country", val("buyerCountry")), line("lang", shown("buyerLang")), line("contact", shown("buyerContact")),
   line("type", shown("buyerType")), line("district", val("buyerDistrict")), line("town", val("buyerTown")),
   line("min", min && money(min)), line("max", max && money(max)), line("details", val("buyerDetails"))
  ], t("buyerEnd")), "buyer_form");
  if (typeof closeBuyerModal === "function") closeBuyerModal();
 };

 /* ---------- 3. Sell / advertise form ---------- */
 window.submitSellerRequest = function (e) {
  e.preventDefault();
  var price = val("sellerPrice");
  openWA(build(t("sellerHead"), [
   line("request", shown("sellerRequestType")), line("name", val("sellerName")), line("phone", val("sellerPhone")),
   line("email", val("sellerEmail")), line("type", shown("sellerPropertyType")), line("district", val("sellerDistrict")),
   line("town", val("sellerTown")), line("price", price && money(price)), line("size", val("sellerSize")),
   line("desc", val("sellerDetails"))
  ], t("sellerEnd")), "seller_form");
  if (typeof closeSellerModal === "function") closeSellerModal();
 };

 /* ---------- 4. Enquiry about one property ---------- */
 var lastCard = null;
 document.addEventListener("click", function (ev) {
  var link = ev.target.closest && ev.target.closest("#propertyCards .textlink");
  if (link) lastCard = link.closest(".card");
 }, true);
 function cardInfo() {
  var c = lastCard; if (!c) return {};
  var q = function (s) { var x = c.querySelector(s); return x ? x.textContent.replace(/\u{1F4CD}|\u2192/gu, "").trim() : ""; };
  return { id: q(".cardfoot .muted"), title: q("h3"), price: q(".price"), loc: q(".loc") };
 }
 window.submitDemo = function (e) {
  e.preventDefault();
  var p = cardInfo(), cp = window.currentProperty || {};
  var min = val("minBudget"), max = val("maxBudget");
  var budget = (min || max) ? [min && money(min), max && money(max)].filter(Boolean).join(" – ") : "";
  var visit = [val("visitDate"), shown("visitTime")].filter(Boolean).join(" · ");
  openWA(build(t("inqHead"), [
   line("id", p.id || cp.id), line("prop", p.title || cp.title), line("askPrice", p.price || cp.price), line("loc", p.loc || cp.location), "",
   line("name", val("custName")), line("phone", val("custPhone")), line("email", val("custEmail")),
   line("inq", shown("inqType")), line("budget", budget), line("visit", visit), line("details", val("extra"))
  ], t("inqEnd")), "property_enquiry");
  if (typeof closeModal === "function") closeModal();
 };

 /* ---------- keep the plain buttons in the selected language ---------- */
 new MutationObserver(updateButtons).observe(document.body, { attributes: true, attributeFilter: ["data-language"] });
 if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", updateButtons); else updateButtons();
})();
