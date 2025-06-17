// Modern 2025 Indie Game Guide JavaScript

class IndieGameGuide {
    constructor() {
        this.init();
        this.setupAnalytics();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupProgressBar();
        this.setupScrollAnimations();
        this.setupActiveNavigation();
        this.setupScrollToTop();
    }
    
    // Analytics setup
    setupAnalytics() {
        this.trackEvent = (eventName, properties) => {
            if (window.va) {
                window.va.track(eventName, properties);
            }
        };
        
        // Track section navigation
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = link.getAttribute('href').replace('#', '');
                this.trackEvent('section_viewed', { section });
            });
        });
        
        // Track downloads
        document.querySelectorAll('a[href$=".zip"]').forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('guide_downloaded', { 
                    guide: 'indie-game-guide',
                    filename: link.getAttribute('href').split('/').pop()
                });
            });
        });
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
        
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply initial theme
        this.applyTheme(currentTheme);
        this.updateThemeIcon(currentTheme, themeIcon);

        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(currentTheme);
            this.updateThemeIcon(currentTheme, themeIcon);
            
            // Save theme preference
            localStorage.setItem('theme', currentTheme);
            
            // Track theme change
            if (this.trackEvent) {
                this.trackEvent('theme_changed', { theme: currentTheme });
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(currentTheme);
                this.updateThemeIcon(currentTheme, themeIcon);
            }
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        console.log(`Theme changed to: ${theme}`); // For debugging
    }

    updateThemeIcon(theme, iconElement) {
        iconElement.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // Mobile Menu Functionality
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = navMenu.querySelectorAll('.nav__link');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling Navigation
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav__link, .toc-card');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navHeight = document.querySelector('.nav').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Progress Bar Functionality - FIXED
    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight,
                document.body.offsetHeight, 
                document.documentElement.offsetHeight,
                document.body.clientHeight, 
                document.documentElement.clientHeight
            ) - window.innerHeight;
            
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };

        // Throttled scroll handler for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateProgress); // Update on resize too
        updateProgress(); // Initial call
    }

    // Scroll Animations using Intersection Observer
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .stat, .toc-card, .conclusion-item');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Active Navigation Highlighting - FIXED
    setupActiveNavigation() {
        const sections = document.querySelectorAll('.section, .hero');
        const navLinks = document.querySelectorAll('.nav__link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px', // Adjusted margin for better sensitivity
            threshold: 0
        };

        // Initially activate the home link
        const homeLink = document.querySelector('.nav__link[href="#hero"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current nav link
                    const activeLink = document.querySelector(`.nav__link[href="#${currentId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Also update active nav on scroll manually for better reliability
        window.addEventListener('scroll', () => {
            let currentSection = '';
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            // Find which section is in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Scroll to Top Functionality
    setupScrollToTop() {
        // Create scroll to top button
        const scrollToTopButton = document.createElement('button');
        scrollToTopButton.innerHTML = '↑';
        scrollToTopButton.className = 'scroll-to-top';
        scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollToTopButton);

        // Add styles for the button
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all var(--duration-normal) var(--ease-standard);
                z-index: 1000;
                box-shadow: var(--shadow-lg);
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .scroll-to-top:hover {
                background: var(--color-primary-hover);
                transform: translateY(-2px);
                box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 1rem;
                    right: 1rem;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        document.head.appendChild(style);

        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        };

        // Scroll to top on click
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Throttled scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleScrollButton();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
    }
}

// Additional utility functions for enhanced UX
class UtilityFeatures {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }

    // Keyboard Navigation Support
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const navToggle = document.getElementById('nav-toggle');
                const navMenu = document.getElementById('nav-menu');
                
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }

            // Arrow keys for section navigation
            if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToNextSection();
            }
            
            if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToPreviousSection();
            }
        });
    }

    navigateToNextSection() {
        const sections = Array.from(document.querySelectorAll('.section, .hero'));
        const currentSection = this.getCurrentSection(sections);
        const nextSection = sections[currentSection + 1];
        
        if (nextSection) {
            nextSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    navigateToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('.section, .hero'));
        const currentSection = this.getCurrentSection(sections);
        const previousSection = sections[currentSection - 1];
        
        if (previousSection) {
            previousSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    getCurrentSection(sections) {
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop <= scrollPosition) {
                return i;
            }
        }
        return 0;
    }

    // Focus Management for Accessibility
    setupFocusManagement() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                const firstFocusable = navMenu.querySelector(focusableElements);
                if (firstFocusable) {
                    setTimeout(() => firstFocusable.focus(), 100);
                }
            }
        });
    }

    // Respect user's reduced motion preference
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Remove smooth scroll behavior
            document.documentElement.style.scrollBehavior = 'auto';
            
            // Reduce animation durations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Performance optimization for scroll events
class PerformanceOptimizer {
    constructor() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        // Use Intersection Observer for better performance than scroll events
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('.card, .section').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndieGameGuide();
    new UtilityFeatures();
    new PerformanceOptimizer();
    
    // Add loading complete class for any final animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add error handling for graceful degradation
window.addEventListener('error', (e) => {
    console.warn('Non-critical error occurred:', e.error);
    // Continue operation without breaking the user experience
});

// Add support for prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--duration-fast', '0ms');
    document.documentElement.style.setProperty('--duration-normal', '0ms');
}