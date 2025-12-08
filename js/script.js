function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
        });
    }
}

function loadPortfolio() {
    const projects = [
        "components/projects/nomad.html",
        "components/projects/czat.html",
        "components/projects/starwars.html",
        "components/projects/nomad_alt.html"
    ];

    const container = document.getElementById("projects-container");

    projects.forEach(file => {
        loadComponent(null, file, (html) => {
            container.insertAdjacentHTML("beforeend", html);
        });
    });
}
