// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('.theme-toggle__icon');
    
    // Vercel Analytics event tracking setup
    const trackEvent = (eventName, properties) => {
        if (window.va) {
            window.va.track(eventName, properties);
        }
    };
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Use preferred color scheme as default if available
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkScheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }
      // Listen for theme toggle clicks
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Track theme toggle
        trackEvent('theme_changed', { theme: newTheme });
        
        // Update icon
        updateThemeIcon(newTheme);
    });
    
    // Function to update theme toggle icon
    function updateThemeIcon(theme) {
        themeToggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Track guide selection
    document.querySelectorAll('.guide-selection .card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A') return; // Only track when the actual link is clicked
            
            const guideName = this.querySelector('h2').textContent;
            trackEvent('guide_selected', { name: guideName });
        });
    });
});
