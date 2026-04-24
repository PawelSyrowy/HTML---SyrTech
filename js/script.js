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
 * Generuje linię CSS zawsze z wartością - użyje domyślnej neutralnej jeśli nie podano
 * @param {string} prop - Nazwa właściwości CSS (np. "width")
 * @param {string} val - Wartość właściwości CSS (np. "100%")
 * @param {string} defaultVal - Wartość domyślna neutralna (opcjonalna)
 * @returns {string} - Sformatowana linia CSS
 */
function css(prop, val, defaultVal = null) {
  // Jeśli wartość nie jest zdefiniowana, użyj domyślnej neutralnej
  const finalVal = (val === undefined || val === "") && defaultVal !== null ? defaultVal : val;

  // Jeśli nadal brak wartości i nie ma domyślnej, nie generuj linii
  if (finalVal === undefined || finalVal === "") return "";

  return `  ${prop}: ${val || defaultVal};\n`;
}

/**
 * Generuje pełny kod CSS dla tabeli na podstawie aktualnej konfiguracji
 * @param {string} className - Nazwa klasy CSS dla tabeli
 * @returns {string} - Kompletny kod CSS gotowy do skopiowania
 */
function getTableCSS(className) {
  // Sprawdź czy header i footer są włączone
  const showHeader = tableConfig["--et-show-header"] !== false;
  const showFooter = tableConfig["--et-show-footer"] !== false;

  // Sekcja thead - tylko jeśli header jest włączony
  const theadSection = showHeader ? `
.${className} thead {
${css("background", tableConfig["--et-header-bg"], "transparent")}
${css("color", tableConfig["--et-header-color"], "inherit")}
${css("font-size", tableConfig["--et-header-font-size"], "inherit")}
${css("border", tableConfig["--et-header-border"], "none")}
}
` : '';

  // Sekcja tfoot - tylko jeśli footer jest włączony
  const tfootSection = showFooter ? `
.${className} tfoot {
${css("background", tableConfig["--et-footer-bg"], "transparent")}
${css("color", tableConfig["--et-footer-color"], "inherit")}
${css("font-size", tableConfig["--et-footer-font-size"], "inherit")}
${css("border", tableConfig["--et-footer-border"], "none")}
}
` : '';

  return `
.${className} {
${css("width", tableConfig["--et-width"], "100%")}
${css("margin", tableConfig["--et-margin"], "0")}
${css("border-collapse", tableConfig["--et-border-collapse"], "collapse")}

${css("font-family", tableConfig["--et-font-family"], "sans-serif")}
${css("font-size", tableConfig["--et-font-size"], "16px")}
${css("line-height", tableConfig["--et-line-height"], "1.4")}

${css("background", tableConfig["--et-bg"], "transparent")}
${css("color", tableConfig["--et-color"], "#000000")}

${css("border", tableConfig["--et-border"], "none")}
${css("border-radius", tableConfig["--et-radius"], "0px")}
${css("box-shadow", tableConfig["--et-shadow"], "none")}
}
${theadSection}${tfootSection}
.${className} tbody {
${css("background", tableConfig["--et-body-bg"], "transparent")}
${css("color", tableConfig["--et-body-color"], "inherit")}
${css("font-size", tableConfig["--et-body-font-size"], "inherit")}
}

.${className} th,
.${className} td {
${css("border", tableConfig["--et-cell-border"], "none")}
${css("padding",
  tableConfig["--et-cell-padding-y"] && tableConfig["--et-cell-padding-x"]
    ? `${tableConfig["--et-cell-padding-y"]} ${tableConfig["--et-cell-padding-x"]}`
    : null,
  "6px 8px")}
}

.${className} tr {
${css("background", tableConfig["--et-row-bg"], "transparent")}
${css("border-bottom", tableConfig["--et-row-border"], "none")}
}

.${className} tbody tr:nth-child(even) {
${css("background", tableConfig["--et-stripe-bg"], "transparent")}
}

.${className} tbody tr:hover {
${css("background", tableConfig["--et-hover-bg"], "transparent")}
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
      { label: "Show Header", var: "--et-show-header", type: "checkbox", default: true },
      { label: "Show Footer", var: "--et-show-footer", type: "checkbox", default: true },
      { label: "Width", var: "--et-width", type: "text", default: "100%" },
      {
        label: "Margin",
        var: "--et-margin",
        type: "margin",
        default: "0",
        subvars: {
          top: "--et-margin-top",
          right: "--et-margin-right",
          bottom: "--et-margin-bottom",
          left: "--et-margin-left"
        }
      },
      {
        label: "Border collapse",
        var: "--et-border-collapse",
        type: "select",
        default: "collapse",
        options: ["collapse", "separate"]
      },
      {
        label: "Font family",
        var: "--et-font-family",
        type: "select",
        default: "sans-serif",
        options: [
          "sans-serif",
          "serif",
          "monospace",
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Georgia",
          "Courier New",
          "Verdana",
          "Tahoma"
        ]
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
      {
        label: "Border",
        var: "--et-border",
        type: "border",
        default: "none",
        subvars: {
          width: "--et-border-width",
          style: "--et-border-style",
          color: "--et-border-color"
        }
      },
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
        type: "border",
        default: "none",
        subvars: {
          width: "--et-header-border-width",
          style: "--et-header-border-style",
          color: "--et-header-border-color"
        }
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
        type: "border",
        default: "none",
        subvars: {
          width: "--et-footer-border-width",
          style: "--et-footer-border-style",
          color: "--et-footer-border-color"
        }
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
        type: "border",
        default: "none",
        subvars: {
          width: "--et-cell-border-width",
          style: "--et-cell-border-style",
          color: "--et-cell-border-color"
        }
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
        type: "border",
        default: "none",
        subvars: {
          width: "--et-row-border-width",
          style: "--et-row-border-style",
          color: "--et-row-border-color"
        }
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
 * Tworzy pojedynczą kontrolkę (label + input/select/złożone)
 * @param {object} ctrl - Obiekt konfiguracji kontrolki
 * @returns {HTMLElement} - Element DOM kontrolki
 */
function createControl(ctrl) {
  // Wrapper dla kontrolki (label + input + reset button)
  const wrapper = document.createElement("div");
  wrapper.className = "et-control";

  // Header kontrolki (label + reset button)
  const controlHeader = document.createElement("div");
  controlHeader.className = "et-control-header";

  // Label opisujący kontrolkę
  const label = document.createElement("label");
  label.textContent = ctrl.label;
  controlHeader.appendChild(label);

  // Przycisk reset dla kontrolki
  const resetBtn = document.createElement("button");
  resetBtn.className = "reset-control-btn";
  resetBtn.title = "Resetuj do wartości domyślnej";
  resetBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
  </svg>`;

  // Zapisujemy pełną konfigurację kontrolki dla resetu
  resetBtn.dataset.controlConfig = JSON.stringify(ctrl);

  // Event listener dla resetu kontrolki
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetControl(ctrl);
  });

  controlHeader.appendChild(resetBtn);

  wrapper.appendChild(controlHeader);

  // === KONTROLKA TYPU BORDER (width + style + color) ===
  if (ctrl.type === "border") {
    const borderWrapper = document.createElement("div");
    borderWrapper.className = "et-control-border";

    // Width (range 0-10px)
    const widthInput = document.createElement("input");
    widthInput.type = "range";
    widthInput.min = 0;
    widthInput.max = 10;
    widthInput.value = 0;
    widthInput.dataset.var = ctrl.subvars.width;
    widthInput.title = "Width";

    // Style (select: none/solid/dashed/dotted/double)
    const styleSelect = document.createElement("select");
    styleSelect.dataset.var = ctrl.subvars.style;
    ["none", "solid", "dashed", "dotted", "double"].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      styleSelect.appendChild(option);
    });
    styleSelect.value = "none";

    // Color (color picker)
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#000000";
    colorInput.dataset.var = ctrl.subvars.color;
    colorInput.title = "Color";

    // Inicjalizacja wartości domyślnej
    if (ctrl.default === "none") {
      tableConfig[ctrl.var] = "none";
      editableTable.style.setProperty(ctrl.var, "none");
    }

    // Funkcja aktualizacji border
    const updateBorder = () => {
      const width = widthInput.value + "px";
      const style = styleSelect.value;
      const color = colorInput.value;

      let borderValue;
      if (style === "none" || widthInput.value === "0") {
        borderValue = "none";
      } else {
        borderValue = `${width} ${style} ${color}`;
      }

      editableTable.style.setProperty(ctrl.var, borderValue);
      tableConfig[ctrl.var] = borderValue;

      // Zapisujemy również sub-wartości
      tableConfig[ctrl.subvars.width] = width;
      tableConfig[ctrl.subvars.style] = style;
      tableConfig[ctrl.subvars.color] = color;
    };

    widthInput.addEventListener("input", updateBorder);
    styleSelect.addEventListener("change", updateBorder);
    colorInput.addEventListener("input", updateBorder);

    borderWrapper.appendChild(widthInput);
    borderWrapper.appendChild(styleSelect);
    borderWrapper.appendChild(colorInput);
    wrapper.appendChild(borderWrapper);

    return wrapper;
  }

  // === KONTROLKA TYPU MARGIN (top/right/bottom/left) ===
  if (ctrl.type === "margin") {
    const marginWrapper = document.createElement("div");
    marginWrapper.className = "et-control-margin";

    const sides = ["top", "right", "bottom", "left"];
    const inputs = {};

    sides.forEach(side => {
      const sideInput = document.createElement("input");
      sideInput.type = "range";
      sideInput.min = 0;
      sideInput.max = 50;
      sideInput.value = 0;
      sideInput.dataset.var = ctrl.subvars[side];
      sideInput.title = side.charAt(0).toUpperCase() + side.slice(1);
      inputs[side] = sideInput;

      const sideLabel = document.createElement("span");
      sideLabel.textContent = side.charAt(0).toUpperCase();
      sideLabel.className = "et-margin-label";

      const sideWrapper = document.createElement("div");
      sideWrapper.className = "et-margin-side";
      sideWrapper.appendChild(sideLabel);
      sideWrapper.appendChild(sideInput);

      marginWrapper.appendChild(sideWrapper);
    });

    // Funkcja aktualizacji margin
    const updateMargin = () => {
      const top = inputs.top.value + "px";
      const right = inputs.right.value + "px";
      const bottom = inputs.bottom.value + "px";
      const left = inputs.left.value + "px";

      const marginValue = `${top} ${right} ${bottom} ${left}`;
      editableTable.style.setProperty(ctrl.var, marginValue);
      tableConfig[ctrl.var] = marginValue;

      // Zapisujemy również sub-wartości
      tableConfig[ctrl.subvars.top] = top;
      tableConfig[ctrl.subvars.right] = right;
      tableConfig[ctrl.subvars.bottom] = bottom;
      tableConfig[ctrl.subvars.left] = left;
    };

    // Inicjalizacja wartości domyślnej
    tableConfig[ctrl.var] = ctrl.default || "0";
    editableTable.style.setProperty(ctrl.var, ctrl.default || "0");

    sides.forEach(side => {
      inputs[side].addEventListener("input", updateMargin);
    });

    wrapper.appendChild(marginWrapper);
    return wrapper;
  }

  // === KONTROLKA TYPU SELECT (dropdown) ===
  if (ctrl.type === "select") {
    const select = document.createElement("select");
    select.dataset.var = ctrl.var;

    ctrl.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    select.value = ctrl.default;

    // Ustawiamy domyślną wartość
    if (ctrl.default) {
      editableTable.style.setProperty(ctrl.var, ctrl.default);
      tableConfig[ctrl.var] = ctrl.default;
    }

    // Obsługa zmiany wartości
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      editableTable.style.setProperty(ctrl.var, val);
      tableConfig[ctrl.var] = val;
    });

    wrapper.appendChild(select);
    return wrapper;
  }

  // === KONTROLKA TYPU CHECKBOX (toggle) ===
  if (ctrl.type === "checkbox") {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.var = ctrl.var;
    checkbox.checked = ctrl.default === true;

    // Ustawiamy domyślną wartość
    tableConfig[ctrl.var] = ctrl.default;

    // Obsługa zmiany wartości
    checkbox.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      tableConfig[ctrl.var] = isChecked;

      // Specjalna obsługa dla Show Header
      if (ctrl.var === "--et-show-header") {
        const thead = editableTable.querySelector("thead");
        const headerTab = document.getElementById("headerTab");
        if (thead) {
          thead.style.display = isChecked ? "" : "none";
        }
        if (headerTab) {
          headerTab.style.display = isChecked ? "" : "none";
          // Jeśli Header tab jest aktywny i wyłączamy header, przełącz na Table
          if (!isChecked && headerTab.classList.contains("active")) {
            switchTab("table");
          }
        }
      }

      // Specjalna obsługa dla Show Footer
      if (ctrl.var === "--et-show-footer") {
        const tfoot = editableTable.querySelector("tfoot");
        const footerTab = document.getElementById("footerTab");
        if (tfoot) {
          tfoot.style.display = isChecked ? "" : "none";
        }
        if (footerTab) {
          footerTab.style.display = isChecked ? "" : "none";
          // Jeśli Footer tab jest aktywny i wyłączamy footer, przełącz na Table
          if (!isChecked && footerTab.classList.contains("active")) {
            switchTab("table");
          }
        }
      }
    });

    wrapper.appendChild(checkbox);
    return wrapper;
  }

  // === STANDARDOWE KONTROLKI (text, color, range) ===
  const input = document.createElement("input");
  input.type = ctrl.type;
  input.dataset.var = ctrl.var;

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
  // Dodajemy atrybut data-section dla identyfikacji
  box.dataset.section = section.title.toLowerCase();

  // Tytuł sekcji - ukryty w nowym layoutcie
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
   OBSŁUGA ZAKŁADEK (TABS)
   ==================================================================== */

/**
 * Przełącza aktywną zakładkę i pokazuje odpowiednie kontrolki
 * @param {string} tabName - Nazwa zakładki (table/header/footer/body/cells/rows)
 */
function switchTab(tabName) {
  // Ukryj wszystkie sekcje
  document.querySelectorAll(".et-section").forEach(section => {
    section.classList.remove("active");
  });

  // Pokaż wybraną sekcję
  const targetSection = document.querySelector(`.et-section[data-section="${tabName}"]`);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Zaktualizuj aktywną zakładkę
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// Dodaj event listenery do zakładek
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tabName = btn.dataset.tab;
    switchTab(tabName);
  });
});

// Inicjalizacja - pokaż pierwszą zakładkę (Table)
switchTab("table");

/* ====================================================================
   OBSŁUGA SWITCHA TRYBU (GENERATE / LOAD)
   ==================================================================== */

/**
 * Przełącza tryb między Generate CSS a Load CSS
 * @param {string} mode - Tryb ('generate' lub 'load')
 */
function switchMode(mode) {
  // Ukryj wszystkie tryby
  document.querySelectorAll(".mode-content").forEach(content => {
    content.classList.add("hidden");
  });

  // Pokaż wybrany tryb
  const targetMode = document.getElementById(`${mode}-mode`);
  if (targetMode) {
    targetMode.classList.remove("hidden");
  }

  // Zaktualizuj aktywny przycisk
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// Dodaj event listenery do przycisków switcha
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    switchMode(mode);
  });
});

// Inicjalizacja - pokaż tryb Generate
switchMode("generate");

/* ====================================================================
   FUNKCJE RESETOWANIA
   ==================================================================== */

/**
 * Resetuje pojedynczą kontrolkę do wartości domyślnej
 * @param {object} ctrl - Obiekt konfiguracji kontrolki
 */
function resetControl(ctrl) {
  // Resetowanie w zależności od typu kontrolki
  if (ctrl.type === "border") {
    // Reset border - ustawiamy width=0, style=none, color=#000000
    tableConfig[ctrl.var] = "none";
    editableTable.style.setProperty(ctrl.var, "none");

    if (ctrl.subvars) {
      tableConfig[ctrl.subvars.width] = "0px";
      tableConfig[ctrl.subvars.style] = "none";
      tableConfig[ctrl.subvars.color] = "#000000";
    }
  } else if (ctrl.type === "margin") {
    // Reset margin - wszystkie strony na 0
    const defaultVal = ctrl.default || "0";
    tableConfig[ctrl.var] = defaultVal;
    editableTable.style.setProperty(ctrl.var, defaultVal);

    if (ctrl.subvars) {
      ["top", "right", "bottom", "left"].forEach(side => {
        tableConfig[ctrl.subvars[side]] = "0px";
      });
    }
  } else if (ctrl.type === "checkbox") {
    // Reset checkbox - przywróć wartość domyślną
    const defaultVal = ctrl.default === true;
    tableConfig[ctrl.var] = defaultVal;

    // Specjalna obsługa dla Show Header
    if (ctrl.var === "--et-show-header") {
      const thead = editableTable.querySelector("thead");
      const headerTab = document.getElementById("headerTab");
      if (thead) {
        thead.style.display = defaultVal ? "" : "none";
      }
      if (headerTab) {
        headerTab.style.display = defaultVal ? "" : "none";
      }
    }

    // Specjalna obsługa dla Show Footer
    if (ctrl.var === "--et-show-footer") {
      const tfoot = editableTable.querySelector("tfoot");
      const footerTab = document.getElementById("footerTab");
      if (tfoot) {
        tfoot.style.display = defaultVal ? "" : "none";
      }
      if (footerTab) {
        footerTab.style.display = defaultVal ? "" : "none";
      }
    }
  } else {
    // Reset standardowej kontrolki
    const defaultVal = ctrl.default || "";
    tableConfig[ctrl.var] = defaultVal;
    editableTable.style.setProperty(ctrl.var, defaultVal);
  }

  // Odśwież interfejs
  updateInputs();
}

/**
 * Resetuje wszystkie kontrolki z aktywnej sekcji
 */
function resetSection() {
  // Znajdź aktywną zakładkę
  const activeTab = document.querySelector(".tab-btn.active");
  if (!activeTab) return;

  const tabName = activeTab.dataset.tab;

  // Znajdź sekcję z tym samym tytułem
  const section = sections.find(s => s.title.toLowerCase() === tabName);
  if (!section) return;

  // Resetuj wszystkie kontrolki w tej sekcji
  section.controls.forEach(ctrl => {
    resetControl(ctrl);
  });

  console.log(`Sekcja "${section.title}" została zresetowana`);
}

/**
 * Resetuje wszystkie kontrolki we wszystkich sekcjach
 */
function resetAll() {
  // Resetuj każdą sekcję
  sections.forEach(section => {
    section.controls.forEach(ctrl => {
      resetControl(ctrl);
    });
  });

  console.log("Wszystkie wartości zostały zresetowane");
}

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
    if (prop === "border") {
      setVar("--et-header-border", val);
      parseBorderValue("--et-header-border", val);
    }
    return;
  }

  // Mapowanie dla sekcji FOOTER
  if (section === "footer") {
    if (prop === "background") setVar("--et-footer-bg", val);
    if (prop === "color") setVar("--et-footer-color", val);
    if (prop === "font-size") setVar("--et-footer-font-size", val);
    if (prop === "border") {
      setVar("--et-footer-border", val);
      parseBorderValue("--et-footer-border", val);
    }
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
    if (prop === "border-bottom") {
      setVar("--et-row-border", val);
      parseBorderValue("--et-row-border", val);
    }
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

    // Parsowanie złożonych wartości
    if (prop === "border") {
      parseBorderValue("--et-border", val);
    }
    if (prop === "margin") {
      parseMarginValue("--et-margin", val);
    }
  }
}

/**
 * Parsuje wartość border i zapisuje sub-wartości (width, style, color)
 * @param {string} varName - Nazwa głównej CSS variable (np. "--et-border")
 * @param {string} value - Wartość border (np. "1px solid #000000" lub "none")
 */
function parseBorderValue(varName, value) {
  if (value === "none") {
    tableConfig[`${varName}-width`] = "0px";
    tableConfig[`${varName}-style`] = "none";
    tableConfig[`${varName}-color`] = "#000000";
    return;
  }

  // Parsowanie: "1px solid #000000"
  const parts = value.trim().split(/\s+/);
  if (parts.length >= 3) {
    tableConfig[`${varName}-width`] = parts[0]; // np. "1px"
    tableConfig[`${varName}-style`] = parts[1]; // np. "solid"
    tableConfig[`${varName}-color`] = parts[2]; // np. "#000000"
  }
}

/**
 * Parsuje wartość margin i zapisuje sub-wartości (top, right, bottom, left)
 * @param {string} varName - Nazwa głównej CSS variable (np. "--et-margin")
 * @param {string} value - Wartość margin (np. "10px 20px 10px 20px" lub "0")
 */
function parseMarginValue(varName, value) {
  const parts = value.trim().split(/\s+/);

  if (parts.length === 1) {
    // Pojedyncza wartość - wszystkie strony
    const val = parts[0];
    tableConfig[`${varName}-top`] = val;
    tableConfig[`${varName}-right`] = val;
    tableConfig[`${varName}-bottom`] = val;
    tableConfig[`${varName}-left`] = val;
  } else if (parts.length === 2) {
    // Dwie wartości - top/bottom, left/right
    tableConfig[`${varName}-top`] = parts[0];
    tableConfig[`${varName}-right`] = parts[1];
    tableConfig[`${varName}-bottom`] = parts[0];
    tableConfig[`${varName}-left`] = parts[1];
  } else if (parts.length === 4) {
    // Cztery wartości - top, right, bottom, left
    tableConfig[`${varName}-top`] = parts[0];
    tableConfig[`${varName}-right`] = parts[1];
    tableConfig[`${varName}-bottom`] = parts[2];
    tableConfig[`${varName}-left`] = parts[3];
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
      parseBorderValue("--et-cell-border", val);
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
  // Aktualizacja standardowych inputów (text, range, color, checkbox)
  document.querySelectorAll(".et-control input").forEach((input) => {
    const v = input.dataset.var;
    if (!v) return;

    const val = tableConfig[v];

    // Obsługa checkbox
    if (input.type === "checkbox") {
      input.checked = val === true;
      return;
    }

    // Jeśli brak wartości (undefined lub null), czyścimy input
    // UWAGA: "inherit" i "transparent" są poprawnymi wartościami i nie powinny być czyszczone
    if (val === undefined || val === null) {
      input.value = "";
      return;
    }

    // Dla range wyciągamy samą liczbę (usuwamy "px")
    // UWAGA: "inherit" w range input jest niepoprawne, więc zamieniamy na wartość domyślną
    if (input.type === "range") {
      if (val === "inherit") {
        input.value = ""; // Czyścimy range dla "inherit"
      } else {
        input.value = parseInt(val) || "";
      }
    } else {
      input.value = val;
    }
  });

  // Aktualizacja selectów (dropdown)
  document.querySelectorAll(".et-control select").forEach((select) => {
    const v = select.dataset.var;
    if (!v) return;

    const val = tableConfig[v];

    // Ustawiamy wartość tylko jeśli jest zdefiniowana (włącznie z "inherit" i "transparent")
    if (val !== undefined && val !== null) {
      select.value = val;
    }
  });

  // Aktualizacja kontrolek border (width + style + color)
  document.querySelectorAll(".et-control-border").forEach((borderControl) => {
    const inputs = borderControl.querySelectorAll("input, select");

    inputs.forEach((input) => {
      const v = input.dataset.var;
      if (!v) return;

      const val = tableConfig[v];

      if (input.type === "range") {
        // Width - wyciągamy liczbę z "Xpx"
        if (val !== undefined && val !== null) {
          input.value = parseInt(val) || 0;
        }
      } else if (input.tagName === "SELECT") {
        // Style - ustawiamy wartość selecta
        if (val !== undefined && val !== null) {
          input.value = val;
        }
      } else if (input.type === "color") {
        // Color - ustawiamy wartość koloru (pomijamy "inherit" i "transparent")
        if (val !== undefined && val !== null && val !== "inherit" && val !== "transparent") {
          input.value = val;
        }
      }
    });
  });

  // Aktualizacja kontrolek margin (top/right/bottom/left)
  document.querySelectorAll(".et-control-margin").forEach((marginControl) => {
    const inputs = marginControl.querySelectorAll("input[type='range']");

    inputs.forEach((input) => {
      const v = input.dataset.var;
      if (!v) return;

      const val = tableConfig[v];

      if (val !== undefined && val !== null) {
        // Wyciągamy liczbę z "Xpx"
        input.value = parseInt(val) || 0;
      }
    });
  });
}

/* ====================================================================
   OBSŁUGA PRZYCISKU "LOAD CSS"
   Wczytuje kod CSS z textarea i przywraca stan edytora
   ==================================================================== */
document.getElementById("load").addEventListener("click", () => {
  const cssText = document.getElementById("css-input").value;
  if (!cssText.trim()) {
    alert("Wklej kod CSS do pola tekstowego");
    return;
  }
  loadCSS(cssText);
  alert("CSS został wczytany pomyślnie!");
});

/* ====================================================================
   OBSŁUGA PRZYCISKÓW RESET
   ==================================================================== */

// Reset All - resetuje wszystkie wartości
document.getElementById("resetAll").addEventListener("click", () => {
  if (confirm("Czy na pewno chcesz zresetować WSZYSTKIE wartości do domyślnych?")) {
    resetAll();
  }
});

// Reset Section - resetuje wartości w aktywnej sekcji
document.getElementById("resetSection").addEventListener("click", () => {
  const activeTab = document.querySelector(".tab-btn.active");
  const sectionName = activeTab ? activeTab.textContent : "tej sekcji";

  if (confirm(`Czy na pewno chcesz zresetować wszystkie wartości w sekcji "${sectionName}"?`)) {
    resetSection();
  }
});
