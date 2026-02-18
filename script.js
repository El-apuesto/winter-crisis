// Square Configuration
const square = new Square({
    applicationID: 'sq0idp-MFV0ryJG7e3JPzu4RSHXZg',
    locationId: 'FQA2CHHW2HSWA'
});

let payments;

// Product data
const products = {
    'the-familiar-signal': {
        name: 'The Familiar Signal',
        price: 14900, // Price in cents ($149.00)
        description: 'Cast your signal'
    },
    'premium-reserves': {
        name: 'Premium Reserves',
        price: 14900, // Price in cents ($149.00)
        description: 'Premium thermal protection'
    },
    'fundamental-holdings': {
        name: 'Fundamental Holdings',
        price: 14900, // Price in cents ($149.00)
        description: 'Harness the fundamentals'
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeSquarePayments();
    initializePurchaseButtons();
    setupAnimations();
});

// Initialize Square Payments
async function initializeSquarePayments() {
    try {
        payments = square.payments({ locationId: 'FQA2CHHW2HSWA' });
        
        // Initialize Card payment method
        const card = await payments.card();
        await card.attach('#card-container');
        
        // Store card instance for later use
        window.card = card;
        
    } catch (error) {
        console.error('Failed to initialize Square payments:', error);
        showError('Payment system initialization failed');
    }
}

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
                // Show payment modal
                showPaymentModal(product);
                
            } catch (error) {
                console.error('Payment error:', error);
                showError('Payment failed. Please try again.');
            } finally {
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

// Parallax effect for hero section, crisis bar, and header navigation
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    const crisisBar = document.querySelector('.crisis-bar');
    const crisisLogo = document.querySelector('.crisis-logo');
    const header = document.querySelector('.header');
    const headerLogo = document.querySelector('.header-logo');
    
    // Hero parallax
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Crisis bar parallax - logo moves up when scrolling down, down when scrolling up
    if (crisisLogo) {
        crisisLogo.style.transform = `translateY(${-scrolled * 0.5}px) scale(${1 - scrolled * 0.0005})`;
    }
    
    // Header navigation parallax - moves down against scroll direction
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    
    // Header logo parallax - moves down against scroll direction
    if (headerLogo) {
        headerLogo.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0003})`;
    }
    
    // Crisis bar background effect
    if (crisisBar) {
        crisisBar.style.background = `rgba(0, 0, 0, ${0.95 + scrolled * 0.0002})`;
    }
});

// Add loading states for images
document.querySelectorAll('.image-placeholder').forEach(placeholder => {
    placeholder.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});

// Show payment modal
function showPaymentModal(product) {
    const modal = document.getElementById('payment-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Update modal content with product info
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h3>Complete Purchase</h3>
        <div style="margin-bottom: 1rem;">
            <strong>${product.name}</strong><br>
            ${product.description}<br>
            Price: $${(product.price / 100).toFixed(2)}
        </div>
        <div id="card-container"></div>
        <button id="pay-button">Pay $${(product.price / 100).toFixed(2)}</button>
    `;
    
    // Re-initialize Square card in modal
    initializeSquarePayments();
    
    modal.style.display = 'block';
    
    // Setup close button
    modal.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
    };
    
    // Setup payment button
    document.getElementById('pay-button').onclick = async function() {
        try {
            const card = window.card;
            const result = await card.tokenize();
            
            if (result.status === 'OK') {
                // Process payment
                const response = await fetch('/process-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sourceId: result.token,
                        productId: product.name,
                        amount: product.price
                    })
                });
                
                if (response.ok) {
                    modal.style.display = 'none';
                    showSuccess('Payment successful! Order confirmed.');
                } else {
                    showError('Payment failed. Please try again.');
                }
            } else {
                showError('Card verification failed. Please check your details.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            showError('Payment processing failed. Please try again.');
        }
    };
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
