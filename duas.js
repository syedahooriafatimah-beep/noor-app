// ---- Masnoon duayen ----
// Naya dua jorne ke liye ek { ... } copy karein aur sirf bharosay ki kitab se dekh kar likhein.
const duas = [
  {
    title: "Subah uthte waqt",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    ur: "تمام تعریف اللہ کے لیے ہے جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا، اور اسی کی طرف لوٹنا ہے۔",
    en: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    src: "Sahih Bukhari"
  },
  {
    title: "Sone se pehle",
    ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    ur: "اے اللہ! تیرے ہی نام سے میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔",
    en: "In Your name, O Allah, I die and I live.",
    src: "Sahih Bukhari"
  },
  {
    title: "Khane ke baad",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    ur: "تمام تعریف اللہ کے لیے ہے جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔",
    en: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    src: "Sunan Abu Dawud, Jami at-Tirmidhi"
  },
  {
    title: "Masjid mein dakhil hote waqt",
    ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    ur: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
    en: "O Allah, open for me the doors of Your mercy.",
    src: "Sahih Muslim"
  },
  {
    title: "Masjid se nikalte waqt",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    ur: "اے اللہ! میں تجھ سے تیرا فضل مانگتا ہوں۔",
    en: "O Allah, I ask You of Your bounty.",
    src: "Sahih Muslim"
  },
  {
    title: "Dunya aur aakhirat ki bhalai",
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    ur: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
    en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    src: "Quran 2:201 (Surah Al-Baqarah)"
  }
];

const duaListEl = document.getElementById("duaList");

duas.forEach(function (d) {
  const box = document.createElement("div");
  box.className = "dua";

  const h = document.createElement("h3");
  h.textContent = d.title;
  box.appendChild(h);

  const ar = document.createElement("p");
  ar.className = "ar";
  ar.textContent = d.ar;
  box.appendChild(ar);

  const ur = document.createElement("p");
  ur.className = "ur";
  ur.textContent = d.ur;
  box.appendChild(ur);

  const en = document.createElement("p");
  en.className = "en";
  en.textContent = d.en;
  box.appendChild(en);

  const src = document.createElement("small");
  src.textContent = "Hawala / Source: " + d.src;
  box.appendChild(src);

  duaListEl.appendChild(box);
});