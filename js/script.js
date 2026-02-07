const editableTable  = document.querySelector("[data-editable-table]");
editableTable .classList.add("editable-table");

const headerColor = document.getElementById("headerColor");
const fontSize = document.getElementById("fontSize");

headerColor.addEventListener("input", e => {
    editableTable .style.setProperty("--et-header-bg", e.target.value);
});

fontSize.addEventListener("input", e => {
    editableTable .style.setProperty("--et-font-size", e.target.value + "px");
});

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


function getTableCSS(className) {

    const tableStyles = getComputedStyle(editableTable);
    const theadStyles = getComputedStyle(editableTable.querySelector("thead"));
    const thStyles = getComputedStyle(editableTable.querySelector("th"));
    const tdStyles = getComputedStyle(editableTable.querySelector("td"));

    let css = `
.${className}{
  width:${tableStyles.width};
  border-collapse:${tableStyles.borderCollapse};
  font-family:${tableStyles.fontFamily};
  font-size:${tableStyles.fontSize};
  border:${tableStyles.border};
  border-radius:${tableStyles.borderRadius};
  overflow:hidden;
  box-shadow:${tableStyles.boxShadow};
}

.${className} thead{
  background:${theadStyles.backgroundColor};
  color:${theadStyles.color};
}

.${className} th,
.${className} td{
  padding:${tdStyles.padding};
  border-bottom:${tdStyles.borderBottom};
}

.${className} tbody tr:nth-child(even){
  background:${getComputedStyle(
        editableTable.querySelector("tbody tr:nth-child(even)")
    ).backgroundColor};
}

.${className} tbody tr:hover{
  background:${getComputedStyle(
        editableTable.querySelector("tbody tr")
    ).getPropertyValue("--et-hover-color")};
}
`;

    return css;
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