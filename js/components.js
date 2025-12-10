function loadComponent(id, file, callback) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            if (id) {
                document.getElementById(id).innerHTML = data;
            }
            if (callback) callback(data);
        })
        .catch(err => console.error(`Nie udało się załadować: ${file}`, err));
}

function loadPortfolio(id) {
    const projects = [
        "components/projects/nomad.html",
        "components/projects/czat.html",
        "components/projects/starwars.html",
        "components/projects/habitator.html",
        "components/projects/happydroplet.html",
        "components/projects/cleantisy.html"
    ];

    const container = document.getElementById(id);

    projects.forEach(file => {
        loadComponent(null, file, (html) => {
            container.insertAdjacentHTML("beforeend", html);
        });
    });
}