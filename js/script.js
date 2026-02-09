function getTableCSS(className){

    const styles = getComputedStyle(editableTable);

    const cssVars = [
        "--et-width",
        "--et-margin",
        "--et-border-collapse",

        "--et-font-family",
        "--et-font-size",
        "--et-line-height",
        "--et-text-align",

        "--et-header-bg",
        "--et-header-color",

        "--et-body-bg",
        "--et-body-color",

        "--et-row-bg",
        "--et-stripe-color",
        "--et-hover-color",

        "--et-table-border",
        "--et-cell-border",
        "--et-row-border",

        "--et-cell-padding",
        "--et-cell-padding-x",
        "--et-cell-padding-y",

        "--et-radius",
        "--et-shadow"
    ];

    let css = `.${className}{\n`;

    cssVars.forEach(v => {
        css += `  ${v}: ${styles.getPropertyValue(v)};\n`;
    });

    css += "}\n";

    return css;
}

const editableTable  = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");

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

        textarea.select();
        navigator.clipboard.writeText(textarea.value);
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

    { label:"Radius", var:"--et-radius", type:"range", min:0, max:30, default:"0px" }
];

const editor = document.querySelector(".editor");

initEditor();

function initEditor(){

    controls.forEach(ctrl => {

        const wrapper = document.createElement("div");

        const label = document.createElement("label");
        label.textContent = ctrl.label;

        const input = document.createElement("input");
        input.type = ctrl.type;

        if(ctrl.type === "range"){
            input.min = ctrl.min;
            input.max = ctrl.max;

            // jeśli default ma px → usuń px do inputa
            input.value = parseInt(ctrl.default);
        }
        else{
            input.value = ctrl.default;
        }

        // ustaw startową variable
        editableTable.style.setProperty(ctrl.var, ctrl.default);

        input.addEventListener("input", e => {

            let val = e.target.value;

            if(ctrl.type === "range"){
                val += "px";
            }

            editableTable.style.setProperty(ctrl.var, val);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);

        editor.appendChild(wrapper);
    });
}

function getTableHTML(className){

    const clone = editableTable.cloneNode(true);

    clone.classList.remove("et-preview");
    clone.className = className;

    return clone.outerHTML;
}
