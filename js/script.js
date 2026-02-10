const tableConfig = {};

const editableTable = document.querySelector("[data-et-preview]");
editableTable.classList.add("et-preview");


function getTableCSS(className){

    return `
.${className}{
  width:${tableConfig["--et-width"]};
  margin:${tableConfig["--et-margin"]};
  border-collapse:${tableConfig["--et-border-collapse"]};

  font-family:${tableConfig["--et-font-family"]};
  font-size:${tableConfig["--et-font-size"]};
  line-height:${tableConfig["--et-line-height"]};

  background:${tableConfig["--et-bg"]};
  color:${tableConfig["--et-color"]};

  border:${tableConfig["--et-border"]};
  border-radius:${tableConfig["--et-radius"]};
  box-shadow:${tableConfig["--et-shadow"]};
}

.${className} thead{
  background:${tableConfig["--et-header-bg"]};
  color:${tableConfig["--et-header-color"]};
  font-size:${tableConfig["--et-header-font-size"]};
  border:${tableConfig["--et-header-border"]};
}

.${className} th{
  text-align:${tableConfig["--et-th-align"]};
  font-weight:${tableConfig["--et-th-weight"]};
  border:${tableConfig["--et-cell-border"]};
}

.${className} tbody{
  background:${tableConfig["--et-body-bg"]};
  color:${tableConfig["--et-body-color"]};
  font-size:${tableConfig["--et-body-font-size"]};
}

.${className} td{
  text-align:${tableConfig["--et-td-align"]};
  font-weight:${tableConfig["--et-td-weight"]};
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
  background:${tableConfig["--et-stripe-bg"]};
}

.${className} tbody tr:hover{
  background:${tableConfig["--et-hover-bg"]};
}
`;
}


function isValidClass(name){
    if(!name) return false;
    if(name.startsWith("et-")) return false;
    return /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
}


/* CONTROLS */
const sections = [

    {
        title:"Table",
        controls:[
            {label:"Width", var:"--et-width", type:"text", default:"100%"},
            {label:"Margin", var:"--et-margin", type:"text", default:"0"},
            {label:"Border collapse", var:"--et-border-collapse", type:"text", default:"collapse"},
            {label:"Font family", var:"--et-font-family", type:"text", default:"sans-serif"},
            {label:"Font size", var:"--et-font-size", type:"range", min:10, max:40, default:"16px"},
            {label:"Line height", var:"--et-line-height", type:"text", default:"1.4"},
            {label:"Table BG", var:"--et-bg", type:"color", default:"#ffffff"},
            {label:"Table color", var:"--et-color", type:"color", default:"#000000"},
            {label:"Table border", var:"--et-border", type:"text", default:"none"},
            {label:"Radius", var:"--et-radius", type:"range", min:0, max:30, default:"0px"},
            {label:"Shadow", var:"--et-shadow", type:"text", default:"none"},
        ]
    },

    {
        title:"Header",
        controls:[
            {label:"Header BG", var:"--et-header-bg", type:"color", default:"#ffffff"},
            {label:"Header color", var:"--et-header-color", type:"color", default:"#000000"},
            {label:"Header font size", var:"--et-header-font-size", type:"range", min:10, max:40, default:"16px"},
            {label:"Header border", var:"--et-header-border", type:"text", default:"none"},
            {label:"TH align", var:"--et-th-align", type:"text", default:"left"},
            {label:"TH weight", var:"--et-th-weight", type:"text", default:"normal"},
        ]
    },

    {
        title:"Body",
        controls:[
            {label:"Tbody BG", var:"--et-body-bg", type:"color", default:"#ffffff"},
            {label:"Tbody color", var:"--et-body-color", type:"color", default:"#000000"},
            {label:"Tbody font size", var:"--et-body-font-size", type:"range", min:10, max:40, default:"16px"},
            {label:"TD align", var:"--et-td-align", type:"text", default:"left"},
            {label:"TD weight", var:"--et-td-weight", type:"text", default:"normal"},
        ]
    },

    {
        title:"Cells",
        controls:[
            {label:"Cell border", var:"--et-cell-border", type:"text", default:"none"},
            {label:"Padding X", var:"--et-cell-padding-x", type:"range", min:0, max:40, default:"8px"},
            {label:"Padding Y", var:"--et-cell-padding-y", type:"range", min:0, max:40, default:"6px"},
        ]
    },

    {
        title:"Rows",
        controls:[
            {label:"Row BG", var:"--et-row-bg", type:"color", default:"#ffffff"},
            {label:"Row border", var:"--et-row-border", type:"text", default:"none"},
            {label:"Stripe BG", var:"--et-stripe-bg", type:"color", default:"#f5f5f5"},
            {label:"Hover BG", var:"--et-hover-bg", type:"color", default:"#eeeeee"}
        ]
    }

];



const editor = document.querySelector(".editor");


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

    if(ctrl.default !== ""){
        editableTable.style.setProperty(ctrl.var, ctrl.default);
        tableConfig[ctrl.var] = ctrl.default;
    }

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

function createSection(section){

    const box = document.createElement("div");
    box.className = "et-section";

    const title = document.createElement("div");
    title.className = "et-section-title";
    title.textContent = section.title;

    box.appendChild(title);

    section.controls.forEach(ctrl=>{
        const control = createControl(ctrl);
        control.classList.add("et-control");
        box.appendChild(control);
    });

    return box;
}

sections.forEach(sec=>{
    editor.appendChild(createSection(sec));
});


/* GENERATOR */
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