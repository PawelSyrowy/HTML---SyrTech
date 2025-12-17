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

const showEmailBtn = document.getElementById('show-email-btn');
const emailEl = document.getElementById('email');

if (showEmailBtn && emailEl) {
    let emailClicks = 0;

    showEmailBtn.addEventListener('click', () => {
        emailEl.classList.add('show');
        showEmailBtn.style.display = 'none';

        emailClicks++;
        console.log('Email clicks:', emailClicks);
    });
}
