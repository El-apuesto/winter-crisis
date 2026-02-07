# Atelier Nocturne - Luxury Essentials

A sophisticated luxury landing page with dark, elegant design and Stripe payment integration.

## Features

- **Dark & Elegant Theme**: Black background with ornate soft silver patterns
- **Hero Section**: Premium brand placeholder with sophisticated typography
- **Product Showcase**: Three luxury products in an elegant grid layout
- **Stripe Integration**: Secure payment processing with automated checkout
- **Print-on-Demand Ready**: Configured for Printful/Printify integration
- **Responsive Design**: Optimized for all devices
- **Premium Typography**: Playfair Display and Cormorant Garamond fonts

## Product Collection

1. **Manhattan Retreat** - $1,125
   - Urban sanctuary woven in strategic fibers

2. **Delivery Treatise** - $1,399
   - The final word in thermal logistics

3. **Geometric Consensus** - $1,015
   - Empirical warmth through conventional wisdom
   - *Deadpan sophisticated take on flat earth aesthetics*

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Stripe account
- Printful or Printify account (for automated fulfillment)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd luxury-brand
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual API keys:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
   STRIPE_SECRET_KEY=sk_live_your_secret_key
   PRINTFUL_API_KEY=your_printful_api_key
   ```

3. **Update Stripe Keys:**
   - Replace `pk_test_your_publishable_key_here` in `script.js`
   - Replace `sk_test_your_secret_key_here` in `server.js`

4. **Configure Print Provider:**
   - Update `getVariantId()` function in `server.js` with your actual product variant IDs
   - Set up webhooks for order fulfillment automation

### Running the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Visit `http://localhost:3000` to view your luxury store.

## Stripe Configuration

1. **Set up Stripe Products:**
   - Create products in your Stripe Dashboard
   - Note the product IDs for integration

2. **Configure Webhooks:**
   - Set up webhook endpoints for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`

3. **Test Mode:**
   - Use Stripe test keys for development
   - Test with Stripe's test card numbers

## Print Provider Integration

### Printful Setup:
1. Create products in Printful Dashboard
2. Note the variant IDs
3. Update `getVariantId()` function
4. Configure Printful API key in `.env`

### Printify Setup:
1. Connect your shop
2. Create products and get variant IDs
3. Update integration code accordingly
4. Set up Printify API credentials

## Customization

### Adding Products:
1. Update `products` object in `script.js`
2. Add new product cards in `index.html`
3. Update variant mappings in `server.js`

### Styling:
- Modify `styles.css` for visual changes
- Update fonts, colors, and layouts
- Add custom animations and effects

### Branding:
- Replace "Atelier Nocturne" with your brand name
- Update logo placeholder with actual brand assets
- Customize typography and messaging

## Deployment

### Vercel:
```bash
npm install -g vercel
vercel --prod
```

### Heroku:
```bash
heroku create your-app-name
git push heroku main
```

### AWS/Other:
- Deploy as Node.js application
- Ensure environment variables are set
- Configure SSL certificates

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable Stripe Radar for fraud protection
- Set up proper CORS policies
- Implement rate limiting for production

## Support

For issues with:
- **Stripe Integration**: Check Stripe Dashboard and API documentation
- **Print Providers**: Refer to Printful/Printify API docs
- **Styling**: Modify CSS variables and breakpoints
- **Functionality**: Check browser console for errors

## License

MIT License - Feel free to customize and deploy for your luxury brand.

---

*Atelier Nocturne - Where thermal engineering meets existential security*
