function getTableCSS(className){

    return `
.${className}{
  width:${tableConfig["--et-width"]};
  margin:${tableConfig["--et-margin"]};
  border-collapse:${tableConfig["--et-border-collapse"]};

  font-family:${tableConfig["--et-font-family"]};
  font-size:${tableConfig["--et-font-size"]};
  line-height:${tableConfig["--et-line-height"]};

  background:${tableConfig["--et-body-bg"]};
  color:${tableConfig["--et-body-color"]};

  border:${tableConfig["--et-table-border"]};
  border-radius:${tableConfig["--et-radius"]};
  box-shadow:${tableConfig["--et-shadow"]};
}

.${className} thead{
  background:${tableConfig["--et-header-bg"]};
  color:${tableConfig["--et-header-color"]};
}

.${className} th{
  text-align:${tableConfig["--et-text-align"]};
  font-weight:${tableConfig["--et-font-weight-header"]};
  border:${tableConfig["--et-cell-border"]};
}

.${className} td{
  text-align:${tableConfig["--et-text-align"]};
  font-weight:${tableConfig["--et-font-weight-body"]};
  border:${tableConfig["--et-cell-border"]};
}

.${className} th,
.${className} td{
  padding:${tableConfig["--et-cell-padding-y"]} ${tableConfig["--et-cell-padding-x"]};
}

.${className} tr{
  background:${tableConfig["--et-row-bg"]};
  border-bottom:${tableConfig["--et-row-border"]};
}

.${className} tbody tr:nth-child(even){
  background:${tableConfig["--et-stripe-color"]};
}

.${className} tbody tr:hover{
  background:${tableConfig["--et-hover-color"]};
}

.${className} thead tr:first-child th:first-child{
  border-top-left-radius:${tableConfig["--et-radius"]};
}

.${className} thead tr:first-child th:last-child{
  border-top-right-radius:${tableConfig["--et-radius"]};
}
`;
}

const tableConfig = {};

const editableTable  = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");
const computed = getComputedStyle(editableTable);

[
    "--et-margin",
    "--et-border-collapse",
    "--et-font-family",
    "--et-line-height",
    "--et-body-bg",
    "--et-body-color",
    "--et-table-border",
    "--et-shadow",
    "--et-text-align",
    "--et-font-weight-header",
    "--et-font-weight-body",
    "--et-row-bg",
    "--et-row-border",
    "--et-stripe-color",
    "--et-cell-border",
].forEach(v=>{
    tableConfig[v] = computed.getPropertyValue(v).trim();
});


function isValidClass(name){
    if(name.startsWith("et-")) return false;
    return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}

document.getElementById("generate")
    .addEventListener("click", () => {

        const name = document.getElementById("className").value;

        if(!isValidClass(name)){
            alert("Invalid class name");
            return;
        }

        document.getElementById("output").value =
            getTableCSS(name);
    });

document.getElementById("copy")
    .addEventListener("click", () => {

        const textarea = document.getElementById("output");

        navigator.clipboard.writeText(textarea.value)
            .catch(() => alert("Copy failed"));
    });

function downloadCSS(filename, text){
    const blob = new Blob([text], {type:"text/css"});
    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = filename;

    a.click();
}

document.getElementById("download")
    .addEventListener("click", () => {

        const name = document.getElementById("className").value;

        if(!isValidClass(name)){
            alert("Invalid class name");
            return;
        }

        const css = getTableCSS(name);

        downloadCSS(name + ".css", css);
    });

function getFullExport(className){

    const css = getTableCSS(className);
    const html = getTableHTML(className);

    return `/* ===== CSS ===== */

${css}

/* ===== HTML ===== */

${html}`;
}

const controls = [
    { label:"Width", var:"--et-width", type:"text", default:"100%" },

    { label:"Font size", var:"--et-font-size", type:"range", min:10, max:40, default:"16px" },

    { label:"Header BG", var:"--et-header-bg", type:"color", default:"transparent" },

    { label:"Header color", var:"--et-header-color", type:"color", default:"#000000" },

    { label:"Cell padding X", var:"--et-cell-padding-x", type:"range", min:0, max:40, default:"0px" },

    { label:"Cell padding Y", var:"--et-cell-padding-y", type:"range", min:0, max:40, default:"0px" },

    { label:"Radius", var:"--et-radius", type:"range", min:0, max:30, default:"0px" },

    { label:"Hover color", var:"--et-hover-color", type:"color", default:"transparent" }
];

const editor = document.querySelector(".editor");

function initEditor(){
    controls.forEach(ctrl => {
        editor.appendChild(createControl(ctrl));
    });
}

function getTableHTML(className){

    const clone = editableTable.cloneNode(true);

    clone.classList.remove("et-preview");
    clone.classList.add(className);

    return clone.outerHTML;
}

function createControl(ctrl){
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = ctrl.label;

    const input = document.createElement("input");
    input.type = ctrl.type;

    if(ctrl.type === "range"){
        input.min = ctrl.min;
        input.max = ctrl.max;
        input.value = parseInt(ctrl.default);
    }else{
        input.value = ctrl.default;
    }

    editableTable.style.setProperty(ctrl.var, ctrl.default);
    tableConfig[ctrl.var] = ctrl.default;

    input.addEventListener("input", e => {

        let val = e.target.value;

        if(ctrl.type === "range"){
            val += "px";
        }

        editableTable.style.setProperty(ctrl.var, val);
        tableConfig[ctrl.var] = val;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    return wrapper;
}

initEditor();
