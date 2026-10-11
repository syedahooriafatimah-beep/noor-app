// ---- Namaz ke auqaat (API se), countdown aur tracker ----
// Apna shehar yahan badlein:
const CITY = "Islamabad";
const COUNTRY = "Pakistan";
const METHOD = 1;   // 1 = University of Islamic Sciences, Karachi
const SCHOOL = 1;   // 1 = Hanafi Asr

// Internet na ho to yeh haath se likhe hue auqaat chalenge.
// h = ghanta (24 ghante wali ghari), m = minute
const prayers = [
  { key: "Fajr",    nameUr: "فجر",         h: 4,  m: 40, isPrayer: true },
  { key: "Sunrise", nameUr: "طلوعِ آفتاب", h: 6,  m: 3,  isPrayer: false },
  { key: "Dhuhr",   nameUr: "ظہر",         h: 11, m: 55, isPrayer: true },
  { key: "Asr",     nameUr: "عصر",         h: 16, m: 4,  isPrayer: true },
  { key: "Maghrib", nameUr: "مغرب",        h: 17, m: 45, isPrayer: true },
  { key: "Isha",    nameUr: "عشاء",        h: 19, m: 8,  isPrayer: true },
  { key: "Tahajjud", nameUr: "تہجد",       h: 0,  m: 0,  isPrayer: false, nafl: true }
];

// ---- Tahajjud: raat (Maghrib se Fajr) ka aakhri tihai ----
function recomputeTahajjud() {
  const fajr = prayers.find(function (p) { return p.key === "Fajr"; });
  const maghrib = prayers.find(function (p) { return p.key === "Maghrib"; });
  const tah = prayers.find(function (p) { return p.key === "Tahajjud"; });

  const fajrMin = fajr.h * 60 + fajr.m;
  const maghribMin = maghrib.h * 60 + maghrib.m;
  const nightLen = (24 * 60 - maghribMin) + fajrMin;
  const startMin = (fajrMin - Math.floor(nightLen / 3) + 24 * 60) % (24 * 60);

  tah.h = Math.floor(startMin / 60);
  tah.m = startMin % 60;
}

recomputeTahajjud();

const listEl2 = document.getElementById("prayerList");
const nextNameEl = document.getElementById("nextName");
const nextCountEl = document.getElementById("nextCount");

// 24 ghante se 12 ghante mein badalna
function fmt12(h, m) {
  const ampm = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return hh + ":" + String(m).padStart(2, "0") + " " + ampm;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// Kisi namaz ka waqt (aaj ya kal ka)
function timeOf(p, dayOffset) {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate() + dayOffset, p.h, p.m, 0);
}

// Kis ke saamne tick ka dibba ho (5 namazen aur Tahajjud)
function hasBox(p) {
  return p.isPrayer || p.nafl;
}

// ---- Tracker ka data ----
function todayKey() {
  const n = new Date();
  return n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate());
}

let done = {};
try {
  const saved = localStorage.getItem("noorDone");
  if (saved) {
    done = JSON.parse(saved);
  }
} catch (e) {}

function saveDone() {
  try {
    localStorage.setItem("noorDone", JSON.stringify(done));
  } catch (e) {}
}

function isDone(key) {
  const day = done[todayKey()];
  return !!(day && day[key]);
}

// "Aaj parh li: 3 / 5" (sirf 5 farz namazen)
const summaryEl = document.createElement("p");
summaryEl.className = "doneCount";
listEl2.parentNode.insertBefore(summaryEl, listEl2);

function updateSummary() {
  let n = 0;
  prayers.forEach(function (p) {
    if (p.isPrayer && isDone(p.key)) {
      n = n + 1;
    }
  });
  summaryEl.textContent = "Aaj parh li: " + n + " / 5";
}

// ---- List ek baar banana ----
prayers.forEach(function (p) {
  const li = document.createElement("li");
  li.id = "pr-" + p.key;

  let box = "";
  if (hasBox(p)) {
    box = '<input type="checkbox" id="chk-' + p.key + '" aria-label="' + p.key + ' parh li">';
  }

  const label = p.nafl ? p.key + " <small>(raat ka aakhri tihai)</small>" : p.key;

  li.innerHTML =
    '<span class="ur">' + p.nameUr + "</span>" +
    "<span>" + label + "</span>" +
    '<span id="tm-' + p.key + '">' + fmt12(p.h, p.m) + "</span>" +
    box;

  listEl2.appendChild(li);

  if (hasBox(p)) {
    document.getElementById("chk-" + p.key).addEventListener("change", function (e) {
      const k = todayKey();
      if (!done[k]) {
        done[k] = {};
      }
      done[k][p.key] = e.target.checked;
      saveDone();
      updateSummary();
    });
  }
});

// Auqaat ka source dikhane wali line
const sourceEl = document.createElement("small");
sourceEl.className = "credit";
sourceEl.textContent = "Auqaat haath se likhe hue hain.";
listEl2.insertAdjacentElement("afterend", sourceEl);

function showTimesOnScreen() {
  prayers.forEach(function (p) {
    document.getElementById("tm-" + p.key).textContent = fmt12(p.h, p.m);
  });
}

// ---- API se auqaat lana ----
function applyTimings(t) {
  ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(function (k) {
    // API "04:40" ya "04:40 (PKT)" bhej sakti hai, pehla hissa lo
    const raw = String(t[k]).split(" ")[0];
    const parts = raw.split(":");
    const p = prayers.find(function (x) { return x.key === k; });
    p.h = Number(parts[0]);
    p.m = Number(parts[1]);
  });
  recomputeTahajjud();
  showTimesOnScreen();
}

async function loadTimes() {
  const day = todayKey();

  // aaj ke auqaat pehle se yaad hon to wahi lo
  try {
    const cached = JSON.parse(localStorage.getItem("noorTimes") || "null");
    if (cached && cached.day === day && cached.city === CITY) {
      applyTimings(cached.timings);
      sourceEl.textContent = "Auqaat: " + CITY + " (Karachi method, Hanafi Asr) - AlAdhan.com. Masjid ki jantri se mila lein.";
      return;
    }
  } catch (e) {}

  try {
    const url =
      "https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(CITY) +
      "&country=" + encodeURIComponent(COUNTRY) +
      "&method=" + METHOD + "&school=" + SCHOOL;
    const res = await fetch(url);
    const json = await res.json();
    const timings = json.data.timings;

    applyTimings(timings);
    sourceEl.textContent = "Auqaat: " + CITY + " (Karachi method, Hanafi Asr) - AlAdhan.com. Masjid ki jantri se mila lein.";

    try {
      localStorage.setItem("noorTimes", JSON.stringify({ day: day, city: CITY, timings: timings }));
    } catch (e) {}
  } catch (e) {
    sourceEl.textContent = "Internet na milne ki wajah se haath se likhe hue auqaat chal rahe hain.";
  }
}

// Tick ko aaj ke din ke mutabiq lagana
let shownDay = "";
function refreshChecks() {
  prayers.forEach(function (p) {
    if (hasBox(p)) {
      document.getElementById("chk-" + p.key).checked = isDone(p.key);
    }
  });
  updateSummary();
  shownDay = todayKey();
}

// ---- Agli namaz aur countdown ----
function updateNext() {
  // naya din shuru ho gaya to tick saaf karo aur naye auqaat lo
  if (todayKey() !== shownDay) {
    refreshChecks();
    loadTimes();
  }

  const now = new Date();
  let next = null;
  let nextTime = null;

  // sirf farz namazen dekho (Sunrise aur Tahajjud nahi)
  prayers.forEach(function (p) {
    if (!p.isPrayer || next) return;
    const t = timeOf(p, 0);
    if (t > now) {
      next = p;
      nextTime = t;
    }
  });

  // aaj ki saari namazen guzar gayin to kal ki Fajr
  if (!next) {
    next = prayers[0];
    nextTime = timeOf(next, 1);
  }

  const diff = Math.floor((nextTime - now) / 1000);
  const hh = Math.floor(diff / 3600);
  const mm = Math.floor((diff % 3600) / 60);
  const ss = diff % 60;

  nextNameEl.textContent = next.nameUr + " - " + next.key;
  nextCountEl.textContent = pad(hh) + ":" + pad(mm) + ":" + pad(ss);

  prayers.forEach(function (p) {
    document.getElementById("pr-" + p.key).classList.toggle("nextOn", p.key === next.key);
  });
}

refreshChecks();
loadTimes();
updateNext();
setInterval(updateNext, 1000);