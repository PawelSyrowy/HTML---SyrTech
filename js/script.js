const table = document.querySelector("[data-editable-table]");
table.classList.add("editable-table");

const headerColor = document.getElementById("headerColor");
const fontSize = document.getElementById("fontSize");

headerColor.addEventListener("input", e => {
    table.style.setProperty("--et-header-bg", e.target.value);
});

fontSize.addEventListener("input", e => {
    table.style.setProperty("--et-font-size", e.target.value + "px");
});

function getTableCSS(className){

    const styles = getComputedStyle(table);

    const vars = [
        "--et-header-bg",
        "--et-header-color",
        "--et-font-size",
        "--et-cell-padding",
        "--et-border-color",
        "--et-row-border-color",
        "--et-stripe-color",
        "--et-hover-color",
        "--et-radius",
        "--et-shadow"
    ];

    let css = `.${className} {\n`;

    vars.forEach(v => {
        css += `  ${v}: ${styles.getPropertyValue(v)};\n`;
    });

    css += "}\n";

    return css;
}

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
        document.execCommand("copy");
    });
