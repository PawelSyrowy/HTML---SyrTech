const tableConfig = {};

const editableTable = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");

// generator tylko dla ustawionych wartości
function css(prop, val) {
  if (val === undefined || val === "") return "";
  return `  ${prop}:${val};\n`;
}

function getTableCSS(className) {
  return `
.${className}{
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

.${className} thead{
${css("background", tableConfig["--et-header-bg"])}
${css("color", tableConfig["--et-header-color"])}
${css("font-size", tableConfig["--et-header-font-size"])}
}

.${className} tbody{
${css("background", tableConfig["--et-body-bg"])}
${css("color", tableConfig["--et-body-color"])}
}

.${className} th,
.${className} td{
${css("border", tableConfig["--et-cell-border"])}
${
  tableConfig["--et-cell-padding-y"] && tableConfig["--et-cell-padding-x"]
    ? `  padding:${tableConfig["--et-cell-padding-y"]} ${tableConfig["--et-cell-padding-x"]};`
    : ""
}
}

.${className} tr{
${css("background", tableConfig["--et-row-bg"])}
${css("border-bottom", tableConfig["--et-row-border"])}
}

.${className} tbody tr:nth-child(even){
${css("background", tableConfig["--et-stripe-bg"])}
}

.${className} tbody tr:hover{
${css("background", tableConfig["--et-hover-bg"])}
}
`;
}

function isValidClass(name) {
  if (!name) return false;
  if (name.startsWith("et-")) return false;
  return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}

const sections = [
  {
    title: "Table",
    controls: [
      { label: "Width", var: "--et-width", type: "text", default: "100%" },
      { label: "Margin", var: "--et-margin", type: "text", default: "" },
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
        default: "",
      },

      { label: "Table BG", var: "--et-bg", type: "color", default: "" },
      { label: "Table color", var: "--et-color", type: "color", default: "" },

      { label: "Border", var: "--et-border", type: "text", default: "" },
      {
        label: "Radius",
        var: "--et-radius",
        type: "range",
        min: 0,
        max: 30,
        default: "0px",
      },
      { label: "Shadow", var: "--et-shadow", type: "text", default: "" },
    ],
  },

  {
    title: "Header",
    controls: [
      { label: "Header BG", var: "--et-header-bg", type: "color", default: "" },
      {
        label: "Header color",
        var: "--et-header-color",
        type: "color",
        default: "",
      },
      {
        label: "Header font size",
        var: "--et-header-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "",
      },
      {
        label: "Header border",
        var: "--et-header-border",
        type: "text",
        default: "",
      },
    ],
  },

  {
    title: "Body",
    controls: [
      { label: "Body BG", var: "--et-body-bg", type: "color", default: "" },
      {
        label: "Body color",
        var: "--et-body-color",
        type: "color",
        default: "",
      },
      {
        label: "Body font size",
        var: "--et-body-font-size",
        type: "range",
        min: 10,
        max: 40,
        default: "",
      },
    ],
  },

  {
    title: "Cells",
    controls: [
      {
        label: "Cell border",
        var: "--et-cell-border",
        type: "text",
        default: "",
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

  {
    title: "Rows",
    controls: [
      { label: "Row BG", var: "--et-row-bg", type: "color", default: "" },
      {
        label: "Row border",
        var: "--et-row-border",
        type: "text",
        default: "",
      },
      { label: "Stripe BG", var: "--et-stripe-bg", type: "color", default: "" },
      { label: "Hover BG", var: "--et-hover-bg", type: "color", default: "" },
    ],
  },
];

const editor = document.querySelector(".editor");

function createControl(ctrl) {
  const wrapper = document.createElement("div");
  wrapper.className = "et-control";

  const label = document.createElement("label");
  label.textContent = ctrl.label;

  const input = document.createElement("input");
  input.type = ctrl.type;
  input.dataset.var = ctrl.var;

  if (ctrl.type === "range") {
    input.min = ctrl.min;
    input.max = ctrl.max;
    input.value = parseInt(ctrl.default);
  } else {
    input.value = ctrl.default;
  }

  // ustaw tylko jeśli istnieje default
  if (ctrl.default) {
    editableTable.style.setProperty(ctrl.var, ctrl.default);
    tableConfig[ctrl.var] = ctrl.default;
  }

  input.addEventListener("input", (e) => {
    let val = e.target.value;

    if (ctrl.type === "range") {
      val += "px";
    }

    if (val === "") {
      editableTable.style.removeProperty(ctrl.var);
      delete tableConfig[ctrl.var];
      return;
    }

    editableTable.style.setProperty(ctrl.var, val);
    tableConfig[ctrl.var] = val;
  });

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return wrapper;
}

function createSection(section) {
  const box = document.createElement("div");
  box.className = "et-section";

  const title = document.createElement("div");
  title.className = "et-section-title";
  title.textContent = section.title;

  box.appendChild(title);

  section.controls.forEach((ctrl) => {
    box.appendChild(createControl(ctrl));
  });

  return box;
}

sections.forEach((sec) => {
  editor.appendChild(createSection(sec));
});

document.getElementById("generate").addEventListener("click", () => {
  const name = document.getElementById("className").value;

  if (!isValidClass(name)) {
    alert("Invalid class name");
    return;
  }

  document.getElementById("output").value = getTableCSS(name);
});

function loadCSS(cssText) {
  // wyciągnij nazwę klasy
  const classMatch = cssText.match(/\.(\w+)\s*\{/);
  if (classMatch) {
    document.getElementById("className").value = classMatch[1];
  }

  // wyczyść poprzednią konfigurację
  Object.keys(tableConfig).forEach((k) => {
    delete tableConfig[k];
    editableTable.style.removeProperty(k);
  });

  // blok główny .class{ ... }
  const mainBlock = cssText.match(/\.[^{]+\{([\s\S]*?)\}/);
  if (!mainBlock) return;

  mainBlock[1].split(";").forEach((line) => {
    const parts = line.split(":");
    if (parts.length !== 2) return;
    mapCssToVar(parts[0].trim(), parts[1].trim());
  });

  // thead
  extractNested(cssText, "thead", (prop, val) =>
    mapCssToVar(prop, val, "head"),
  );

  // tbody
  extractNested(cssText, "tbody", (prop, val) =>
    mapCssToVar(prop, val, "body"),
  );

  // cells
  extractCells(cssText);

  // rows
  extractNested(cssText, "tr", (prop, val) => mapCssToVar(prop, val, "row"));

  // stripe
  extractNested(cssText, "tbody tr:nth-child(even)", (prop, val) =>
    mapCssToVar(prop, val, "stripe"),
  );

  // hover
  extractNested(cssText, "tbody tr:hover", (prop, val) =>
    mapCssToVar(prop, val, "hover"),
  );

  updateInputs();
}

function mapCssToVar(prop, val, section = "main") {
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

  if (section === "head") {
    if (prop === "background") setVar("--et-header-bg", val);
    if (prop === "color") setVar("--et-header-color", val);
    if (prop === "font-size") setVar("--et-header-font-size", val);
    if (prop === "border") setVar("--et-header-border", val);
    return;
  }

  if (section === "body") {
    if (prop === "background") setVar("--et-body-bg", val);
    if (prop === "color") setVar("--et-body-color", val);
    if (prop === "font-size") setVar("--et-body-font-size", val);
    return;
  }

  if (section === "row") {
    if (prop === "background") setVar("--et-row-bg", val);
    if (prop === "border-bottom") setVar("--et-row-border", val);
    return;
  }

  if (section === "stripe") {
    if (prop === "background") setVar("--et-stripe-bg", val);
    return;
  }

  if (section === "hover") {
    if (prop === "background") setVar("--et-hover-bg", val);
    return;
  }

  if (mainMap[prop]) {
    setVar(mainMap[prop], val);
  }
}

function setVar(variable, value) {
  tableConfig[variable] = value;
  editableTable.style.setProperty(variable, value);
}

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

function extractCells(cssText) {
  const match = cssText.match(/td\s*\{([\s\S]*?)\}/);
  if (!match) return;

  match[1].split(";").forEach((line) => {
    const parts = line.split(":");
    if (parts.length !== 2) return;

    const prop = parts[0].trim();
    const val = parts[1].trim();

    if (prop === "border") {
      setVar("--et-cell-border", val);
    }

    if (prop === "padding") {
      const p = val.split(" ");
      if (p.length === 2) {
        setVar("--et-cell-padding-y", p[0]);
        setVar("--et-cell-padding-x", p[1]);
      }
    }
  });
}

function updateInputs() {
  document.querySelectorAll(".et-control input").forEach((input) => {
    const v = input.dataset.var;
    if (!v) return;

    const val = tableConfig[v];

    if (!val) {
      input.value = "";
      return;
    }

    if (input.type === "range") {
      input.value = parseInt(val);
    } else {
      input.value = val;
    }
  });
}

document.getElementById("load").addEventListener("click", () => {
  const cssText = document.getElementById("output").value;
  loadCSS(cssText);
});
