function getTableCSS(className){

    let vars = "";

    for(const key in tableConfig){
        vars += `  ${key}: ${tableConfig[key]};\n`;
    }

    return `
.${className}{
${vars}
}
`;
}


const tableConfig = {};

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

initEditor();

function initEditor(){
    controls.forEach(ctrl => {
        editor.appendChild(createControl(ctrl));
    });
}

function getTableHTML(className){

    const clone = editableTable.cloneNode(true);

    clone.classList.remove("et-preview");
    clone.classList.add("et-export");
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
