# Razorpay Payment Link Integration (Simplified Approach)

## Overview

You have a Razorpay Payment Link: `https://rzp.io/rzp/plS2cU4`

This is a **simpler alternative** to the full checkout integration. Instead of building Edge Functions and handling payment verification, you can:
1. Redirect users to your payment link
2. Use Razorpay webhooks to get payment notifications
3. Update user profiles when payment succeeds

## Comparison: Payment Link vs Full Integration

### Payment Link Approach (Simpler)
✅ No Edge Functions needed
✅ No signature verification code
✅ Razorpay handles the checkout UI
✅ Faster to implement
❌ Less control over UX
❌ Redirects away from your app
❌ Harder to customize

### Full Checkout Integration (What we spec'd)
✅ Seamless in-app experience
✅ Full control over UI/UX
✅ No redirects
✅ Better user experience
❌ More code to write
❌ Requires Edge Functions
❌ More complex testing

## Option 1: Quick Payment Link Integration

### Step 1: Update UpgradeButton Component

Create `components/UpgradeButton.tsx`:

```typescript
import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface UpgradeButtonProps {
  userProfile: UserProfile;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({ userProfile }) => {
  const handleUpgrade = () => {
    // Open payment link in new tab
    window.open('https://rzp.io/rzp/plS2cU4', '_blank');
  };

  if (userProfile.is_pro) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-green-500 fill-green-500" />
        <h3 className="text-sm font-bold text-white">Upgrade to Pro</h3>
      </div>
      <p className="text-xs text-zinc-400 mb-3">
        Get unlimited research + 1000 credits for just ₹99 (one-time)
      </p>
      <button
        onClick={handleUpgrade}
        className="w-full px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
      >
        Unlock Pro for ₹99
        <ExternalLink size={14} />
      </button>
      <p className="text-[10px] text-zinc-500 mt-2 text-center">
        Secure payment via Razorpay
      </p>
    </div>
  );
};
```

### Step 2: Set Up Razorpay Webhook

You need to handle payment success notifications from Razorpay.

#### 2.1 Create Webhook Edge Function

Create `supabase/functions/razorpay-webhook/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

serve(async (req) => {
  try {
    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();
    
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? '';
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      
      // Extract user email or ID from payment notes
      const userEmail = payment.email;
      const paymentId = payment.id;
      const amount = payment.amount;

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (profileError || !profile) {
        console.error('User not found:', userEmail);
        return new Response('User not found', { status: 404 });
      }

      // Check if payment already processed
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_payment_id', paymentId)
        .single();

      if (existingPayment) {
        console.log('Payment already processed:', paymentId);
        return new Response('Already processed', { status: 200 });
      }

      // Log payment
      await supabase.from('payments').insert({
        user_id: profile.id,
        razorpay_payment_id: paymentId,
        razorpay_order_id: payment.order_id || '',
        amount: amount,
        currency: payment.currency,
        status: 'success',
        metadata: { email: userEmail },
      });

      // Update user to Pro
      await supabase
        .from('profiles')
        .update({ is_pro: true, credits: 1000 })
        .eq('id', profile.id);

      console.log('User upgraded to Pro:', userEmail);
      return new Response('Success', { status: 200 });
    }

    return new Response('Event not handled', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal error', { status: 500 });
  }
});
```

#### 2.2 Deploy Webhook Function

```bash
supabase functions deploy razorpay-webhook
```

#### 2.3 Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://nbluagwqvjtvustolkse.supabase.co/functions/v1/razorpay-webhook`
3. Select events: `payment.captured`
4. Copy the webhook secret
5. Set it in Supabase:
   ```bash
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### Step 3: Add Manual Verification Page (Optional)

Since payment happens outside your app, create a page where users can verify their payment:

Create `components/VerifyPayment.tsx`:

```typescript
import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const VerifyPayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage('Please log in first');
        setLoading(false);
        return;
      }

      // Refresh profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setMessage('Error checking status');
        setLoading(false);
        return;
      }

      if (profile.is_pro) {
        setMessage('✅ Your Pro upgrade is active!');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage('Payment not yet processed. Please wait a few moments and try again.');
      }
    } catch (err) {
      setMessage('Error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
      <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">
        Completed Payment?
      </h3>
      <p className="text-sm text-zinc-400 mb-4">
        Click below to verify your Pro upgrade
      </p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-green-500 text-black font-bold hover:bg-green-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Checking...
          </>
        ) : (
          'Verify Payment'
        )}
      </button>
      {message && (
        <p className={`text-sm mt-3 ${message.includes('✅') ? 'text-green-400' : 'text-zinc-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};
```

### Step 4: Update Layout

Add both components to `Layout.tsx`:

```typescript
import { UpgradeButton } from './UpgradeButton';
import { VerifyPayment } from './VerifyPayment';

// In sidebar, after user profile:
{userProfile && !userProfile.is_pro && (
  <>
    <UpgradeButton userProfile={userProfile} />
    <div className="mt-4">
      <VerifyPayment />
    </div>
  </>
)}
```

## Option 2: Hybrid Approach (Best of Both)

Use the payment link for quick testing, but implement the full checkout for production:

1. **Development**: Use payment link (faster to test)
2. **Production**: Use full checkout integration (better UX)

You can switch between them with an environment variable:

```typescript
const USE_PAYMENT_LINK = import.meta.env.VITE_USE_PAYMENT_LINK === 'true';

if (USE_PAYMENT_LINK) {
  window.open('https://rzp.io/rzp/plS2cU4', '_blank');
} else {
  // Full checkout integration
  paymentService.openRazorpayCheckout(...);
}
```

## Recommendation

**For Quick Launch**: Use the Payment Link approach
- Faster to implement
- Less code to maintain
- Good enough for MVP

**For Better UX**: Use the Full Checkout Integration (from the spec)
- Professional experience
- No redirects
- Better conversion rates

## Next Steps

Choose your approach:

**Quick Launch with Payment Link**:
```
"Implement the payment link integration"
```

**Full Checkout Integration**:
```
"Run all tasks for razorpay-payment-integration"
```

**Hybrid Approach**:
```
"Set up both payment link and full checkout with feature flag"
```

Which would you prefer?
