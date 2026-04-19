/* ====================================================================
   EDYTOR TABEL - SKRYPT JAVASCRIPT
   Plik zawiera logikę edytora tabel: tworzenie interfejsu kontrolek,
   generowanie CSS oraz wczytywanie CSS z powrotem do edytora
   ==================================================================== */

/* ====================================================================
   OBIEKT KONFIGURACJI TABELI
   Przechowuje aktualne wartości CSS variables ustawione przez użytkownika
   ==================================================================== */
const tableConfig = {};

/* ====================================================================
   INICJALIZACJA PRZYKŁADOWEJ TABELI
   Znajdujemy tabelę z atrybutem data-et-preview i dodajemy klasę .et-preview
   ==================================================================== */
const editableTable = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");

/* ====================================================================
   FUNKCJE POMOCNICZE DO GENEROWANIA CSS
   ==================================================================== */

/**
 * Generuje linię CSS tylko jeśli wartość jest zdefiniowana
 * @param {string} prop - Nazwa właściwości CSS (np. "width")
 * @param {string} val - Wartość właściwości CSS (np. "100%")
 * @returns {string} - Sformatowana linia CSS lub pusty string
 */
function css(prop, val) {
  if (val === undefined || val === "") return "";
  return `  ${prop}: ${val};\n`;
}

/**
 * Generuje pełny kod CSS dla tabeli na podstawie aktualnej konfiguracji
 * @param {string} className - Nazwa klasy CSS dla tabeli
 * @returns {string} - Kompletny kod CSS gotowy do skopiowania
 */
function getTableCSS(className) {
  return `
.${className} {
${css("width", tableConfig["--et-width"])}
${css("margin", tableConfig["--et-margin"])}
${css("border-collapse", tableConfig["--et-border-collapse"])}

${css("font-family", tableConfig["--et-font-family"])}
${css("font-size", tableConfig["--et-font-size"])}
${css("line-height", tableConfig["--et-line-height"])}

${css("background", tableConfig["--et-bg"])}
${css("color", tableConfig["--et-color"])}

${css("border", tableConfig["--et-border"])}
${css("border-radius", tableConfig["--et-radius"])}
${css("box-shadow", tableConfig["--et-shadow"])}
}

.${className} thead {
${css("background", tableConfig["--et-header-bg"])}
${css("color", tableConfig["--et-header-color"])}
${css("font-size", tableConfig["--et-header-font-size"])}
${css("border", tableConfig["--et-header-border"])}
}

.${className} tfoot {
${css("background", tableConfig["--et-footer-bg"])}
${css("color", tableConfig["--et-footer-color"])}
${css("font-size", tableConfig["--et-footer-font-size"])}
${css("border", tableConfig["--et-footer-border"])}
}

.${className} tbody {
${css("background", tableConfig["--et-body-bg"])}
${css("color", tableConfig["--et-body-color"])}
${css("font-size", tableConfig["--et-body-font-size"])}
}

.${className} th,
.${className} td {
${css("border", tableConfig["--et-cell-border"])}
${
  tableConfig["--et-cell-padding-y"] && tableConfig["--et-cell-padding-x"]
    ? `  padding: ${tableConfig["--et-cell-padding-y"]} ${tableConfig["--et-cell-padding-x"]};\n`
    : ""
}
}

.${className} tr {
${css("background", tableConfig["--et-row-bg"])}
${css("border-bottom", tableConfig["--et-row-border"])}
}

.${className} tbody tr:nth-child(even) {
${css("background", tableConfig["--et-stripe-bg"])}
}

.${className} tbody tr:hover {
${css("background", tableConfig["--et-hover-bg"])}
}
`;
}

/**
 * Walidacja nazwy klasy CSS
 * @param {string} name - Nazwa klasy do sprawdzenia
 * @returns {boolean} - true jeśli nazwa jest poprawna
 */
function isValidClass(name) {
  if (!name) return false;
  // Nie pozwalamy na nazwy zaczynające się od "et-" (zarezerwowane dla edytora)
  if (name.startsWith("et-")) return false;
  // Sprawdzamy czy nazwa pasuje do wzorca: litera na początku, potem litery/cyfry/myślnik/podkreślnik
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}

/* ====================================================================
   DEFINICJA SEKCJI I KONTROLEK INTERFEJSU
   Każda sekcja zawiera grupę powiązanych kontrolek do stylowania tabeli
   ==================================================================== */
const sections = [
  /* ----------------------------------------------------------------
     SEKCJA: TABLE - podstawowe właściwości tabeli
     ---------------------------------------------------------------- */
  {
    title: "Table",
    controls: [
      { label: "Width", var: "--et-width", type: "text", default: "100%" },
      { label: "Margin", var: "--et-margin", type: "text", default: "0" },
      {
        label: "Border collapse",
        var: "--et-border-collapse",
        type: "text",
        default: "collapse",
      },
      {
        label: "Font family",
        var: "--et-font-family",
        type: "text",
        default: "sans-serif",
      },
      {
        label: "Font size",
        var: "--et-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "16px",
      },
      {
        label: "Line height",
        var: "--et-line-height",
        type: "text",
        default: "1.4",
      },
      { label: "Table BG", var: "--et-bg", type: "color", default: "transparent" },
      { label: "Table color", var: "--et-color", type: "color", default: "#000000" },
      { label: "Border", var: "--et-border", type: "text", default: "none" },
      {
        label: "Radius",
        var: "--et-radius",
        type: "range",
        min: 0,
        max: 30,
        default: "0px",
      },
      { label: "Shadow", var: "--et-shadow", type: "text", default: "none" },
    ],
  },

  /* ----------------------------------------------------------------
     SEKCJA: HEADER - nagłówek tabeli
     ---------------------------------------------------------------- */
  {
    title: "Header",
    controls: [
      { label: "Header BG", var: "--et-header-bg", type: "color", default: "transparent" },
      {
        label: "Header color",
        var: "--et-header-color",
        type: "color",
        default: "inherit",
      },
      {
        label: "Header font size",
        var: "--et-header-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "inherit",
      },
      {
        label: "Header border",
        var: "--et-header-border",
        type: "text",
        default: "none",
      },
    ],
  },

  /* ----------------------------------------------------------------
     SEKCJA: FOOTER - stopka tabeli
     ---------------------------------------------------------------- */
  {
    title: "Footer",
    controls: [
      { label: "Footer BG", var: "--et-footer-bg", type: "color", default: "transparent" },
      {
        label: "Footer color",
        var: "--et-footer-color",
        type: "color",
        default: "inherit",
      },
      {
        label: "Footer font size",
        var: "--et-footer-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "inherit",
      },
      {
        label: "Footer border",
        var: "--et-footer-border",
        type: "text",
        default: "none",
      },
    ],
  },

  /* ----------------------------------------------------------------
     SEKCJA: BODY - ciało tabeli
     ---------------------------------------------------------------- */
  {
    title: "Body",
    controls: [
      { label: "Body BG", var: "--et-body-bg", type: "color", default: "transparent" },
      {
        label: "Body color",
        var: "--et-body-color",
        type: "color",
        default: "inherit",
      },
      {
        label: "Body font size",
        var: "--et-body-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "inherit",
      },
    ],
  },

  /* ----------------------------------------------------------------
     SEKCJA: CELLS - komórki tabeli (th i td)
     ---------------------------------------------------------------- */
  {
    title: "Cells",
    controls: [
      {
        label: "Cell border",
        var: "--et-cell-border",
        type: "text",
        default: "none",
      },
      {
        label: "Padding X",
        var: "--et-cell-padding-x",
        type: "range",
        min: 0,
        max: 40,
        default: "8px",
      },
      {
        label: "Padding Y",
        var: "--et-cell-padding-y",
        type: "range",
        min: 0,
        max: 40,
        default: "6px",
      },
    ],
  },

  /* ----------------------------------------------------------------
     SEKCJA: ROWS - wiersze tabeli
     ---------------------------------------------------------------- */
  {
    title: "Rows",
    controls: [
      { label: "Row BG", var: "--et-row-bg", type: "color", default: "transparent" },
      {
        label: "Row border",
        var: "--et-row-border",
        type: "text",
        default: "none",
      },
      { label: "Stripe BG", var: "--et-stripe-bg", type: "color", default: "transparent" },
      { label: "Hover BG", var: "--et-hover-bg", type: "color", default: "transparent" },
    ],
  },
];

/* ====================================================================
   TWORZENIE INTERFEJSU EDYTORA
   ==================================================================== */

/**
 * Tworzy pojedynczą kontrolkę (label + input)
 * @param {object} ctrl - Obiekt konfiguracji kontrolki
 * @returns {HTMLElement} - Element DOM kontrolki
 */
function createControl(ctrl) {
  // Wrapper dla kontrolki (label + input)
  const wrapper = document.createElement("div");
  wrapper.className = "et-control";

  // Label opisujący kontrolkę
  const label = document.createElement("label");
  label.textContent = ctrl.label;

  // Input do wprowadzania wartości
  const input = document.createElement("input");
  input.type = ctrl.type;
  input.dataset.var = ctrl.var; // Przechowujemy nazwę CSS variable w data-var

  // Konfiguracja dla inputów typu range
  if (ctrl.type === "range") {
    input.min = ctrl.min;
    input.max = ctrl.max;
    input.value = parseInt(ctrl.default);
  } else {
    input.value = ctrl.default;
  }

  // Ustawiamy domyślną wartość CSS variable tylko jeśli istnieje
  if (ctrl.default) {
    editableTable.style.setProperty(ctrl.var, ctrl.default);
    tableConfig[ctrl.var] = ctrl.default;
  }

  // Obsługa zmiany wartości w kontrolce
  input.addEventListener("input", (e) => {
    let val = e.target.value;

    // Dla range dodajemy jednostkę "px"
    if (ctrl.type === "range") {
      val += "px";
    }

    // Jeśli wartość jest pusta, usuwamy CSS variable
    if (val === "") {
      editableTable.style.removeProperty(ctrl.var);
      delete tableConfig[ctrl.var];
      return;
    }

    // Ustawiamy nową wartość CSS variable
    editableTable.style.setProperty(ctrl.var, val);
    tableConfig[ctrl.var] = val;
  });

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return wrapper;
}

/**
 * Tworzy sekcję z grupą kontrolek
 * @param {object} section - Obiekt konfiguracji sekcji
 * @returns {HTMLElement} - Element DOM sekcji
 */
function createSection(section) {
  // Kontener sekcji
  const box = document.createElement("div");
  box.className = "et-section";

  // Tytuł sekcji
  const title = document.createElement("div");
  title.className = "et-section-title";
  title.textContent = section.title;

  box.appendChild(title);

  // Dodajemy wszystkie kontrolki do sekcji
  section.controls.forEach((ctrl) => {
    box.appendChild(createControl(ctrl));
  });

  return box;
}

/* Znajdujemy kontener edytora i dodajemy do niego wszystkie sekcje */
const editor = document.querySelector(".editor");
sections.forEach((sec) => {
  editor.appendChild(createSection(sec));
});

/* ====================================================================
   OBSŁUGA PRZYCISKU "GENERATE CSS"
   Generuje kod CSS na podstawie aktualnej konfiguracji
   ==================================================================== */
document.getElementById("generate").addEventListener("click", () => {
  const name = document.getElementById("className").value;

  // Walidacja nazwy klasy
  if (!isValidClass(name)) {
    alert("Invalid class name");
    return;
  }

  // Generujemy CSS i wyświetlamy w textarea
  document.getElementById("output").value = getTableCSS(name);
});

/* ====================================================================
   FUNKCJE DO WCZYTYWANIA CSS (LOAD CSS)
   Parsują wklejony kod CSS i przywracają stan edytora
   ==================================================================== */

/**
 * Wczytuje kod CSS i ustawia interfejs edytora
 * @param {string} cssText - Kod CSS do parsowania
 */
function loadCSS(cssText) {
  // Wyciągamy nazwę klasy z CSS (np. .my-table { => "my-table")
  const classMatch = cssText.match(/\.(\w+)\s*\{/);
  if (classMatch) {
    document.getElementById("className").value = classMatch[1];
  }

  // Czyścimy poprzednią konfigurację
  Object.keys(tableConfig).forEach((k) => {
    delete tableConfig[k];
    editableTable.style.removeProperty(k);
  });

  // Parsujemy blok główny .class { ... }
  const mainBlock = cssText.match(/\.[^{]+\{([\s\S]*?)\}/);
  if (!mainBlock) return;

  mainBlock[1].split(";").forEach((line) => {
    const parts = line.split(":");
    if (parts.length !== 2) return;
    mapCssToVar(parts[0].trim(), parts[1].trim());
  });

  // Parsujemy sekcję thead
  extractNested(cssText, "thead", (prop, val) =>
    mapCssToVar(prop, val, "header"),
  );

  // Parsujemy sekcję tfoot
  extractNested(cssText, "tfoot", (prop, val) =>
    mapCssToVar(prop, val, "footer"),
  );

  // Parsujemy sekcję tbody
  extractNested(cssText, "tbody", (prop, val) =>
    mapCssToVar(prop, val, "body"),
  );

  // Parsujemy komórki (th, td)
  extractCells(cssText);

  // Parsujemy wiersze (tr)
  extractNested(cssText, "tr", (prop, val) => mapCssToVar(prop, val, "row"));

  // Parsujemy parzyste wiersze (zebra stripes)
  extractNested(cssText, "tbody tr:nth-child\\(even\\)", (prop, val) =>
    mapCssToVar(prop, val, "stripe"),
  );

  // Parsujemy efekt hover
  extractNested(cssText, "tbody tr:hover", (prop, val) =>
    mapCssToVar(prop, val, "hover"),
  );

  // Aktualizujemy wartości w inputach interfejsu
  updateInputs();
}

/**
 * Mapuje właściwość CSS na odpowiednią CSS variable
 * @param {string} prop - Nazwa właściwości CSS
 * @param {string} val - Wartość właściwości CSS
 * @param {string} section - Sekcja tabeli ("main", "header", "footer", "body", etc.)
 */
function mapCssToVar(prop, val, section = "main") {
  // Mapa właściwości CSS dla głównego bloku tabeli
  const mainMap = {
    width: "--et-width",
    margin: "--et-margin",
    "border-collapse": "--et-border-collapse",
    "font-family": "--et-font-family",
    "font-size": "--et-font-size",
    "line-height": "--et-line-height",
    background: "--et-bg",
    color: "--et-color",
    border: "--et-border",
    "border-radius": "--et-radius",
    "box-shadow": "--et-shadow",
  };

  // Mapowanie dla sekcji HEADER
  if (section === "header") {
    if (prop === "background") setVar("--et-header-bg", val);
    if (prop === "color") setVar("--et-header-color", val);
    if (prop === "font-size") setVar("--et-header-font-size", val);
    if (prop === "border") setVar("--et-header-border", val);
    return;
  }

  // Mapowanie dla sekcji FOOTER
  if (section === "footer") {
    if (prop === "background") setVar("--et-footer-bg", val);
    if (prop === "color") setVar("--et-footer-color", val);
    if (prop === "font-size") setVar("--et-footer-font-size", val);
    if (prop === "border") setVar("--et-footer-border", val);
    return;
  }

  // Mapowanie dla sekcji BODY
  if (section === "body") {
    if (prop === "background") setVar("--et-body-bg", val);
    if (prop === "color") setVar("--et-body-color", val);
    if (prop === "font-size") setVar("--et-body-font-size", val);
    return;
  }

  // Mapowanie dla ROWS
  if (section === "row") {
    if (prop === "background") setVar("--et-row-bg", val);
    if (prop === "border-bottom") setVar("--et-row-border", val);
    return;
  }

  // Mapowanie dla STRIPE (parzyste wiersze)
  if (section === "stripe") {
    if (prop === "background") setVar("--et-stripe-bg", val);
    return;
  }

  // Mapowanie dla HOVER
  if (section === "hover") {
    if (prop === "background") setVar("--et-hover-bg", val);
    return;
  }

  // Mapowanie dla głównego bloku tabeli
  if (mainMap[prop]) {
    setVar(mainMap[prop], val);
  }
}

/**
 * Ustawia CSS variable na tabeli i zapisuje w konfiguracji
 * @param {string} variable - Nazwa CSS variable
 * @param {string} value - Wartość do ustawienia
 */
function setVar(variable, value) {
  tableConfig[variable] = value;
  editableTable.style.setProperty(variable, value);
}

/**
 * Wyciąga właściwości CSS z zagnieżdżonego selektora (np. .class thead { ... })
 * @param {string} cssText - Pełny kod CSS
 * @param {string} selector - Selektor do wyszukania (np. "thead", "tbody")
 * @param {function} callback - Funkcja wywoływana dla każdej znalezionej właściwości
 */
function extractNested(cssText, selector, callback) {
  const regex = new RegExp(`\\.[^\\s]+\\s+${selector}\\s*\\{([\\s\\S]*?)\\}`);

  const match = cssText.match(regex);
  if (!match) return;

  match[1].split(";").forEach((line) => {
    const parts = line.split(":");
    if (parts.length !== 2) return;
    callback(parts[0].trim(), parts[1].trim());
  });
}

/**
 * Wyciąga właściwości CSS dla komórek (th, td)
 * @param {string} cssText - Pełny kod CSS
 */
function extractCells(cssText) {
  const match = cssText.match(/td\s*\{([\s\S]*?)\}/);
  if (!match) return;

  match[1].split(";").forEach((line) => {
    const parts = line.split(":");
    if (parts.length !== 2) return;

    const prop = parts[0].trim();
    const val = parts[1].trim();

    // Mapowanie border komórek
    if (prop === "border") {
      setVar("--et-cell-border", val);
    }

    // Mapowanie padding (rozdzielamy na X i Y)
    if (prop === "padding") {
      const p = val.split(" ");
      if (p.length === 2) {
        setVar("--et-cell-padding-y", p[0]);
        setVar("--et-cell-padding-x", p[1]);
      }
    }
  });
}

/**
 * Aktualizuje wartości w inputach interfejsu na podstawie tableConfig
 */
function updateInputs() {
  document.querySelectorAll(".et-control input").forEach((input) => {
    const v = input.dataset.var;
    if (!v) return;

    const val = tableConfig[v];

    // Jeśli brak wartości, czyścimy input
    if (!val) {
      input.value = "";
      return;
    }

    // Dla range wyciągamy samą liczbę (usuwamy "px")
    if (input.type === "range") {
      input.value = parseInt(val);
    } else {
      input.value = val;
    }
  });
}

/* ====================================================================
   OBSŁUGA PRZYCISKU "LOAD CSS"
   Wczytuje kod CSS z textarea i przywraca stan edytora
   ==================================================================== */
document.getElementById("load").addEventListener("click", () => {
  const cssText = document.getElementById("output").value;
  loadCSS(cssText);
});
