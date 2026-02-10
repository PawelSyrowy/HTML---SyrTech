const tableConfig = {};

const editableTable = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");


// generator tylko dla ustawionych wartości
function css(prop, val){
    if(!val) return "";
    return `  ${prop}:${val};\n`;
}

function getTableCSS(className){

    return `
.${className}{
${css("width",tableConfig["--et-width"])}
${css("margin",tableConfig["--et-margin"])}
${css("border-collapse",tableConfig["--et-border-collapse"])}

${css("font-family",tableConfig["--et-font-family"])}
${css("font-size",tableConfig["--et-font-size"])}
${css("line-height",tableConfig["--et-line-height"])}

${css("background",tableConfig["--et-bg"])}
${css("color",tableConfig["--et-color"])}

${css("border",tableConfig["--et-border"])}
${css("border-radius",tableConfig["--et-radius"])}
${css("box-shadow",tableConfig["--et-shadow"])}
}

.${className} thead{
${css("background",tableConfig["--et-header-bg"])}
${css("color",tableConfig["--et-header-color"])}
${css("font-size",tableConfig["--et-header-font-size"])}
}

.${className} tbody{
${css("background",tableConfig["--et-body-bg"])}
${css("color",tableConfig["--et-body-color"])}
}

.${className} th,
.${className} td{
${css("border",tableConfig["--et-cell-border"])}
${css("padding", tableConfig["--et-cell-padding-y"] + " " + tableConfig["--et-cell-padding-x"])}
}

.${className} tr{
${css("background",tableConfig["--et-row-bg"])}
${css("border-bottom",tableConfig["--et-row-border"])}
}

.${className} tbody tr:nth-child(even){
${css("background",tableConfig["--et-stripe-bg"])}
}

.${className} tbody tr:hover{
${css("background",tableConfig["--et-hover-bg"])}
}
`;
}

function isValidClass(name){
    if(!name) return false;
    if(name.startsWith("et-")) return false;
    return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}



const sections = [

    {
        title:"Table",
        controls:[
            {label:"Width", var:"--et-width", type:"text", default:"100%"},
            {label:"Font size", var:"--et-font-size", type:"range", min:10, max:40, default:"16px"},
            {label:"Table BG", var:"--et-bg", type:"color", default:""},
            {label:"Table color", var:"--et-color", type:"color", default:""},
            {label:"Radius", var:"--et-radius", type:"range", min:0, max:30, default:"0px"},
        ]
    },

    {
        title:"Header",
        controls:[
            {label:"Header BG", var:"--et-header-bg", type:"color", default:""},
            {label:"Header color", var:"--et-header-color", type:"color", default:""},
        ]
    },

    {
        title:"Body",
        controls:[
            {label:"Body BG", var:"--et-body-bg", type:"color", default:""},
            {label:"Body color", var:"--et-body-color", type:"color", default:""},
        ]
    }

];



const editor = document.querySelector(".editor");

function createControl(ctrl){

    const wrapper = document.createElement("div");
    wrapper.className="et-control";

    const label = document.createElement("label");
    label.textContent = ctrl.label;

    const input = document.createElement("input");
    input.type = ctrl.type;

    if(ctrl.type==="range"){
        input.min=ctrl.min;
        input.max=ctrl.max;
        input.value=parseInt(ctrl.default);
    }else{
        input.value=ctrl.default;
    }

// ustaw tylko jeśli istnieje default
    if(ctrl.default){
        editableTable.style.setProperty(ctrl.var, ctrl.default);
        tableConfig[ctrl.var] = ctrl.default;
    }

    input.addEventListener("input", e=>{

        let val = e.target.value;

        if(ctrl.type==="range"){
            val += "px";
        }

        if(val===""){
            editableTable.style.removeProperty(ctrl.var);
            delete tableConfig[ctrl.var];
            return;
        }

        editableTable.style.setProperty(ctrl.var,val);
        tableConfig[ctrl.var]=val;

    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    return wrapper;
}

function createSection(section){

    const box=document.createElement("div");
    box.className="et-section";

    const title=document.createElement("div");
    title.className="et-section-title";
    title.textContent=section.title;

    box.appendChild(title);

    section.controls.forEach(ctrl=>{
        box.appendChild(createControl(ctrl));
    });

    return box;
}

sections.forEach(sec=>{
    editor.appendChild(createSection(sec));
});



document.getElementById("generate")
    .addEventListener("click",()=>{

        const name=document.getElementById("className").value;

        if(!isValidClass(name)){
            alert("Invalid class name");
            return;
        }

        document.getElementById("output").value =
            getTableCSS(name);

    });
