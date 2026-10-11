// ---- Tabs ----
const buttons = document.querySelectorAll("nav button");
const tabs = document.querySelectorAll(".tab");

function showTab(name) {
  tabs.forEach(function (t) {
    t.classList.remove("active");
  });
  document.getElementById(name).classList.add("active");
}

buttons.forEach(function (b) {
  b.addEventListener("click", function () {
    showTab(b.dataset.tab);
  });
});

showTab("namaz");

// ---- Wazaif ka data ----
// Naya wazifa jorne ke liye ek { ... } copy karein, id badlein (w9, w10...),
// aur sirf bharosay ki kitab se dekh kar likhein.
const wazaif = [
  {
    id: "w1",
    name: "SubhanAllah",
    nameUr: "سبحان اللہ",
    ar: "سُبْحَانَ اللَّهِ",
    target: 33,
    fazilatUr: "ہر نماز کے بعد ۳۳ مرتبہ سبحان اللہ پڑھنا سنت سے ثابت ہے۔",
    fazilatEn: "Saying SubhanAllah 33 times after every prayer is established from the Sunnah.",
    src: "Sahih Muslim"
  },
  {
    id: "w2",
    name: "Alhamdulillah",
    nameUr: "الحمد للہ",
    ar: "الْحَمْدُ لِلَّهِ",
    target: 33,
    fazilatUr: "ہر نماز کے بعد ۳۳ مرتبہ الحمد للہ پڑھنا سنت سے ثابت ہے۔ حدیث میں ہے کہ الحمد للہ (نیکیوں کے) ترازو کو بھر دیتا ہے۔",
    fazilatEn: "Saying Alhamdulillah 33 times after every prayer is established from the Sunnah. A hadith says Alhamdulillah fills the scale (of good deeds).",
    src: "Sahih Muslim"
  },
  {
    id: "w3",
    name: "Allahu Akbar",
    nameUr: "اللہ اکبر",
    ar: "اللَّهُ أَكْبَرُ",
    target: 33,
    fazilatUr: "ہر نماز کے بعد ۳۳ مرتبہ اللہ اکبر پڑھنا سنت سے ثابت ہے۔",
    fazilatEn: "Saying Allahu Akbar 33 times after every prayer is established from the Sunnah.",
    src: "Sahih Muslim"
  },
  {
    id: "w4",
    name: "Kalima Tawheed",
    nameUr: "کلمہ توحید",
    ar: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    target: 100,
    fazilatUr: "جو شخص اسے دن میں سو مرتبہ پڑھے، اسے دس غلام آزاد کرنے کا ثواب ملتا ہے، اس کے لیے سو نیکیاں لکھی جاتی ہیں، سو گناہ مٹائے جاتے ہیں، اور شام تک شیطان سے حفاظت ملتی ہے۔",
    fazilatEn: "Whoever says this 100 times in a day gets the reward of freeing ten slaves, 100 good deeds are written for them, 100 sins are erased, and they are protected from Satan until evening.",
    src: "Sahih Bukhari, Sahih Muslim"
  },
  {
    id: "w5",
    name: "SubhanAllahi wa bihamdihi",
    nameUr: "سبحان اللہ و بحمدہ",
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    target: 100,
    fazilatUr: "جو دن میں سو مرتبہ پڑھے، اس کے گناہ معاف کر دیے جاتے ہیں خواہ سمندر کی جھاگ کے برابر ہوں۔",
    fazilatEn: "Whoever says it 100 times a day, their sins are forgiven even if they are like the foam of the sea.",
    src: "Sahih Bukhari, Sahih Muslim"
  },
  {
    id: "w6",
    name: "SubhanAllahil Azeem",
    nameUr: "سبحان اللہ العظیم",
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    target: 100,
    fazilatUr: "دو کلمے جو زبان پر ہلکے، ترازو میں بھاری، اور رحمان کو محبوب ہیں۔",
    fazilatEn: "Two phrases that are light on the tongue, heavy on the scale, and beloved to the Most Merciful.",
    src: "Sahih Bukhari, Sahih Muslim"
  },
  {
    id: "w7",
    name: "Istighfar",
    nameUr: "استغفار",
    ar: "أَسْتَغْفِرُ اللَّهَ",
    target: 100,
    fazilatUr: "نبی ﷺ دن میں ستر سے زیادہ مرتبہ استغفار کرتے تھے۔ ایک روایت میں دن میں سو مرتبہ توبہ کا ذکر ہے۔",
    fazilatEn: "The Prophet ﷺ used to seek forgiveness more than seventy times a day. One narration mentions repenting 100 times a day.",
    src: "Sahih Bukhari, Sahih Muslim"
  },
  {
    id: "w8",
    name: "Durood Sharif",
    nameUr: "درود شریف",
    ar: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
    target: 100,
    fazilatUr: "جو نبی ﷺ پر ایک مرتبہ درود بھیجے، اللہ اس پر دس رحمتیں بھیجتا ہے۔",
    fazilatEn: "Whoever sends one blessing upon the Prophet ﷺ, Allah sends ten blessings upon them.",
    src: "Sahih Muslim"
  }
];

// ---- Ginti yaad rakhna ----
let counts = {};
try {
  const saved = localStorage.getItem("noorWazaif");
  if (saved) {
    counts = JSON.parse(saved);
  }
} catch (e) {}

function save() {
  try {
    localStorage.setItem("noorWazaif", JSON.stringify(counts));
  } catch (e) {}
}

// ---- Screen ke hisse ----
const listEl = document.getElementById("wlist");
const nameUrEl = document.getElementById("wnameUr");
const nameEl = document.getElementById("wname");
const arabicEl = document.getElementById("arabic");
const countEl = document.getElementById("count");
const roundEl = document.getElementById("round");
const msgEl = document.getElementById("msg");
const fazilatUrEl = document.getElementById("fazilatUr");
const fazilatEnEl = document.getElementById("fazilatEn");
const srcEl = document.getElementById("src");

let currentId = wazaif[0].id;
const wzButtons = {};

function current() {
  return wazaif.find(function (w) {
    return w.id === currentId;
  });
}

function render() {
  const w = current();
  const total = counts[w.id] || 0;

  nameUrEl.textContent = w.nameUr;
  nameEl.textContent = w.name;
  arabicEl.textContent = w.ar;
  countEl.textContent = total % w.target;
  roundEl.textContent =
    "Target: " + w.target + "  |  Round: " + Math.floor(total / w.target) + "  |  Kul: " + total;
  fazilatUrEl.textContent = w.fazilatUr;
  fazilatEnEl.textContent = w.fazilatEn;
  srcEl.textContent = "Hawala / Source: " + w.src;
  msgEl.textContent = "";

  wazaif.forEach(function (x) {
    wzButtons[x.id].classList.toggle("on", x.id === currentId);
  });
}

// ---- Wazaif ke buttons banana ----
wazaif.forEach(function (w) {
  const b = document.createElement("button");
  b.className = "wz";
  b.innerHTML = '<span class="ur">' + w.nameUr + "</span><small>" + w.name + "</small>";
  b.addEventListener("click", function () {
    currentId = w.id;
    render();
  });
  listEl.appendChild(b);
  wzButtons[w.id] = b;
});

// ---- Ginti aur Reset ----
document.getElementById("ginti").addEventListener("click", function () {
  const w = current();
  counts[w.id] = (counts[w.id] || 0) + 1;
  save();
  render();
  if (counts[w.id] % w.target === 0) {
    msgEl.textContent = "ماشاء اللہ! Round poora ho gaya.";
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }
});

document.getElementById("reset").addEventListener("click", function () {
  counts[currentId] = 0;
  save();
  render();
});

render();