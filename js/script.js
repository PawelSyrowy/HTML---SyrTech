/* ============================================================
   SCRIPT.JS — Hamburger menu, email reveal
   ============================================================ */

/* Hamburguer — otwieranie / zamykanie menu mobilnego */
function initMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("active");
  });

  /* Zamknij menu po kliknięciu linka */
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Zamknij menu po kliknięciu poza nim */
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* Email reveal — pokaż adres po kliknięciu przycisku */
const emailButton = document.getElementById("email-btn");
const emailEl = document.getElementById("email");

if (emailButton && emailEl) {
  emailButton.addEventListener("click", () => {
    emailEl.classList.add("show");
    emailButton.classList.add("hide");

    if (typeof gtag === "function") {
      gtag("event", "show_email_click", {
        event_category: "contact",
        event_label: "email_button",
      });
    }
  });
}
