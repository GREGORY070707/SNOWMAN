# 🚀 Launch Checklist for Problem Signal Finder

## ✅ Code Pushed to GitHub

Repository: https://github.com/GREGORY070707/SNOWMAN.git
Branch: `main`
Commit: Razorpay payment integration complete

---

## 📋 Pre-Launch Checklist

### 1. Environment Setup

#### Vercel/Netlify Environment Variables
Set these in your hosting platform dashboard:

```env
API_KEY=your_live_gemini_api_key
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx  # Switch to LIVE key
VITE_SUPABASE_URL=https://nbluagwqvjtvustolkse.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Supabase Edge Function Secrets
Already set (verify these are correct):

```bash
supabase secrets list
# Should show:
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
# - RAZORPAY_WEBHOOK_SECRET
```

### 2. Razorpay Configuration

- [ ] Switch Razorpay account to LIVE mode
- [ ] Get LIVE API keys from Dashboard → Settings → API Keys
- [ ] Create LIVE payment link for ₹99
- [ ] Update payment link in code:
  ```typescript
  // components/UpgradeButton.tsx line 10
  window.open('https://rzp.io/rzp/YOUR_LIVE_LINK', '_blank');
  ```
- [ ] Configure webhook in Razorpay Dashboard:
  - URL: `https://nbluagwqvjtvustolkse.supabase.co/functions/v1/razorpay-webhook`
  - Events: `payment.captured`
  - Active: ✅

### 3. Database Verification

- [ ] `profiles` table exists with columns:
  - `id` (uuid)
  - `first_name` (text)
  - `last_name` (text)
  - `email` (text)
  - `credits` (integer)
  - `is_pro` (boolean)

- [ ] `payments` table exists with columns:
  - `id` (uuid)
  - `user_id` (uuid)
  - `razorpay_order_id` (text)
  - `razorpay_payment_id` (text, unique)
  - `amount` (integer)
  - `currency` (text)
  - `status` (text)
  - `failure_reason` (text, nullable)
  - `metadata` (jsonb, nullable)
  - `created_at` (timestamptz)

- [ ] Row Level Security (RLS) policies enabled

### 4. Testing Before Launch

#### Test with Razorpay Test Mode First

- [ ] Deploy to staging/preview environment
- [ ] Create test user account
- [ ] Click "Unlock Pro for ₹99"
- [ ] Complete payment with test card: `4111 1111 1111 1111`
- [ ] Click "Verify Payment"
- [ ] Verify Pro badge appears
- [ ] Verify credits update to 1000
- [ ] Test unlimited searches (with 0 credits)
- [ ] Check Supabase function logs for errors

#### Test with Live Mode (₹1 Transaction)

- [ ] Switch to live keys
- [ ] Create new test user
- [ ] Complete ₹1 real payment
- [ ] Verify webhook processes correctly
- [ ] Verify Pro upgrade works
- [ ] Refund the ₹1 test payment in Razorpay dashboard

---

## 🚀 Deployment Steps

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from section 1 above

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Your site will be live at**: `https://snowman-xxx.vercel.app`

### Option B: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set API_KEY "your_key"
   netlify env:set VITE_RAZORPAY_KEY_ID "rzp_live_xxx"
   netlify env:set VITE_SUPABASE_URL "https://nbluagwqvjtvustolkse.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_key"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

6. **Your site will be live at**: `https://snowman-xxx.netlify.app`

---

## 🔍 Post-Launch Verification

### Immediate Checks (First 5 Minutes)

- [ ] Site loads correctly
- [ ] Can create new account
- [ ] Can login
- [ ] Search functionality works
- [ ] Upgrade button appears for non-pro users
- [ ] Payment link opens correctly

### Payment Flow Test (First 30 Minutes)

- [ ] Complete a real ₹99 payment
- [ ] Webhook receives notification (check Supabase logs)
- [ ] Payment logged in `payments` table
- [ ] User upgraded to Pro (`is_pro = true`)
- [ ] Credits updated to 1000
- [ ] Pro badge appears
- [ ] Unlimited searches work

### Monitor for First 24 Hours

- [ ] Check Supabase function logs every few hours
- [ ] Monitor Razorpay dashboard for payments
- [ ] Check for any error emails from hosting platform
- [ ] Test from different devices/browsers
- [ ] Verify mobile responsiveness

---

## 📊 Monitoring Setup

### Supabase Function Logs

```bash
supabase functions logs razorpay-webhook --follow
```

Watch for:
- Payment processing success
- Webhook signature verification
- Database update confirmations
- Any errors or warnings

### Razorpay Dashboard

Monitor:
- Payment success rate
- Webhook delivery status
- Failed payments
- Refund requests

### Hosting Platform

Check:
- Build logs
- Runtime errors
- Performance metrics
- Traffic analytics

---

## 🐛 Troubleshooting

### Payment Not Processing

1. Check Supabase function logs:
   ```bash
   supabase functions logs razorpay-webhook
   ```

2. Verify webhook URL in Razorpay dashboard

3. Check webhook secret matches

4. Test webhook manually in Razorpay dashboard

### Pro Status Not Updating

1. Check `payments` table for payment record
2. Verify webhook processed successfully
3. Check user's `is_pro` field in `profiles` table
4. Try "Verify Payment" button
5. Hard refresh browser (Ctrl+Shift+R)

### Build Failures

1. Check all dependencies installed: `npm install`
2. Verify environment variables set
3. Check build logs for specific errors
4. Test build locally: `npm run build`

---

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **Supabase Support**: https://supabase.com/support
- **Razorpay Support**: https://razorpay.com/support/

---

## 🎉 Launch Day Tasks

### Morning of Launch

- [ ] Final test of payment flow
- [ ] Verify all environment variables
- [ ] Check Supabase function is deployed
- [ ] Verify webhook URL is correct
- [ ] Test on mobile device
- [ ] Clear browser cache and test

### During Launch

- [ ] Monitor Supabase logs in real-time
- [ ] Watch Razorpay dashboard
- [ ] Check hosting platform metrics
- [ ] Be ready to rollback if needed

### End of Day

- [ ] Review all payments processed
- [ ] Check for any errors in logs
- [ ] Verify all Pro upgrades successful
- [ ] Document any issues encountered

---

## 🔄 Rollback Plan

If critical issues occur:

1. **Revert Code**
   ```bash
   git revert HEAD
   git push origin main
   vercel --prod  # or netlify deploy --prod
   ```

2. **Switch to Test Mode**
   - Update Razorpay keys to test mode
   - Update payment link
   - Redeploy

3. **Notify Users**
   - If payments affected, contact users
   - Process refunds if necessary

---

## ✅ Final Pre-Launch Checklist

- [ ] All code pushed to GitHub
- [ ] Environment variables set in hosting platform
- [ ] Razorpay switched to LIVE mode
- [ ] Live payment link updated in code
- [ ] Webhook configured with live URL
- [ ] Database tables verified
- [ ] Test payment completed successfully
- [ ] Monitoring tools ready
- [ ] Support contacts saved
- [ ] Rollback plan understood

---

## 🚀 Ready to Launch!

Once all items above are checked, you're ready to go live!

**Your GitHub Repo**: https://github.com/GREGORY070707/SNOWMAN.git

**Next Command**:
```bash
vercel --prod
# or
netlify deploy --prod
```

Good luck with your launch! 🎉
