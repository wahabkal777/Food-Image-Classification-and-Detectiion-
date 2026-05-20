// Protect classification links
document.addEventListener('DOMContentLoaded', () => {
    const classificationLink = document.querySelector('a[href*="classification"]');
    
    // Add event listeners to protected links
    if (classificationLink) {
        classificationLink.addEventListener('click', (e) => {
            // The backend will handle redirection if not logged in
            // So we don't need to prevent default here
        });
    }
});
