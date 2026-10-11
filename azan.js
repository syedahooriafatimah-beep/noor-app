// ---- Azan: waqt aane par azan chalana ----
// Zaroorat: namaz.js pehle chal chuki ho (prayers, timeOf, todayKey wahin se aate hain).
(function () {
  const toggleBtn = document.getElementById("azanToggle");
  const testBtn = document.getElementById("azanTest");
  const stopBtn = document.getElementById("azanStop");
  const statusEl = document.getElementById("azanStatus");
  const fileGeneral = document.getElementById("azanFile");
  const fileFajr = document.getElementById("azanFajrFile");

  const audio = new Audio();
  let enabled = false;   // button dabane ke baad hi azan chalegi
  const fired = {};      // kis din kaun si azan chal chuki

  // Chuni hui files ke temporary links
  let urlGeneral = "";
  let urlFajr = "";

  // ---- Browser mein file yaad rakhna (IndexedDB) ----
  function openDb() {
    return new Promise(function (resolve, reject) {
      const r = indexedDB.open("noorAzan", 1);
      r.onupgradeneeded = function () {
        r.result.createObjectStore("files");
      };
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    });
  }

  async function saveFile(name, blob) {
    const db = await openDb();
    return new Promise(function (resolve, reject) {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(blob, name);
      tx.oncomplete = resolve;
      tx.onerror = function () { reject(tx.error); };
    });
  }

  async function loadFile(name) {
    const db = await openDb();
    return new Promise(function (resolve, reject) {
      const rq = db.transaction("files").objectStore("files").get(name);
      rq.onsuccess = function () { resolve(rq.result || null); };
      rq.onerror = function () { reject(rq.error); };
    });
  }

  function rememberName(slot, name) {
    try {
      const names = JSON.parse(localStorage.getItem("noorAzanNames") || "{}");
      names[slot] = name;
      localStorage.setItem("noorAzanNames", JSON.stringify(names));
    } catch (e) {}
  }

  function readNames() {
    try {
      return JSON.parse(localStorage.getItem("noorAzanNames") || "{}");
    } catch (e) {
      return {};
    }
  }

  function showChosen() {
    const n = readNames();
    const parts = [];
    if (n.general) parts.push("Azan: " + n.general);
    if (n.fajr) parts.push("Fajr: " + n.fajr);
    if (parts.length) {
      statusEl.textContent = "Yaad hai: " + parts.join("  |  ");
    }
  }

  // Page khulte hi pehle ki chuni hui files wapas lao
  async function restore() {
    try {
      const g = await loadFile("general");
      if (g) urlGeneral = URL.createObjectURL(g);
      const f = await loadFile("fajr");
      if (f) urlFajr = URL.createObjectURL(f);
      showChosen();
    } catch (e) {}
  }

  async function onPick(slot, input) {
    const file = input.files[0];
    if (!file) return;
    try {
      await saveFile(slot, file);
    } catch (e) {
      statusEl.textContent = "File yaad nahi ho saki, lekin is session mein chalegi.";
    }
    const url = URL.createObjectURL(file);
    if (slot === "general") urlGeneral = url;
    else urlFajr = url;
    rememberName(slot, file.name);
    showChosen();
  }

  fileGeneral.addEventListener("change", function () { onPick("general", fileGeneral); });
  fileFajr.addEventListener("change", function () { onPick("fajr", fileFajr); });

  // ---- Agar koi file na ho to halki tone ----
  let ctx = null;
  function chime() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784, 1047].forEach(function (f, i) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f;
        o.connect(g);
        g.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.45;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.start(t);
        o.stop(t + 1);
      });
    } catch (e) {}
  }

  // Kaun kaun si files try karni hain (pehli jo chal jaye)
  function candidates(key) {
    const list = [];
    if (key === "Fajr") {
      if (urlFajr) list.push(urlFajr);
    }
    if (urlGeneral) list.push(urlGeneral);
    if (key === "Fajr") list.push("azan-fajr.mp3");
    list.push("azan.mp3");
    return list;
  }

  function playList(list) {
    if (list.length === 0) {
      statusEl.textContent = "Koi azan ki file nahi mili, is liye halki tone chali. Upar se file chun lein.";
      chime();
      return;
    }
    audio.onerror = function () {
      playList(list.slice(1));
    };
    audio.src = list[0];
    audio.currentTime = 0;
    audio.play().catch(function () {});
  }

  function playAzan(key) {
    playList(candidates(key));
  }

  function stopAzan() {
    audio.pause();
    audio.currentTime = 0;
  }

  // Button: browser ko pehle ek click chahiye, tabhi awaaz chalane deta hai
  toggleBtn.addEventListener("click", function () {
    enabled = !enabled;
    toggleBtn.textContent = enabled ? "Azan chalu hai (band karein)" : "Azan chalu karein";
    toggleBtn.classList.toggle("on", enabled);
    statusEl.textContent = enabled
      ? "Is page ko khula rakhein aur awaaz on rakhein."
      : "Azan band hai.";

    if (enabled) {
      // awaaz ke liye "ijazat" lena (khamoshi se)
      audio.src = candidates("Dhuhr")[0];
      audio.muted = true;
      audio.play().then(function () {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      }).catch(function () {
        audio.muted = false;
      });
    }
  });

  testBtn.addEventListener("click", function () {
    statusEl.textContent = "Test chal raha hai...";
    playAzan("Dhuhr");
  });

  stopBtn.addEventListener("click", function () {
    stopAzan();
    statusEl.textContent = "Azan roki gayi.";
  });

  // Har second dekho: kisi farz namaz ka waqt aa gaya?
  setInterval(function () {
    if (!enabled) return;

    const now = new Date();
    prayers.forEach(function (p) {
      if (!p.isPrayer) return;       // Sunrise aur Tahajjud par azan nahi

      const t = timeOf(p, 0);
      const diff = now - t;
      const id = todayKey() + "-" + p.key;

      if (diff >= 0 && diff < 60000 && !fired[id]) {
        fired[id] = true;
        statusEl.textContent = "Azan ka waqt: " + p.key;
        playAzan(p.key);
      }
    });
  }, 1000);

  restore();
})();