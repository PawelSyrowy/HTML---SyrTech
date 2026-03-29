/* ============================================================
   COMPONENTS.JS — Ładowanie komponentów i portfolio
   ============================================================ */

/* Załaduj komponent HTML do elementu o podanym id */
function loadComponent(id, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      if (id) document.getElementById(id).innerHTML = data;
      if (callback) callback(data);
    })
    .catch((err) => console.error("Nie udało się załadować:", file, err));
}

/*
 * Załaduj projekty w określonej kolejności.
 * Każdy projekt dostaje zarezerwowany slot (div[display:contents])
 * — kolejność jest zachowana niezależnie od szybkości pobierania.
 */
function loadPortfolio(id) {
  const projects = [
    "components/projects/nomad.html",
    "components/projects/czat.html",
    "components/projects/starwars.html",
    "components/projects/habitator.html",
    "components/projects/happydroplet.html",
    "components/projects/cleantisy.html",
    "components/projects/table-editor.html",
    "components/projects/dating-app.html",
  ];

  const container = document.getElementById(id);

  /* Zarezerwuj sloty — display:contents nie wpływa na layout siatki */
  const slots = projects.map(() => {
    const slot = document.createElement("div");
    slot.style.display = "contents";
    container.appendChild(slot);
    return slot;
  });

  projects.forEach((file, i) => {
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        slots[i].innerHTML = html;
      })
      .catch((err) => console.error("loadPortfolio:", file, err));
  });
}
