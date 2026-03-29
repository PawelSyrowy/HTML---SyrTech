/* ===========================
   Ładowanie komponentów
   =========================== */

/**
 * Ładuje komponent HTML z zewnętrznego pliku i wstawia go do elementu o podanym ID.
 * @param {string} id - ID elementu docelowego
 * @param {string} file - Ścieżka do pliku komponentu
 * @param {function} callback - Funkcja wywoływana po załadowaniu (opcjonalna)
 */
function loadComponent(id, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((data) => {
      if (id) {
        document.getElementById(id).innerHTML = data;
      }
      if (callback) callback(data);
    })
    .catch((err) =>
      console.error(`Nie udało się załadować komponentu: ${file}`, err),
    );
}

/* ===========================
   Menu mobilne
   =========================== */

/**
 * Inicjalizuje przełącznik menu mobilnego i oznacza aktywną stronę w nawigacji.
 */
function initMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !expanded);
      navLinks.classList.toggle("active");
    });
  }

  /* Oznacz aktywną stronę w nawigacji */
  setActiveNavigation();
}

/**
 * Dodaje klasę "active" do linku nawigacji odpowiadającego bieżącej stronie.
 */
function setActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

/* ===========================
   Rozwijanie regulaminów
   =========================== */

/**
 * Przełącza widoczność sekcji regulaminowej (rozwiń/zwiń).
 */
function toggleRegulation(item) {
  const content = item.nextElementSibling;
  item.classList.toggle("active");
  content.classList.toggle("active");
}

/* ===========================
   Slider sklepów (strona główna)
   =========================== */

const shopsTrack = document.getElementById("shopsTrack");

if (shopsTrack) {
  /**
   * Zwraca liczbę kafli do przewinięcia w zależności od szerokości ekranu.
   */
  function getShopItemsToScroll() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      return 2;
    } else {
      return 3;
    }
  }

  /**
   * Przewija slider sklepów w podanym kierunku.
   */
  function scrollShopCards(direction) {
    const shopItem = shopsTrack.querySelector(".shop-item");
    if (!shopItem) return;

    const itemWidth = shopItem.offsetWidth + 20; /* 20px = gap */
    const itemsToScroll = getShopItemsToScroll();

    shopsTrack.scrollBy({
      left: direction * itemWidth * itemsToScroll,
      behavior: "smooth",
    });
  }

  /* Przycisk: następny */
  const nextShopsBtn = document.querySelector(".shops-slider .next");
  if (nextShopsBtn) {
    nextShopsBtn.addEventListener("click", () => scrollShopCards(1));
  }

  /* Przycisk: poprzedni */
  const prevShopsBtn = document.querySelector(".shops-slider .prev");
  if (prevShopsBtn) {
    prevShopsBtn.addEventListener("click", () => scrollShopCards(-1));
  }
}

/* ===========================
   Karuzela zdjęć
   =========================== */

/* Inicjalizacja wszystkich karuzeli na stronie */
const carouselTracks = document.querySelectorAll(".carousel-track");
const carouselIntervals = {};

carouselTracks.forEach((carouselTrack) => {
  const trackId = carouselTrack.id;
  const indicators = document.querySelectorAll(
    `#${trackId.replace("carouselTrack", "indicators")} .carousel-bar`,
  );
  let currentIndex = 0;
  const totalSlides = carouselTrack.querySelectorAll(".carousel-slide").length;

  /**
   * Przewija do slajdu o podanym indeksie (zapętla na końcach).
   */
  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const slideWidth = carouselTrack.offsetWidth;
    carouselTrack.scrollTo({
      left: currentIndex * slideWidth,
      behavior: "smooth",
    });

    /* Aktualizuj wskaźniki */
    indicators.forEach((bar) => bar.classList.remove("active"));
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.add("active");
    }

    resetCarouselInterval(trackId);
  }

  /**
   * Resetuje interwał automatycznego przewijania (co 5 sekund).
   */
  function resetCarouselInterval(id) {
    clearInterval(carouselIntervals[id]);
    carouselIntervals[id] = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  /* Przyciski strzałek */
  const prevBtn = document.querySelector(
    `.prev-carousel[data-carousel="${trackId}"]`,
  );
  const nextBtn = document.querySelector(
    `.next-carousel[data-carousel="${trackId}"]`,
  );

  if (prevBtn) {
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
  }

  /* Kliknięcie na wskaźnik */
  indicators.forEach((bar) => {
    bar.addEventListener("click", () => {
      goToSlide(parseInt(bar.dataset.index));
    });
  });

  /* Ustaw pierwszy wskaźnik jako aktywny */
  if (indicators.length > 0) {
    indicators[0].classList.add("active");
  }

  /* Uruchom automatyczne przewijanie */
  resetCarouselInterval(trackId);
});

/* ===========================
   Slider promocji (strona główna)
   =========================== */

const promoTrack = document.getElementById("promoTrack");

if (promoTrack) {
  /**
   * Zwraca liczbę kafli promocji do przewinięcia w zależności od szerokości ekranu.
   */
  function getPromoItemsToScroll() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      return 1;
    } else if (screenWidth <= 1024) {
      return 2;
    } else {
      return 3;
    }
  }

  /**
   * Przewija slider promocji w podanym kierunku.
   */
  function scrollPromoCards(direction) {
    const promoCard = promoTrack.querySelector(".promo-card");
    if (!promoCard) return;

    const itemWidth = promoCard.offsetWidth + 20; /* 20px = gap */
    const itemsToScroll = getPromoItemsToScroll();

    promoTrack.scrollBy({
      left: direction * itemWidth * itemsToScroll,
      behavior: "smooth",
    });
  }

  /* Przycisk: następny */
  const nextPromoBtn = document.querySelector(".next-promo");
  if (nextPromoBtn) {
    nextPromoBtn.addEventListener("click", () => scrollPromoCards(1));
  }

  /* Przycisk: poprzedni */
  const prevPromoBtn = document.querySelector(".prev-promo");
  if (prevPromoBtn) {
    prevPromoBtn.addEventListener("click", () => scrollPromoCards(-1));
  }
}
