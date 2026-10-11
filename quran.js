// ---- Quran: AlQuran.cloud API se poora Quran ----
(function () {
  const API = "https://api.alquran.cloud/v1";

  const selectEl = document.getElementById("quranSelect");
  const bodyEl = document.getElementById("quranBody");
  const showUr = document.getElementById("showUr");
  const showEn = document.getElementById("showEn");

  let current = null; // abhi khuli hui surah ka data

  function say(text) {
    bodyEl.textContent = text;
  }

  // 114 surahs ki list lana
  async function loadList() {
    say("Surahs ki list aa rahi hai...");
    try {
      const res = await fetch(API + "/surah");
      const json = await res.json();
      json.data.forEach(function (s) {
        const o = document.createElement("option");
        o.value = s.number;
        o.textContent = s.number + ". " + s.name + " - " + s.englishName;
        selectEl.appendChild(o);
      });
      loadSurah(1);
    } catch (e) {
      say("Internet ka masla lagta hai. Check karke dobara koshish karein.");
    }
  }

  // Ek surah teen editions ke saath lana
  async function loadSurah(n) {
    say("Surah load ho rahi hai...");
    const key = "noorSurah" + n;
    try {
      let data = null;

      // pehle browser ki yaad dekho
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          data = JSON.parse(cached);
        }
      } catch (e) {}

      if (!data) {
        const res = await fetch(
          API + "/surah/" + n + "/editions/quran-uthmani,ur.jalandhry,en.sahih"
        );
        const json = await res.json();
        data = json.data;
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {}
      }

      current = { n: n, data: data };
      draw();
    } catch (e) {
      say("Surah load nahi ho saki. Internet check karke dobara koshish karein.");
    }
  }

  function findEdition(id) {
    return current.data.find(function (e) {
      return e.edition.identifier === id;
    });
  }

  // Screen par dikhana
  function draw() {
    const ar = findEdition("quran-uthmani");
    const ur = findEdition("ur.jalandhry");
    const en = findEdition("en.sahih");

    bodyEl.innerHTML = "";

    // Surah 1 aur 9 ke siwa, bismillah pehli ayat mein judi hoti hai.
    // Hum usay alag line mein dikhate hain.
    let bismillah = "";
    if (current.n !== 1 && current.n !== 9) {
      const words = ar.ayahs[0].text.split(" ");
      if (words.length > 4) {
        bismillah = words.slice(0, 4).join(" ");
      }
    }

    if (bismillah) {
      const b = document.createElement("p");
      b.className = "bismillah";
      b.textContent = bismillah;
      bodyEl.appendChild(b);
    }

    ar.ayahs.forEach(function (a, i) {
      let text = a.text;
      if (bismillah && a.numberInSurah === 1) {
        text = text.split(" ").slice(4).join(" ");
      }

      const row = document.createElement("div");
      row.className = "ayah";

      const num = document.createElement("span");
      num.className = "num";
      num.textContent = a.numberInSurah;
      row.appendChild(num);

      const arEl = document.createElement("p");
      arEl.className = "ar";
      arEl.textContent = text;
      row.appendChild(arEl);

      if (showUr.checked && ur) {
        const p = document.createElement("p");
        p.className = "tr ur";
        p.textContent = ur.ayahs[i].text;
        row.appendChild(p);
      }

      if (showEn.checked && en) {
        const p = document.createElement("p");
        p.className = "tr";
        p.textContent = en.ayahs[i].text;
        row.appendChild(p);
      }

      bodyEl.appendChild(row);
    });
  }

  selectEl.addEventListener("change", function () {
    loadSurah(Number(selectEl.value));
  });
  showUr.addEventListener("change", function () {
    if (current) draw();
  });
  showEn.addEventListener("change", function () {
    if (current) draw();
  });

  loadList();
})();