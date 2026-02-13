# Troubleshooting Guide 🔧

## Black Screen Issue on Vercel

If you're seeing a black screen after deploying to Vercel, follow these steps:

### 1. Check Browser Console

Open Chrome DevTools (F12) and check the Console tab for errors:
- Look for "Supabase URL" and "Supabase Key exists" logs
- Check for any red error messages
- Look for network errors (401, 403, 500)

### 2. Verify Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables**:
```
VITE_SUPABASE_URL=https://nbluagwqvjtvustolkse.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_KEY=your_gemini_api_key
VITE_RAZORPAY_KEY_ID=rzp_test_SFO7iX6k8JucVF
```

**Important**: 
- Variable names must start with `VITE_` for Vite to expose them to the browser
- After adding/changing variables, you MUST redeploy

### 3. Redeploy After Setting Variables

```bash
vercel --prod
```

Or in Vercel Dashboard → Deployments → Redeploy

### 4. Check Network Tab

In Chrome DevTools → Network tab:
- Look for failed requests (red)
- Check if Supabase API calls are working
- Verify auth endpoints are responding

### 5. Common Issues & Fixes

#### Issue: "Cannot read properties of undefined"
**Fix**: Environment variables not set in Vercel
- Add all VITE_ prefixed variables
- Redeploy

#### Issue: Stuck on loading screen
**Fix**: Supabase connection issue
- Verify VITE_SUPABASE_URL is correct
- Verify VITE_SUPABASE_ANON_KEY is correct
- Check Supabase project is active

#### Issue: "Authentication service unavailable"
**Fix**: Check Supabase project status
- Go to Supabase Dashboard
- Verify project is not paused
- Check API settings

#### Issue: White/blank screen with no errors
**Fix**: CSS not loading
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check if Tailwind CDN is loading

### 6. Test Locally First

Before deploying, test locally with production environment:

```bash
npm run build
npm run preview
```

This will catch build-time errors.

### 7. Enable Vercel Logs

In Vercel Dashboard → Your Project → Logs:
- Check Runtime Logs for errors
- Look for build errors
- Check function execution logs

### 8. Quick Fix: Force Redeploy

Sometimes Vercel cache causes issues:

```bash
vercel --prod --force
```

### 9. Verify Build Output

Check that `dist/` folder is created correctly:

```bash
npm run build
ls dist/
```

Should see:
- index.html
- assets/ folder with JS and CSS files

### 10. Emergency Rollback

If nothing works, rollback to previous deployment:

In Vercel Dashboard → Deployments → Find working deployment → Promote to Production

---

## Debugging Checklist

- [ ] Environment variables set in Vercel
- [ ] Variables start with `VITE_` prefix
- [ ] Redeployed after adding variables
- [ ] Browser console shows no errors
- [ ] Supabase project is active
- [ ] Network tab shows successful API calls
- [ ] Local build works (`npm run build && npm run preview`)
- [ ] Cleared browser cache
- [ ] Tried different browser

---

## Still Having Issues?

### Check These Files

1. **lib/supabase.ts** - Should have fallback values
2. **App.tsx** - Should have error handling
3. **index.html** - Should have Tailwind CDN

### Get Help

1. Check Vercel logs for specific errors
2. Check Supabase logs for API errors
3. Share console errors for debugging

### Contact Support

- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support

---

## Quick Test Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check environment variables (local)
echo $VITE_SUPABASE_URL

# Force redeploy to Vercel
vercel --prod --force
```

---

## Expected Console Output (Working)

When the app loads correctly, you should see:
```
Supabase URL: https://nbluagwqvjtvustolkse.supabase.co
Supabase Key exists: true
```

And NO red errors in console.
