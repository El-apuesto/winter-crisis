// Stripe Configuration - Replace with your actual publishable key
const stripe = Stripe('pk_test_your_publishable_key_here');

// Product data
const products = {
    'manhattan-retreat': {
        name: 'Manhattan Retreat',
        price: 112500, // Price in cents ($1,125.00)
        description: 'Urban sanctuary woven in strategic fibers'
    },
    'delivery-treatise': {
        name: 'Delivery Treatise',
        price: 139900, // Price in cents ($1,399.00)
        description: 'The final word in thermal logistics'
    },
    'geometric-consensus': {
        name: 'Geometric Consensus',
        price: 101500, // Price in cents ($1,015.00)
        description: 'Empirical warmth through conventional wisdom'
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePurchaseButtons();
    setupAnimations();
});

// Initialize purchase buttons
function initializePurchaseButtons() {
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    
    purchaseButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const productId = this.dataset.productId;
            const product = products[productId];
            
            if (!product) {
                showError('Product not found');
                return;
            }
            
            // Show loading state
            this.classList.add('loading');
            this.textContent = 'Processing...';
            
            try {
                // Create Stripe checkout session
                const response = await fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: productId,
                        productName: product.name,
                        price: product.price,
                        description: product.description
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const session = await response.json();
                
                // Redirect to Stripe Checkout
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id
                });
                
                if (result.error) {
                    throw new Error(result.error.message);
                }
                
            } catch (error) {
                console.error('Error:', error);
                showError('Payment processing failed. Please try again.');
                
                // Reset button state
                this.classList.remove('loading');
                this.textContent = 'Acquire';
            }
        });
    });
}

// Setup animations and interactions
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
    
    // Add hover effects
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(139, 0, 0, 0.9);
        border: 1px solid rgba(192, 192, 192, 0.3);
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        animation: fadeInUp 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 300);
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    successDiv.style.animation = 'fadeInUp 0.3s ease-out';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Smooth scroll for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading states for images
document.querySelectorAll('.image-placeholder').forEach(placeholder => {
    placeholder.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});
