// Auth Modal Handler
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('authModalLoginForm');
    const signupForm = document.getElementById('authModalSignupForm');
    const closeBtn = document.querySelector('.auth-modal-close');
    
    if (!modal) return; // Modal not present on this page
    
    // Tab switching
    loginTab?.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab?.classList.remove('active');
        loginForm?.classList.add('show');
        signupForm?.classList.remove('show');
    });
    
    signupTab?.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab?.classList.remove('active');
        signupForm?.classList.add('show');
        loginForm?.classList.remove('show');
    });
    
    // Close modal
    closeBtn?.addEventListener('click', () => {
        closeAuthModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeAuthModal();
        }
    });
    
    // Handle form submissions
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authModalLoginEmail').value;
        const password = document.getElementById('authModalLoginPassword').value;
        
        if (!email || !password) {
            showAuthMessage('Please fill all fields', 'error');
            return;
        }
        
        // Submit the form (will redirect if successful)
        loginForm.submit();
    });
    
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('authModalSignupUsername').value;
        const email = document.getElementById('authModalSignupEmail').value;
        const password = document.getElementById('authModalSignupPassword').value;
        
        if (!username || !email || !password) {
            showAuthMessage('Please fill all fields', 'error');
            return;
        }
        
        // Submit the form (will redirect if successful)
        signupForm.submit();
    });
});

// Show auth modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Show message in modal
function showAuthMessage(message, type) {
    const messageDiv = document.getElementById('authModalMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-modal-message ${type}`;
        messageDiv.style.display = 'block';
    }
}

// Toggle password visibility in modal
function toggleAuthPassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}
