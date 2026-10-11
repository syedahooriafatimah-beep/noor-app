// ---- Ghari aur tareekh ----
function tick() {
  const now = new Date();

  document.getElementById("time").textContent = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  document.getElementById("dateLine").textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  try {
    document.getElementById("hijri").textContent = new Intl.DateTimeFormat(
      "en-u-ca-islamic-umalqura",
      { day: "numeric", month: "long", year: "numeric" }
    ).format(now);
  } catch (e) {
    document.getElementById("hijri").textContent = "";
  }
}

tick();
setInterval(tick, 1000);