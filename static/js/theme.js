// Theme Changer Script
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Define themes
    const themes = {
        default: {
            // Primary colors
            '--bg-primary': '#060617',
            '--bg-secondary': 'linear-gradient(180deg, rgba(4,4,8,0.35), rgba(4,4,8,0.1))',
            '--text-primary': '#ecf8ff',
            '--text-secondary': 'rgba(235,245,255,0.85)',
            
            // Accents - Neon Green and Cyan
            '--accentA': '#00eaff',
            '--accentB': '#36ff7c',
            '--accent-tertiary': '#00cf6f',
            
            // UI Elements
            '--glass': 'rgba(255,255,255,0.04)',
            '--glass-border': 'rgba(255,255,255,0.06)',
            '--navbar-bg': 'linear-gradient(90deg, rgba(57, 131, 138, 0.12), rgba(54,255,124,0.12))',
            '--hero-bg': 'linear-gradient(120deg, rgba(6,10,27,0.85), rgba(10,8,29,0.9))',
            '--blob1': 'linear-gradient(45deg, rgba(0,234,255,0.18), rgba(54,255,124,0.12))',
            '--blob2': 'linear-gradient(45deg, rgba(54,255,124,0.12), rgba(0,234,255,0.18))',
            
            // Forms
            '--input-bg': 'rgba(0,0,0,0.6)',
            '--input-border': 'rgba(0,234,255,0.35)',
            '--input-focus': '#36ff7c',
            
            // Buttons
            '--btn-bg': 'rgba(0,234,255,0.15)',
            '--btn-hover': 'rgba(0,234,255,0.3)',
            
            // Cards
            '--card-bg': 'rgba(255,255,255,0.06)',
            '--card-border': 'rgba(255,255,255,0.12)',
            
            // Image shadow
            '--img-shadow': '0 24px 60px rgba(0,234,255,0.08)',
            '--img-bg': 'rgba(0,0,0,0.3)',
            
            // Text shadow
            '--text-shadow': '0 6px 30px rgba(0,0,0,0.6)'
        },
        light: {
            // Primary colors
            '--bg-primary': '#ffffff',
            '--bg-secondary': 'linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,249,250,0.99))',
            '--text-primary': '#1a1a2e',
            '--text-secondary': 'rgba(26,26,46,0.8)',
            
            // Accents - Professional Blue and Navy
            '--accentA': '#0052cc',
            '--accentB': '#0066ff',
            '--accent-tertiary': '#1e3a5f',
            
            // UI Elements
            '--glass': 'rgba(0,0,0,0.03)',
            '--glass-border': 'rgba(0,0,0,0.08)',
            '--navbar-bg': 'linear-gradient(90deg, rgba(255,255,255,0.98), rgba(248,249,250,0.98))',
            '--hero-bg': 'linear-gradient(120deg, rgba(248,249,250,0.99), rgba(255,255,255,0.99))',
            '--blob1': 'linear-gradient(45deg, rgba(0,82,204,0.08), rgba(30,58,95,0.06))',
            '--blob2': 'linear-gradient(45deg, rgba(30,58,95,0.06), rgba(0,82,204,0.08))',
            
            // Forms
            '--input-bg': '#ffffff',
            '--input-border': '#0052cc',
            '--input-focus': '#0066ff',
            
            // Buttons
            '--btn-bg': 'rgba(0,82,204,0.1)',
            '--btn-hover': 'rgba(0,82,204,0.2)',
            
            // Cards
            '--card-bg': 'rgba(0,0,0,0.02)',
            '--card-border': 'rgba(0,0,0,0.08)',
            
            // Image shadow
            '--img-shadow': '0 4px 15px rgba(0,82,204,0.15)',
            '--img-bg': '#ffffff',
            
            // Text shadow
            '--text-shadow': '0 2px 8px rgba(0,0,0,0.1)'
        },
        colorful: {
            // Primary colors
            '--bg-primary': '#0f0f23',
            '--bg-secondary': 'linear-gradient(180deg, rgba(15,15,35,0.95), rgba(20,20,40,0.9))',
            '--text-primary': '#ffffff',
            '--text-secondary': 'rgba(255,255,255,0.8)',
            
            // Accents - Vibrant Pink and Teal
            '--accentA': '#ff006e',
            '--accentB': '#00f5ff',
            '--accent-tertiary': '#ff0080',
            
            // UI Elements
            '--glass': 'rgba(255,255,255,0.08)',
            '--glass-border': 'rgba(255,255,255,0.15)',
            '--navbar-bg': 'linear-gradient(90deg, rgba(255,0,110,0.2), rgba(0,245,255,0.2))',
            '--hero-bg': 'linear-gradient(120deg, rgba(15,15,35,0.95), rgba(20,20,40,0.98))',
            '--blob1': 'linear-gradient(45deg, rgba(255,0,110,0.25), rgba(0,245,255,0.15))',
            '--blob2': 'linear-gradient(45deg, rgba(0,245,255,0.15), rgba(255,0,110,0.25))',
            
            // Forms
            '--input-bg': 'rgba(0,0,0,0.4)',
            '--input-border': 'rgba(0,245,255,0.4)',
            '--input-focus': '#00f5ff',
            
            // Buttons
            '--btn-bg': 'rgba(255,0,110,0.2)',
            '--btn-hover': 'rgba(255,0,110,0.3)',
            
            // Cards
            '--card-bg': 'rgba(255,255,255,0.08)',
            '--card-border': 'rgba(255,255,255,0.15)',
            
            // Image shadow
            '--img-shadow': '0 0 40px rgba(255,0,110,0.3)',
            '--img-bg': 'rgba(0,0,0,0.4)',
            
            // Text shadow
            '--text-shadow': '0 6px 30px rgba(0,0,0,0.4)'
        },
        minimal: {
            // Primary colors
            '--bg-primary': '#ffffff',
            '--bg-secondary': 'linear-gradient(180deg, rgba(255,255,255,1), rgba(250,250,250,1))',
            '--text-primary': '#222222',
            '--text-secondary': 'rgba(34,34,34,0.7)',
            
            // Accents - Clean Gray and Black
            '--accentA': '#000000',
            '--accentB': '#333333',
            '--accent-tertiary': '#555555',
            
            // UI Elements
            '--glass': 'rgba(0,0,0,0.02)',
            '--glass-border': 'rgba(0,0,0,0.05)',
            '--navbar-bg': 'linear-gradient(90deg, rgba(255,255,255,0.99), rgba(250,250,250,0.99))',
            '--hero-bg': 'linear-gradient(120deg, rgba(255,255,255,0.99), rgba(250,250,250,0.99))',
            '--blob1': 'linear-gradient(45deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))',
            '--blob2': 'linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.04))',
            
            // Forms
            '--input-bg': '#ffffff',
            '--input-border': '#cccccc',
            '--input-focus': '#000000',
            
            // Buttons
            '--btn-bg': 'rgba(0,0,0,0.05)',
            '--btn-hover': 'rgba(0,0,0,0.1)',
            
            // Cards
            '--card-bg': 'rgba(0,0,0,0.02)',
            '--card-border': 'rgba(0,0,0,0.08)',
            
            // Image shadow
            '--img-shadow': '0 2px 8px rgba(0,0,0,0.1)',
            '--img-bg': '#ffffff',
            
            // Text shadow
            '--text-shadow': '0 2px 6px rgba(0,0,0,0.08)'
        }
    };

    const themeNames = Object.keys(themes);
    let currentThemeIndex = 0;

    const themeIcons = {
        default: 'fas fa-moon',
        light: 'fas fa-sun',
        colorful: 'fas fa-palette',
        minimal: 'fas fa-circle'
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themeNames.includes(savedTheme)) {
        currentThemeIndex = themeNames.indexOf(savedTheme);
        applyTheme(savedTheme);
    } else {
        applyTheme(themeNames[0]);
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themeNames.length;
        const newTheme = themeNames[currentThemeIndex];
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Animate the icon
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

    function applyTheme(themeName) {
        const theme = themes[themeName];
        for (const [property, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(property, value);
        }
        body.className = `theme-${themeName}`;
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.className = themeIcons[themeName];
    }
});