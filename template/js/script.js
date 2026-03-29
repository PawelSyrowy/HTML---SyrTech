/* ============================================================
   SCRIPT.JS — Główny skrypt JavaScript
   ============================================================
   Zawiera wszystkie funkcje JavaScript dla projektu:

   1. loadComponent()         — dynamiczne ładowanie komponentów HTML (header/footer)
   2. initMenuToggle()        — hamburger menu na mobile
   3. setActiveNavigation()   — podświetlenie aktywnego linku nawigacji
   4. toggleAccordion()       — akordeony (FAQ, regulaminy)
   5. initCarousel()          — slider/carousel z auto-play i strzałkami
   6. initStickyHeader()      — efekt zmiany wyglądu nagłówka przy scroll
   7. initSmoothScroll()      — płynne scrrollowanie do anchor linków

   UŻYCIE W HTML (na końcu body, przed </body>):
   ─────────────────────────────────────────────────────────────
   <script src="js/script.js"></script>
   <script>
       loadComponent("site-header", "components/header.html", initMenuToggle);
       loadComponent("site-footer", "components/footer.html");
   </script>
   ============================================================ */

/* ============================================================
   1. loadComponent() — Ładowanie komponentów HTML
   ============================================================
   Pobiera plik HTML przez fetch() i wstrzykuje jego zawartość
   do elementu o podanym ID. Po załadowaniu wywołuje callback.

   @param {string|null} id       — ID elementu docelowego (lub null gdy użyjesz callback)
   @param {string}      file     — Ścieżka do pliku HTML komponentu
   @param {Function}    callback — Funkcja wywoływana po załadowaniu (opcjonalna)
   ============================================================ */
function loadComponent(id, file, callback) {
  fetch(file)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Nie można załadować komponentu: " + file);
      }
      return response.text();
    })
    .then(function (html) {
      /* Wstrzyknij HTML do elementu jeśli podano ID */
      if (id) {
        var target = document.getElementById(id);
        if (target) {
          target.innerHTML = html;
        }
      }
      /* Wywołaj callback z załadowanym HTML */
      if (typeof callback === "function") {
        callback(html);
      }
    })
    .catch(function (error) {
      console.warn("loadComponent error:", error);
    });
}

/* ============================================================
   2. initMenuToggle() — Hamburger Menu na Mobile
   ============================================================
   Aktywuje przycisk hamburgera (.navbar__hamburger).
   Przełącza klasę .active na .navbar__links i aktualizuje
   aria-expanded dla dostępności (a11y).

   Wywoływany jako callback po załadowaniu header.html.
   ============================================================ */
function initMenuToggle() {
  var hamburger = document.querySelector(".navbar__hamburger");
  var navLinks = document.querySelector(".navbar__links");

  if (!hamburger || !navLinks)
    return; /* Zabezpieczenie — elementy muszą istnieć */

  hamburger.addEventListener("click", function () {
    var isExpanded = hamburger.getAttribute("aria-expanded") === "true";

    /* Przełącz stan */
    hamburger.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });

  /* Zamknij menu po kliknięciu linka (UX na mobile) */
  var allNavLinks = navLinks.querySelectorAll("a");
  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("active");
    });
  });

  /* Zamknij menu po kliknięciu poza nim */
  document.addEventListener("click", function (event) {
    var isClickInsideNav = navLinks.contains(event.target);
    var isClickOnHamburger = hamburger.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnHamburger &&
      navLinks.classList.contains("active")
    ) {
      hamburger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("active");
    }
  });

  /* Po inicjalizacji menu — oznacz aktywny link */
  setActiveNavigation();

  /* Po inicjalizacji menu — aktywuj sticky header */
  initStickyHeader();
}

/* ============================================================
   3. setActiveNavigation() — Podświetlenie Aktywnego Linku
   ============================================================
   Porównuje nazwę bieżącego pliku z href linków nawigacji.
   Dodaje klasę .active do pasującego linku.

   Wywoływana wewnątrz initMenuToggle() po załadowaniu nagłówka.
   ============================================================ */
function setActiveNavigation() {
  /* Pobierz nazwę bieżącego pliku (np. "sklepy.html" lub "index.html") */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  var navLinks = document.querySelectorAll(".navbar__links a");
  navLinks.forEach(function (link) {
    /* Pobierz nazwę pliku z href linku */
    var linkPage = (link.getAttribute("href") || "").split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

/* ============================================================
   4. toggleAccordion() — Akordeony (FAQ, Regulaminy)
   ============================================================
   Przełącza klasę .accordion-item--open na rodzicu klikalnego
   nagłówka akordeonu.

   Użycie w HTML:
   <button class="accordion-item__header" onclick="toggleAccordion(this)">
       Tytuł FAQ
       <span class="accordion-item__arrow">↓</span>
   </button>

   Alternatywnie: użyj initAllAccordions() aby zainicjować
   wszystkie akordeony bez onclick w HTML.
   ============================================================ */
function toggleAccordion(headerElement) {
  var item = headerElement.closest(".accordion-item");
  if (!item) return;

  var isOpen = item.classList.contains("accordion-item--open");

  /* Opcja: zamknij wszystkie inne akordeony (usuń tę logikę jeśli chcesz multi-open) */
  var allItems = item.closest(".accordion");
  if (allItems) {
    allItems
      .querySelectorAll(".accordion-item--open")
      .forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("accordion-item--open");
        }
      });
  }

  /* Przełącz bieżący element */
  item.classList.toggle("accordion-item--open", !isOpen);
}

/* Inicjalizacja wszystkich akordeonów bez onclick w HTML */
function initAllAccordions() {
  var headers = document.querySelectorAll(".accordion-item__header");
  headers.forEach(function (header) {
    header.addEventListener("click", function () {
      toggleAccordion(this);
    });
  });
}

/* ============================================================
   5. initCarousel() — Slider/Carousel z Auto-play
   ============================================================
   Obsługuje slider oparty na .carousel__track (scroll + flex).
   Strzałki, dot indicators i auto-play.

   Użycie w HTML:
   <div class="carousel" id="main-carousel">
       <div class="carousel__track" id="main-carousel-track">
           <div class="carousel__slide">...</div>
       </div>
       <button class="carousel__arrow carousel__arrow--prev" data-carousel="main-carousel">&#8249;</button>
       <button class="carousel__arrow carousel__arrow--next" data-carousel="main-carousel">&#8250;</button>
       <div class="carousel__indicators" id="main-carousel-dots"></div>
   </div>

   Inicjalizacja:
   initCarousel("main-carousel");
   ============================================================ */
function initCarousel(carouselId) {
  var carousel = document.getElementById(carouselId);
  if (!carousel) return;

  var track = document.getElementById(carouselId + "-track");
  var dotsWrapper = document.getElementById(carouselId + "-dots");
  var prevBtn = carousel.querySelector(".carousel__arrow--prev");
  var nextBtn = carousel.querySelector(".carousel__arrow--next");
  var slides = track ? track.querySelectorAll(".carousel__slide") : [];
  var currentIndex = 0;
  var autoPlayInterval;
  var AUTO_PLAY_DELAY = 5000; /* 5 sekund */

  if (!track || slides.length === 0) return;

  /* Utwórz dot indicators */
  if (dotsWrapper) {
    slides.forEach(function (_, index) {
      var dot = document.createElement("span");
      dot.className =
        "carousel__dot" + (index === 0 ? " carousel__dot--active" : "");
      dot.addEventListener("click", function () {
        goToSlide(index);
      });
      dotsWrapper.appendChild(dot);
    });
  }

  /* Funkcja przejścia do slajdu */
  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    var slideWidth = slides[0].offsetWidth;
    track.scrollTo({ left: currentIndex * slideWidth, behavior: "smooth" });

    /* Zaktualizuj dots */
    if (dotsWrapper) {
      dotsWrapper.querySelectorAll(".carousel__dot").forEach(function (dot, i) {
        dot.classList.toggle("carousel__dot--active", i === currentIndex);
      });
    }
  }

  /* Strzałki nawigacji */
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      clearInterval(autoPlayInterval);
      goToSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      clearInterval(autoPlayInterval);
      goToSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  /* Auto-play */
  function startAutoPlay() {
    autoPlayInterval = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, AUTO_PLAY_DELAY);
  }

  /* Zatrzymaj auto-play przy hover */
  carousel.addEventListener("mouseenter", function () {
    clearInterval(autoPlayInterval);
  });
  carousel.addEventListener("mouseleave", startAutoPlay);

  /* Swipe na touch (mobile) */
  var touchStartX = 0;
  carousel.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  carousel.addEventListener("touchend", function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      /* Minimalny dystans swipe */
      goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  });

  startAutoPlay();
}

/* ============================================================
   6. initStickyHeader() — Zmiana Wyglądu Nagłówka przy Scroll
   ============================================================
   Dodaje klasę .header--scrolled do #site-header gdy użytkownik
   przewinie stronę w dół. Umożliwia zmianę stylu (np. tło, cień).

   Opcjonalne style dla .header--scrolled dodaj w header.css:
   #site-header.header--scrolled {
       background-color: var(--color-bg);
       box-shadow: var(--shadow-md);
   }
   ============================================================ */
function initStickyHeader() {
  var header = document.getElementById("site-header");
  if (!header) return;

  var SCROLL_THRESHOLD = 50; /* px przewinięcia do aktywacji klasy */

  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    },
    { passive: true },
  ); /* passive: true — lepszy performance */
}

/* ============================================================
   7. initSmoothScroll() — Płynne Scrollowanie do Anchorów
   ============================================================
   Obsługuje linki #anchor z poprawką na wysokość przyklejonego
   nagłówka. Działa dla wszystkich linków a[href^="#"].
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      var target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        var header = document.getElementById("site-header");
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPos =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
}

/* ============================================================
   INICJALIZACJA — Wywołaj po załadowaniu DOM
   ============================================================
   Funkcje niezależne od komponentów uruchamiaj tutaj.
   Funkcje zależne od komponentów (np. menu toggle) uruchamiane
   są jako callback w loadComponent().
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  initAllAccordions(); /* Inicjuj akordeony na stronie */
  initSmoothScroll(); /* Płynne scrollowanie anchor linków */

  /* Inicjalizacja carouseli — odkomentuj i podaj ID jeśli używasz:
    initCarousel("hero-carousel");
    initCarousel("gallery-carousel");
    */
});
