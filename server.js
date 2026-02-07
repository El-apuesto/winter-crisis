const express = require('express');
const stripe = require('stripe')('sk_test_your_secret_key_here');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Explicit static file serving
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use('/script.js', express.static(path.join(__dirname, 'script.js')));
app.use('/logo.PNG', express.static(path.join(__dirname, 'logo.PNG')));
app.use('/1.JPEG', express.static(path.join(__dirname, '1.JPEG')));
app.use('/2.JPG', express.static(path.join(__dirname, '2.JPG')));
app.use('/3.JPG', express.static(path.join(__dirname, '3.JPG')));
app.use('/favicon.PNG', express.static(path.join(__dirname, 'favicon.PNG')));

// General static serving
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { productId, productName, price, description } = req.body;
        
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                        description: description,
                        images: [], // Add product images here
                    },
                    unit_amount: price, // Price in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
            metadata: {
                productId: productId,
            }
        });
        
        res.json({ id: session.id });
        
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Success page
app.get('/success', async (req, res) => {
    const { session_id } = req.query;
    
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        // Here you would typically:
        // 1. Save order information to your database
        // 2. Send order confirmation email
        // 3. Trigger Printful/Printify order creation
        // 4. Update inventory
        
        console.log('Payment successful:', session);
        
        // Send order to Printful/Printify (you'll need to implement this)
        await sendOrderToPrintProvider(session);
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order Confirmed - Atelier Nocturne</title>
                <style>
                    body {
                        font-family: 'Cormorant Garamond', serif;
                        background: #000;
                        color: #e8e8e8;
                        text-align: center;
                        padding: 4rem 2rem;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        font-family: 'Playfair Display', serif;
                        font-size: 3rem;
                        margin-bottom: 2rem;
                        color: #f0f0f0;
                    }
                    p {
                        font-size: 1.2rem;
                        line-height: 1.8;
                        color: #a0a0a0;
                        margin-bottom: 2rem;
                    }
                    .order-number {
                        font-family: 'Playfair Display', serif;
                        font-size: 1.5rem;
                        color: #c0c0c0;
                        margin-bottom: 3rem;
                    }
                    a {
                        color: #c0c0c0;
                        text-decoration: none;
                        border: 1px solid rgba(192, 192, 192, 0.3);
                        padding: 1rem 2rem;
                        display: inline-block;
                        transition: all 0.3s ease;
                    }
                    a:hover {
                        background: rgba(192, 192, 192, 0.1);
                        border-color: #c0c0c0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Order Confirmed</h1>
                    <p>Your acquisition has been processed with the precision it deserves.</p>
                    <div class="order-number">Order #${session_id.slice(-8).toUpperCase()}</div>
                    <p>You will receive a confirmation email shortly. Your order will be crafted and dispatched within 3-5 business days.</p>
                    <a href="/">Return to Atelier</a>
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).send('Error processing order confirmation');
    }
});

// Cancel page
app.get('/cancel', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Cancelled - Atelier Nocturne</title>
            <style>
                body {
                    font-family: 'Cormorant Garamond', serif;
                    background: #000;
                    color: #e8e8e8;
                    text-align: center;
                    padding: 4rem 2rem;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin-bottom: 2rem;
                    color: #f0f0f0;
                }
                p {
                    font-size: 1.2rem;
                    line-height: 1.8;
                    color: #a0a0a0;
                    margin-bottom: 2rem;
                }
                a {
                    color: #c0c0c0;
                    text-decoration: none;
                    border: 1px solid rgba(192, 192, 192, 0.3);
                    padding: 1rem 2rem;
                    display: inline-block;
                    transition: all 0.3s ease;
                }
                a:hover {
                    background: rgba(192, 192, 192, 0.1);
                    border-color: #c0c0c0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Order Cancelled</h1>
                <p>Your transaction was not completed. No charges have been made.</p>
                <p>The essentials will wait for your return.</p>
                <a href="/">Return to Atelier</a>
            </div>
        </body>
        </html>
    `);
});

// Function to send order to Printful/Printify
async function sendOrderToPrintProvider(session) {
    // This is where you would integrate with Printful or Printify API
    // Example implementation:
    
    try {
        const orderData = {
            // Map your order data to Printful/Printify format
            external_id: session.id,
            shipping: session.shipping,
            items: [
                {
                    // Product details for Printful/Printify
                    variant_id: getVariantId(session.metadata.productId),
                    quantity: 1
                }
            ],
            recipient: {
                name: session.customer_details.name,
                email: session.customer_details.email,
                address: session.shipping.address
            }
        };
        
        // Send to Printful API (example)
        // const printfulResponse = await fetch('https://api.printful.com/orders', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(orderData)
        // });
        
        console.log('Order sent to print provider:', orderData);
        
    } catch (error) {
        console.error('Error sending order to print provider:', error);
        // You might want to handle this error more gracefully
    }
}

// Helper function to map product IDs to Printful/Printify variant IDs
function getVariantId(productId) {
    const variantMap = {
        'manhattan-retreat': 'your_printful_variant_id_1',
        'delivery-treatise': 'your_printful_variant_id_2',
        'geometric-consensus': 'your_printful_variant_id_3'
    };
    
    return variantMap[productId] || null;
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view your luxury store`);
});
