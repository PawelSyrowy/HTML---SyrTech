const tableConfig = {
    headerBg: "#4CAF50",
    headerColor: "#fff",
    fontSize: "16px",
    cellPadding: "12px",
    rawBorderColor:"#eee",
    radius: "8px",
    stripeColor: "#f3f3f3",
    hoverColor: "#e6f2ff",
    shadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const editableTable  = document.querySelector("[data-editable-table]");

const forbidden = ["editable-table", "editor", "table"];

function isValidClass(name){
    if(forbidden.includes(name)) return false;
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

        textarea.select();
        navigator.clipboard.writeText(textarea.value);
    });


function getTableCSS(className){

    return `
.${className}{
  width:100%;
  border-collapse:collapse;
  font-family:Arial,sans-serif;
  font-size:${tableConfig.fontSize};
  border:1px solid ${tableConfig.borderColor};
  border-radius:${tableConfig.radius};
  box-shadow:${tableConfig.shadow};
}

.${className} thead{
  background:${tableConfig.headerBg};
  color:${tableConfig.headerColor};
}

.${className} th,
.${className} td{
  padding:${tableConfig.cellPadding};
  border-bottom:1px solid ${tableConfig.rawBorderColor};
}

.${className} tbody tr:nth-child(even){
  background:${tableConfig.stripeColor};
}

.${className} tbody tr:hover{
  background:${tableConfig.hoverColor};
}

.${className} thead tr:first-child th:first-child{
  border-top-left-radius:${tableConfig.radius};
}

.${className} thead tr:first-child th:last-child{
  border-top-right-radius:${tableConfig.radius};
}
`;
}

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



function getTableHTML(className){
    return `<table class="${className}">
    <!-- your table -->
</table>`;
}

function getFullExport(className){

    const css = getTableCSS(className);
    const html = getTableHTML(className);

    return `/* ===== CSS ===== */

${css}

/* ===== HTML ===== */

${html}`;
}

const controls = [
    {
        label:"Header color",
        type:"color",
        variable:"headerBg",
        cssVar:"--et-header-bg",
        default:"#4CAF50"
    },
    {
        label:"Font size",
        type:"range",
        variable:"fontSize",
        cssVar:"--et-font-size",
        default:"16px",
        min:12,
        max:24
    },
    {
        label:"Radius",
        type:"range",
        variable:"radius",
        cssVar:"--et-radius",
        default:"8px",
        min:0,
        max:30
    }
];

const editor = document.querySelector(".editor");

controls.forEach(ctrl => {

    const label = document.createElement("label");
    label.textContent = ctrl.label;

    const input = document.createElement("input");
    input.type = ctrl.type;

    if(ctrl.type === "range"){
        input.min = ctrl.min;
        input.max = ctrl.max;
    }

    input.value = ctrl.default;

    tableConfig[ctrl.variable] = ctrl.default;

    input.addEventListener("input", e => {

        let val = e.target.value;

        if(ctrl.type === "range"){
            val += "px";
        }

        tableConfig[ctrl.variable] = val;
        editableTable.style.setProperty(ctrl.cssVar, val);
    });

    editor.appendChild(label);
    editor.appendChild(input);
});