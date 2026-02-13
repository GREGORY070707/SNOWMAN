# Deployment Guide 🚀

This guide walks you through deploying Problem Signal Finder to production.

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Switch Razorpay keys from test to live mode
- [ ] Update payment link to live version
- [ ] Verify all environment variables are set
- [ ] Test Gemini API key has sufficient quota

### 2. Database
- [ ] Run all Supabase migrations
- [ ] Verify `profiles` table exists with `is_pro` and `credits` columns
- [ ] Verify `payments` table exists
- [ ] Set up Row Level Security (RLS) policies

### 3. Supabase Edge Functions
- [ ] Deploy `razorpay-webhook` function
- [ ] Set all required secrets (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET)
- [ ] Test webhook with Razorpay test mode
- [ ] Verify webhook URL is configured in Razorpay dashboard

### 4. Razorpay Configuration
- [ ] Switch to live mode in Razorpay dashboard
- [ ] Create live payment link for ₹99
- [ ] Update payment link in `components/UpgradeButton.tsx`
- [ ] Configure webhook URL with live credentials
- [ ] Test with ₹1 real transaction

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Perfect for React/Vite apps

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   API_KEY=your_live_gemini_key
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set API_KEY "your_live_gemini_key"
   netlify env:set VITE_RAZORPAY_KEY_ID "rzp_live_xxxxxxxxxx"
   netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: GitHub Pages

**Note**: Requires additional configuration for client-side routing.

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://GREGORY070707.github.io/SNOWMAN",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/SNOWMAN/',
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Post-Deployment Steps

### 1. Update Razorpay Webhook URL

In Razorpay Dashboard → Settings → Webhooks:
- Update webhook URL to your production Supabase function
- Example: `https://your-project.supabase.co/functions/v1/razorpay-webhook`
- Ensure webhook secret is set in Supabase

### 2. Test Payment Flow

1. Create a test user account
2. Click "Unlock Pro for ₹99"
3. Complete payment with real card (₹1 test)
4. Verify webhook processes payment
5. Check Pro status updates correctly
6. Verify unlimited searches work

### 3. Monitor Logs

**Supabase Function Logs:**
```bash
supabase functions logs razorpay-webhook --follow
```

**Check for:**
- Webhook signature verification
- Payment processing
- Database updates
- Any errors

### 4. Set Up Error Monitoring (Optional)

**Sentry Integration:**

1. Install Sentry
   ```bash
   npm install @sentry/react
   ```

2. Initialize in `index.tsx`
   ```typescript
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production",
   });
   ```

### 5. Analytics (Optional)

**Google Analytics:**

1. Add to `index.html`
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. Track conversions on Pro upgrade

## Environment Variables Reference

### Frontend (Hosting Platform)
```env
API_KEY=your_live_gemini_key
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (Supabase Secrets)
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your_live_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Troubleshooting

### Build Fails
- Check all dependencies are installed
- Verify TypeScript has no errors
- Ensure environment variables are set

### Payment Not Processing
- Check Supabase function logs
- Verify webhook URL is correct
- Ensure webhook secret matches
- Check Razorpay dashboard for webhook delivery status

### Users Not Upgrading to Pro
- Verify webhook is receiving events
- Check database for payment records
- Ensure `is_pro` field is updating
- Test with Razorpay test mode first

### CORS Errors
- Ensure Supabase Edge Function has correct CORS headers
- Check Supabase project settings

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] Razorpay secret key only in Supabase (never frontend)
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] Webhook signature verification working
- [ ] Rate limiting on API endpoints (if needed)

## Performance Optimization

### 1. Enable Caching
- Configure CDN caching headers
- Cache static assets

### 2. Optimize Images
- Compress images
- Use WebP format
- Lazy load images

### 3. Code Splitting
- Already handled by Vite
- Verify bundle size: `npm run build`

## Monitoring

### Key Metrics to Track
- Payment conversion rate
- Pro user count
- Search usage
- Error rates
- Page load times

### Recommended Tools
- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking
- Supabase Dashboard for database metrics

## Rollback Plan

If issues occur:

1. **Revert to Previous Version**
   ```bash
   git revert HEAD
   git push origin main
   vercel --prod  # or your deployment command
   ```

2. **Switch Back to Test Mode**
   - Update Razorpay keys to test mode
   - Update payment link
   - Redeploy

3. **Database Rollback**
   - Supabase has point-in-time recovery
   - Contact Supabase support if needed

## Support

- **Vercel**: https://vercel.com/support
- **Netlify**: https://www.netlify.com/support/
- **Supabase**: https://supabase.com/support
- **Razorpay**: https://razorpay.com/support/

---

## Quick Deploy Commands

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run deploy
```

Good luck with your launch! 🚀
