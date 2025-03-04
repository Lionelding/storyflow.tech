/**
 * Mobile menu functionality
 */
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    if (!mobileMenuToggle || !navLinks || !menuOverlay) return;

    // Toggle menu when hamburger icon is clicked
    mobileMenuToggle.addEventListener('click', function () {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        // Update aria-expanded state
        const isExpanded = navLinks.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);

        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on the overlay
    menuOverlay.addEventListener('click', function () {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    });

    // Close menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        });
    });

    // Set initial ARIA attributes
    mobileMenuToggle.setAttribute('aria-expanded', false);
    mobileMenuToggle.setAttribute('aria-controls', 'navLinks');
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
});