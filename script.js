const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// dodaj w script.js
const elems = document.querySelectorAll('.fade-in');
window.addEventListener('scroll', () => {
    elems.forEach(e => {
        if (e.getBoundingClientRect().top < window.innerHeight - 100) {
            e.classList.add('show');
        }
    });
});
