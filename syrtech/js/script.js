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
    emailButton.addEventListener('click', () => {
        email.classList.add('show');
        emailButton.classList.add('hide');

        if (typeof gtag === 'function') {
            gtag('event', 'show_email_click', {
                event_category: 'contact',
                event_label: 'email_button'
            });
        }
    });
}
