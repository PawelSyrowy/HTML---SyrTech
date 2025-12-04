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

const elems = document.querySelectorAll('.fade-in');
window.addEventListener('scroll', () => {
    elems.forEach(e => {
        if (e.getBoundingClientRect().top < window.innerHeight - 100) {
            e.classList.add('show');
        }
    });
});
