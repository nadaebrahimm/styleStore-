
// Function to handle the newsletter subscription
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter a valid email address.');
                return;
            }
            
            // In a real application, this would send the email to a server
            // For demo purposes, just show a success message
            showNotification('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
}

// Function to handle smooth scrolling for anchor links
function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Function to set up CSS animations for elements as they come into view
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('in-view');
            }
        });
    }
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    
    // Check on initial load
    checkIfInView();
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    setupNewsletterForm();
    setupSmoothScrolling();
    setupScrollAnimations();
    
    // Add animation classes to elements
    document.querySelectorAll('.section-title, .category, .product, .testimonial').forEach(element => {
        element.classList.add('animate-on-scroll');
    });
});