// app/static/theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        return; // Exit if button isn't on the page
    }

    const root = document.documentElement;

    // Function to set the theme, save cookie, and update icon
    function applyTheme(theme) {
        root.className = theme;
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        // THIS IS THE CRUCIAL LINE THAT SAVES YOUR CHOICE
        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Add click listener
    themeToggle.addEventListener('click', () => {
        // Determine the new theme by checking the current one
        const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Set initial icon on page load
    const initialTheme = root.classList.contains('dark') ? 'dark' : 'light';
    themeToggle.textContent = initialTheme === 'dark' ? '🌙' : '☀️';
});