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

const emailButton = document.getElementById('email-btn');
const email = document.getElementById('email');

if (emailButton && email) {
    let emailClicks = 0;

    emailButton.addEventListener('click', () => {
        email.classList.add('show');
        emailButton.classList.add('hide');

        emailClicks++;
        console.log('Email clicks:', emailClicks);
    });
}
