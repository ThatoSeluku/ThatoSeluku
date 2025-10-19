// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Configuration for the observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Callback function for intersection observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');
                
                // Optional: Stop observing after animation triggers (performance optimization)
                // Comment out the line below if you want animations to trigger every time element enters viewport
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .zoom-in');
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add staggered animation delays for grid items
    const staggerElements = (selector, baseDelay = 100) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.transitionDelay = `${index * baseDelay}ms`;
        });
    };

    // Apply staggered delays to specific sections
    staggerElements('.experience-card', 150);
    staggerElements('.testimonial-card', 100);
    staggerElements('.certification-card', 80);
    staggerElements('.skill-icon', 150);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add glow effect to buttons on hover
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Parallax effect for hero section (optional enhancement)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
        });
    }

    // Add loading animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 200);
    }
});

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add active state to navigation on scroll (for prototype page)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.project-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});