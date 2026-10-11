// ---- Qibla ki simt ----
(function () {
  // Kaaba ki jagah (latitude, longitude)
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // Shehron ki jagah (latitude, longitude)
  const cities = {
    "Islamabad":  [33.6844, 73.0479],
    "Rawalpindi": [33.5651, 73.0169],
    "Lahore":     [31.5497, 74.3436],
    "Karachi":    [24.8607, 67.0011],
    "Peshawar":   [34.0151, 71.5249],
    "Quetta":     [30.1798, 66.9750],
    "Multan":     [30.1575, 71.4243],
    "Faisalabad": [31.4504, 73.1350]
  };

  const selectEl = document.getElementById("qiblaCity");
  const arrowEl = document.getElementById("qiblaArrow");
  const textEl = document.getElementById("qiblaText");
  const distEl = document.getElementById("qiblaDist");

  // degree se radian
  function toRad(d) {
    return d * Math.PI / 180;
  }

  // Aap ki jagah se Kaaba ka rukh (North se, ghari ki simt, 0 se 360 degree)
  function bearing(lat1, lng1, lat2, lng2) {
    const a1 = toRad(lat1);
    const a2 = toRad(lat2);
    const dl = toRad(lng2 - lng1);

    const y = Math.sin(dl) * Math.cos(a2);
    const x = Math.cos(a1) * Math.sin(a2) - Math.sin(a1) * Math.cos(a2) * Math.cos(dl);

    const deg = Math.atan2(y, x) * 180 / Math.PI;
    return (deg + 360) % 360;
  }

  // Do jagahon ke beech doori (km) - haversine formula
  function distanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Angle ko lafzon mein
  function directionWord(deg) {
    const names = [
      "North", "North-East", "East", "South-East",
      "South", "South-West", "West", "North-West"
    ];
    return names[Math.round(deg / 45) % 8];
  }

  function update() {
    const name = selectEl.value;
    const c = cities[name];

    const b = bearing(c[0], c[1], KAABA_LAT, KAABA_LNG);
    const km = distanceKm(c[0], c[1], KAABA_LAT, KAABA_LNG);

    arrowEl.style.transform = "rotate(" + b + "deg)";
    textEl.textContent = b.toFixed(1) + "° (" + directionWord(b) + ")";
    distEl.textContent = name + " se Kaaba: lagbhag " + Math.round(km).toLocaleString("en-US") + " km";

    try {
      localStorage.setItem("noorQiblaCity", name);
    } catch (e) {}
  }

  // Shehron ki list banana
  Object.keys(cities).forEach(function (name) {
    const o = document.createElement("option");
    o.value = name;
    o.textContent = name;
    selectEl.appendChild(o);
  });

  // Pehle chuna hua shehar, warna namaz.js ka CITY, warna Islamabad
  let start = "Islamabad";
  try {
    const saved = localStorage.getItem("noorQiblaCity");
    if (saved && cities[saved]) {
      start = saved;
    } else if (typeof CITY !== "undefined" && cities[CITY]) {
      start = CITY;
    }
  } catch (e) {}

  selectEl.value = start;
  selectEl.addEventListener("change", update);
  update();
})();