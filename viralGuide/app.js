// Viral Game Development Guide - Interactive Features

// Smooth scroll to section function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toggle collapsible sections
function toggleCollapse(contentId) {
    const content = document.getElementById(contentId);
    const icon = content.parentElement.querySelector('.toggle-icon');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('expanded');
        icon.textContent = '−';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Tab switching functionality
function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target;
    clickedButton.classList.add('active');
}

// Navigation highlighting based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Account for fixed navbar
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Back to top button visibility
function updateBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    const scrollThreshold = 300;
    
    if (window.scrollY > scrollThreshold) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

// Navbar background opacity on scroll
function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;
    
    if (window.scrollY > scrollThreshold) {
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
    }
}

// Intersection Observer for fade-in animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections for animation
    const animatedElements = document.querySelectorAll('.card, .nav-card, .psychology-card, .genre-card, .rule-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Search functionality (basic implementation)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm) || searchTerm === '') {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}

// Add click handlers for navigation links
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Add hover effects for interactive elements
function initializeHoverEffects() {
    // Add subtle hover animations to cards
    const cards = document.querySelectorAll('.nav-card, .psychology-card, .genre-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .tab-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close expanded sections
        if (e.key === 'Escape') {
            const expandedSections = document.querySelectorAll('.principle-content.expanded');
            expandedSections.forEach(section => {
                section.classList.remove('expanded');
                const icon = section.parentElement.querySelector('.toggle-icon');
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            });
        }
        
        // Arrow keys for tab navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabs = Array.from(document.querySelectorAll('.tab-btn'));
                const currentIndex = tabs.indexOf(activeTab);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }
                
                tabs[nextIndex].click();
                tabs[nextIndex].focus();
            }
        }
    });
}

// Progress indicator for reading
function initializeProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--color-primary);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Viral Game Development Guide - Initialized');
    
    // Initialize all interactive features
    initializeNavigation();
    initializeAnimations();
    initializeSearch();
    initializeHoverEffects();
    initializeKeyboardNavigation();
    initializeProgressIndicator();
    
    // Set up scroll event listeners
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Debounce scroll events for performance
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            updateActiveNavLink();
            updateBackToTopButton();
            updateNavbarOnScroll();
        }, 10);
    });
    
    // Initialize with current scroll position
    updateActiveNavLink();
    updateBackToTopButton();
    updateNavbarOnScroll();
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-card, .psychology-card, .genre-card {
            transition: transform 0.3s ease;
        }
        
        .principle-content {
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .toggle-icon {
            transition: transform 0.3s ease;
        }
        
        /* Smooth scrolling for the entire page */
        html {
            scroll-behavior: smooth;
        }
        
        /* Focus styles for accessibility */
        .nav-link:focus,
        .tab-btn:focus,
        .principle-card:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Loading state styles */
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        /* Mobile touch improvements */
        @media (max-width: 768px) {
            .nav-card, .psychology-card, .genre-card {
                transition: transform 0.2s ease;
            }
            
            .nav-card:active, .psychology-card:active, .genre-card:active {
                transform: scale(0.98);
            }
        }
    `;
    document.head.appendChild(style);
});

// Performance optimization: Lazy load content
function lazyLoadContent() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Load content or perform actions when element becomes visible
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Error handling and user feedback
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--color-${type === 'error' ? 'error' : 'primary'});
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slide animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
window.toggleCollapse = toggleCollapse;
window.switchTab = switchTab;
window.showNotification = showNotification;

// Analytics tracking (placeholder for future implementation)
function trackUserInteraction(action, element) {
    // This would integrate with analytics services
    console.log(`User interaction: ${action} on ${element}`);
}

// Add interaction tracking to key elements
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-card')) {
        trackUserInteraction('click', 'nav-card');
    } else if (e.target.classList.contains('tab-btn')) {
        trackUserInteraction('tab-switch', e.target.textContent);
    } else if (e.target.classList.contains('principle-card')) {
        trackUserInteraction('expand-principle', 'principle-card');
    }
});

console.log('🚀 All interactive features loaded successfully!');